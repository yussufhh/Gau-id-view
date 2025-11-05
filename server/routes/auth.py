# Authentication Routes for GAU-ID-View
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, create_access_token, create_refresh_token, get_jwt_identity
from models import User, StudentProfile, db
from utils.helpers import (
    success_response, error_response, validate_registration_data,
    log_admin_activity, get_current_user
)
from schemas import (
    RegisterSchema, LoginSchema, ChangePasswordSchema,
    validate_json, UserResponseSchema
)
from marshmallow import ValidationError
from utils.security import (
    is_ip_locked, is_user_locked, record_failed_login_attempt,
    reset_login_attempts, blacklist_token, validate_password_strength,
    security_headers, rate_limit_check, secure_endpoint
)
from utils.logging_config import log_security_event, log_user_activity
from utils.email_service import send_welcome_email, send_status_update_email
from datetime import datetime, timedelta

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new student"""
    try:
        # Get and validate JSON data
        json_data = request.get_json()
        if not json_data:
            return error_response("No JSON data provided", status_code=400)
        
        # Validate with schema
        try:
            schema = RegisterSchema()
            data = schema.load(json_data)
        except Exception as schema_error:
            # Fallback to manual validation if schema fails
            print(f"Schema error: {schema_error}")
            data = json_data
            
            # Manual validation
            required_fields = ['name', 'reg_number', 'email', 'department', 'password']
            missing_fields = [field for field in required_fields if not data.get(field)]
            if missing_fields:
                return error_response(f"Missing required fields: {missing_fields}", status_code=400)
                
            # Validate email format
            import re
            email_pattern = r'^[a-zA-Z0-9._%+-]+@(student\.)?gau\.ac\.ke$'
            if not re.match(email_pattern, data['email']):
                return error_response("Must be a valid GAU email address (@gau.ac.ke or @student.gau.ac.ke)", status_code=400)
        
        # Additional validation
        validation_errors = validate_registration_data(data)
        if validation_errors:
            return error_response("Validation failed", errors=validation_errors, status_code=400)
        
        # Check if user already exists (case-insensitive email check)
        email_lower = data['email'].strip().lower()
        reg_number_upper = data['reg_number'].strip().upper()
        
        existing_user = User.query.filter(
            (User.email == email_lower) | 
            (User.reg_number == reg_number_upper)
        ).first()
        
        if existing_user:
            if existing_user.email == email_lower:
                return error_response("An account with this email already exists", status_code=409)
            else:
                return error_response("An account with this registration number already exists", status_code=409)
        
        # Create new user
        user = User(
            name=data['name'].strip(),
            reg_number=reg_number_upper,
            email=email_lower,
            department=data['department'].strip(),
            role='student'  # Default role for registration
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.flush()  # Get user ID
        
        # Create student profile
        profile = StudentProfile(
            user_id=user.id,
            course=data.get('course', '').strip(),
            year_of_study=data.get('year_of_study', 'Year 1'),
            phone=data.get('phone', '').strip(),
            address=data.get('address', '').strip(),
            status='pending'
        )
        
        db.session.add(profile)
        db.session.commit()
        
        # Send professional welcome email
        try:
            send_welcome_email(user)
            current_app.logger.info(f"Welcome email sent to new student: {user.email}")
        except Exception as e:
            current_app.logger.error(f"Failed to send welcome email to {user.email}: {str(e)}")
            # Don't fail registration if email fails
        
        current_app.logger.info(f"New student registered: {user.email}")
        
        return success_response(
            "Registration successful! A welcome email has been sent to your inbox. Your ID application is now pending review.",
            data={
                'user': user.to_dict(),
                'profile': profile.to_dict()
            },
            status_code=201
        )
        
    except Exception as e:
        db.session.rollback()
        # Debug logging - print to console in development
        print(f"Registration error: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()
        
        current_app.logger.error(f"Registration error: {str(e)}")
        return error_response("Registration failed. Please try again.", status_code=500)

@auth_bp.route('/login', methods=['POST'])
@validate_json(LoginSchema)
@rate_limit_check
@security_headers
def login():
    """Authenticate user and return JWT token"""
    try:
        data = request.validated_json
        ip_address = request.remote_addr
        
        # Check if IP is locked
        if is_ip_locked(ip_address):
            log_security_event('BLOCKED_LOGIN_ATTEMPT_LOCKED_IP', {'ip': ip_address}, 'WARNING')
            return error_response("Too many failed attempts. Please try again later.", status_code=429)
        
        # Find user by registration number
        reg_number = data['reg_number'].strip().upper()
        user = User.query.filter_by(reg_number=reg_number).first()
        
        # Check if user account is locked
        if user and is_user_locked(user.id):
            log_security_event('BLOCKED_LOGIN_ATTEMPT_LOCKED_USER', {'user_id': user.id}, 'WARNING')
            return error_response("Account temporarily locked due to too many failed attempts.", status_code=429)
        
        if not user or not user.check_password(data['password']):
            # Record failed attempt
            user_id = user.id if user else None
            record_failed_login_attempt(ip_address, user_id)
            
            log_security_event(
                'FAILED_LOGIN_ATTEMPT',
                {'reg_number': reg_number, 'ip': ip_address, 'user_exists': user is not None},
                'WARNING'
            )
            return error_response("Invalid credentials", status_code=401)
        
        if not user.is_active:
            log_security_event('INACTIVE_ACCOUNT_LOGIN_ATTEMPT', {'user_id': user.id}, 'WARNING')
            return error_response("Account is deactivated. Please contact admin.", status_code=401)
        
        # Reset login attempts on successful authentication
        reset_login_attempts(ip_address, user.id)
        
        # Create JWT tokens with additional security claims
        additional_claims = {
            'role': user.role,
            'user_agent': request.headers.get('User-Agent', ''),
            'ip_address': ip_address
        }
        
        access_token = create_access_token(
            identity=user.id,
            additional_claims=additional_claims
        )
        refresh_token = create_refresh_token(identity=user.id)
        
        # Get user profile data
        user_data = user.to_dict()
        if user.role == 'student' and user.profile:
            user_data['profile'] = user.profile.to_dict()
        
        # Log successful login
        log_security_event('SUCCESSFUL_LOGIN', {'user_id': user.id, 'role': user.role}, 'INFO')
        current_app.logger.info(f"User login: {user.email}")
        
        return success_response(
            "Login successful",
            data={
                'access_token': access_token,
                'refresh_token': refresh_token,
                'user': user_data
            }
        )
        
    except Exception as e:
        current_app.logger.error(f"Login error: {str(e)}")
        return error_response("Login failed. Please try again.", status_code=500)

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or not user.is_active:
            return error_response("User not found or inactive", status_code=401)
        
        new_token = create_access_token(
            identity=user.id,
            additional_claims={'role': user.role}
        )
        
        return success_response(
            "Token refreshed",
            data={'access_token': new_token}
        )
        
    except Exception as e:
        current_app.logger.error(f"Token refresh error: {str(e)}")
        return error_response("Token refresh failed", status_code=500)

@auth_bp.route('/verify', methods=['GET'])
@jwt_required()
def verify_token():
    """Verify JWT token and return user info"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or not user.is_active:
            return error_response("Invalid token", status_code=401)
        
        user_data = user.to_dict()
        if user.role == 'student' and user.profile:
            user_data['profile'] = user.profile.to_dict()
        
        return success_response(
            "Token is valid",
            data={'user': user_data}
        )
        
    except Exception as e:
        current_app.logger.error(f"Token verification error: {str(e)}")
        return error_response("Token verification failed", status_code=401)

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
@security_headers
def logout():
    """Secure logout with token blacklisting"""
    try:
        from flask_jwt_extended import get_jwt
        
        # Get current token info
        jwt_data = get_jwt()
        jti = jwt_data['jti']
        
        # Blacklist the token
        blacklist_token(jti)
        
        user = get_current_user()
        if user:
            log_security_event('USER_LOGOUT', {'user_id': user.id}, 'INFO')
            current_app.logger.info(f"User logout: {user.email}")
        
        return success_response("Logout successful")
        
    except Exception as e:
        current_app.logger.error(f"Logout error: {str(e)}")
        return success_response("Logout successful")  # Always return success for logout

