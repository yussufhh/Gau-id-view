# Utility functions for GAU-ID-View Backend
import os
import logging
from functools import wraps
from flask import jsonify, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from models import User, AdminActivity, db
from werkzeug.utils import secure_filename
import uuid
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def setup_logger():
    """Configure application logger"""
    formatter = logging.Formatter(
        '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
    )
    
    if not current_app.debug:
        # Production logging to file
        if not os.path.exists('logs'):
            os.mkdir('logs')
        file_handler = logging.FileHandler('logs/gau_id_view.log')
        file_handler.setFormatter(formatter)
        file_handler.setLevel(logging.INFO)
        current_app.logger.addHandler(file_handler)
    
    current_app.logger.setLevel(logging.INFO)
    current_app.logger.info('GAU-ID-View startup')

def success_response(message="Success", data=None, status_code=200):
    """Standard success response format"""
    response = {
        'success': True,
        'message': message
    }
    if data is not None:
        response['data'] = data
    
    return jsonify(response), status_code

def error_response(message="An error occurred", errors=None, status_code=400):
    """Standard error response format"""
    response = {
        'success': False,
        'message': message
    }
    if errors:
        response['errors'] = errors
    
    return jsonify(response), status_code

def validate_registration_data(data):
    """Validate user registration data"""
    errors = []
    required_fields = ['name', 'reg_number', 'email', 'password', 'department']
    
    for field in required_fields:
        if not data.get(field) or not data.get(field).strip():
            errors.append(f"{field.replace('_', ' ').title()} is required")
    
    # Email validation
    email = data.get('email', '').strip().lower()
    if email and '@' not in email:
        errors.append("Invalid email format")
    
    # Registration number validation
    reg_number = data.get('reg_number', '').strip().upper()
    if reg_number and len(reg_number) < 5:
        errors.append("Registration number must be at least 5 characters")
    
    # Password validation
    password = data.get('password', '')
    if password and len(password) < 6:
        errors.append("Password must be at least 6 characters")
    
    return errors

def validate_profile_data(data):
    """Validate student profile data"""
    errors = []
    
    # Phone validation
    phone = data.get('phone', '').strip()
    if phone and (len(phone) < 10 or not phone.replace('+', '').replace('-', '').replace(' ', '').isdigit()):
        errors.append("Invalid phone number format")
    
    # Year of study validation
    year_of_study = data.get('year_of_study', '')
    if year_of_study and year_of_study not in ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5']:
        errors.append("Invalid year of study")
    
    return errors

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']

def save_uploaded_file(file, folder='general'):
    """Safely save uploaded file"""
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        # Add timestamp to avoid conflicts
        name, ext = os.path.splitext(filename)
        unique_filename = f"{name}_{uuid.uuid4().hex[:8]}{ext}"
        
        upload_path = os.path.join(current_app.config['UPLOAD_FOLDER'], folder)
        if not os.path.exists(upload_path):
            os.makedirs(upload_path)
        
        file_path = os.path.join(upload_path, unique_filename)
        file.save(file_path)
        
        # Return relative path for database storage
        return os.path.join(folder, unique_filename).replace('\\', '/')
    
    return None

def role_required(*allowed_roles):
    """Decorator to require specific roles"""
    def decorator(f):
        @wraps(f)
        @jwt_required()
        def decorated_function(*args, **kwargs):
            current_user_id = get_jwt_identity()
            user = User.query.get(current_user_id)
            
            if not user or not user.is_active:
                return error_response("User not found or inactive", status_code=401)
            
            if user.role not in allowed_roles:
                return error_response("Insufficient permissions", status_code=403)
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def log_admin_activity(admin_id, action, target_user_id=None, details=None):
    """Log admin activities for audit trail"""
    try:
        activity = AdminActivity(
            admin_id=admin_id,
            action=action,
            target_user_id=target_user_id,
            details=details,
            ip_address=request.remote_addr if request else None
        )
        db.session.add(activity)
        db.session.commit()
        logger.info(f"Admin {admin_id} performed action: {action}")
    except Exception as e:
        logger.error(f"Failed to log admin activity: {str(e)}")

def get_current_user():
    """Get current authenticated user"""
    try:
        verify_jwt_in_request()
        current_user_id = get_jwt_identity()
        return User.query.get(current_user_id)
    except:
        return None

def paginate_query(query, page=1, per_page=20):
    """Add pagination to query"""
    try:
        page = int(page) if page else 1
        per_page = int(per_page) if per_page else 20
        per_page = min(per_page, 100)  # Max 100 items per page
        
        total = query.count()
        items = query.offset((page - 1) * per_page).limit(per_page).all()
        
        return {
            'items': items,
            'total': total,
            'page': page,
            'per_page': per_page,
            'pages': (total + per_page - 1) // per_page,
            'has_prev': page > 1,
            'has_next': page * per_page < total
        }
    except ValueError:
        return None

def filter_students(query, filters):
    """Apply filters to student query"""
    if filters.get('department'):
        query = query.filter(User.department.ilike(f"%{filters['department']}%"))
    
    if filters.get('status'):
        query = query.join(User.profile).filter(StudentProfile.status == filters['status'])
    
    if filters.get('year_of_study'):
        query = query.join(User.profile).filter(StudentProfile.year_of_study == filters['year_of_study'])
    
    if filters.get('search'):
        search_term = f"%{filters['search']}%"
        query = query.filter(
            db.or_(
                User.name.ilike(search_term),
                User.reg_number.ilike(search_term),
                User.email.ilike(search_term)
            )
        )
    
    return query

def generate_csv_export(data, filename):
    """Generate CSV export for data"""
    try:
        import csv
        from io import StringIO
        
        output = StringIO()
        if not data:
            return None
        
        writer = csv.DictWriter(output, fieldnames=data[0].keys())
        writer.writeheader()
        writer.writerows(data)
        
        return output.getvalue()
    except Exception as e:
        logger.error(f"Failed to generate CSV: {str(e)}")
        return None

def send_notification_email(user_email, subject, message):
    """Send notification email (placeholder for email service)"""
    # This would integrate with actual email service
    logger.info(f"Email notification sent to {user_email}: {subject}")
    return True

class ValidationError(Exception):
    """Custom validation error"""
    def __init__(self, message, errors=None):
        super().__init__(message)
        self.message = message
        self.errors = errors or []