@auth_bp.route('/change-password', methods=['PUT'])
@jwt_required(fresh=True)
@validate_json(ChangePasswordSchema)
@secure_endpoint(require_fresh=True)
def change_password():
    """Secure password change with validation"""
    try:
        data = request.validated_json
        
        user = get_current_user()
        if not user:
            return error_response("User not found", status_code=404)
        
        # Verify current password
        if not user.check_password(data['current_password']):
            log_security_event(
                'INCORRECT_CURRENT_PASSWORD',
                {'user_id': user.id},
                'WARNING'
            )
            return error_response("Current password is incorrect", status_code=400)
        
        # Validate new password strength
        password_errors = validate_password_strength(data['new_password'])
        if password_errors:
            return error_response("Password validation failed", details=password_errors, status_code=400)
        
        # Check if new password is the same as current
        if user.check_password(data['new_password']):
            return error_response("New password must be different from current password", status_code=400)
        
        # Update password
        user.set_password(data['new_password'])
        user.updated_at = datetime.utcnow()
        db.session.commit()
        
        # Log security event
        log_security_event('PASSWORD_CHANGED', {'user_id': user.id}, 'INFO')
        current_app.logger.info(f"Password changed for user: {user.email}")
        
        return success_response("Password changed successfully")
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Password change error: {str(e)}")
        return error_response("Password change failed", status_code=500)

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    """Initiate password reset process"""
    try:
        data = request.get_json()
        
        if not data or not data.get('email'):
            return error_response("Email is required", status_code=400)
        
        user = User.query.filter_by(email=data['email'].strip().lower()).first()
        
        # Always return success for security (don't reveal if email exists)
        if user and user.is_active:
            # In production, this would send an email with reset token
            current_app.logger.info(f"Password reset requested for: {user.email}")
        
        return success_response(
            "If an account with this email exists, you will receive password reset instructions."
        )
        
    except Exception as e:
        current_app.logger.error(f"Forgot password error: {str(e)}")
        return success_response(
            "If an account with this email exists, you will receive password reset instructions."
        )

@auth_bp.route('/admin/create', methods=['POST'])
@jwt_required()
def create_admin_user():
    """Create admin user (only by existing admin)"""
    try:
        current_user = get_current_user()
        if not current_user or current_user.role != 'admin':
            return error_response("Admin access required", status_code=403)
        
        data = request.get_json()
        validation_errors = validate_registration_data(data)
        if validation_errors:
            return error_response("Validation failed", errors=validation_errors, status_code=400)
        
        # Check if user already exists
        existing_user = User.query.filter(
            (User.email == data['email'].strip().lower()) | 
            (User.reg_number == data['reg_number'].strip().upper())
        ).first()
        
        if existing_user:
            return error_response("User already exists", status_code=409)
        
        # Create admin user
        admin_user = User(
            name=data['name'].strip(),
            reg_number=data['reg_number'].strip().upper(),
            email=data['email'].strip().lower(),
            department=data.get('department', 'Administration').strip(),
            role=data.get('role', 'admin')  # Can be admin or staff
        )
        admin_user.set_password(data['password'])
        
        db.session.add(admin_user)
        db.session.commit()
        
        # Log admin activity
        log_admin_activity(
            admin_id=current_user.id,
            action=f"created_{admin_user.role}_user",
            target_user_id=admin_user.id,
            details=f"Created {admin_user.role} user: {admin_user.email}"
        )
        
        return success_response(
            f"{admin_user.role.title()} user created successfully",
            data=admin_user.to_dict(),
            status_code=201
        )
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Admin creation error: {str(e)}")
        return error_response("Failed to create admin user", status_code=500)