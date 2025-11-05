# Student Routes for GAU-ID-View
from flask import Blueprint, request, jsonify, current_app, send_file
from flask_jwt_extended import jwt_required
from models import User, StudentProfile, Announcement, db
from utils.helpers import (
    success_response, error_response, validate_profile_data,
    role_required, get_current_user, save_uploaded_file
)
from utils.file_handler import save_uploaded_file as secure_save_file, delete_file, get_file_url
from schemas import (
    StudentProfileUpdateSchema, IDApplicationSchema, FileUploadSchema,
    validate_json, validate_args
)
from datetime import datetime, date
import os

student_bp = Blueprint('student', __name__, url_prefix='/student')

@student_bp.route('/profile', methods=['GET'])
@role_required('student')
def get_profile():
    """Get student profile and ID details"""
    try:
        user = get_current_user()
        if not user or not user.profile:
            return error_response("Profile not found", status_code=404)
        
        profile_data = user.profile.to_dict()
        profile_data['user'] = user.to_dict()
        
        return success_response("Profile retrieved successfully", data=profile_data)
        
    except Exception as e:
        current_app.logger.error(f"Get profile error: {str(e)}")
        return error_response("Failed to retrieve profile", status_code=500)

@student_bp.route('/update', methods=['PUT'])
@role_required('student')
def update_profile():
    """Update student profile information"""
    try:
        user = get_current_user()
        if not user or not user.profile:
            return error_response("Profile not found", status_code=404)
        
        data = request.get_json()
        if not data:
            return error_response("No data provided", status_code=400)
        
        # Validate profile data
        validation_errors = validate_profile_data(data)
        if validation_errors:
            return error_response("Validation failed", errors=validation_errors, status_code=400)
        
        profile = user.profile
        
        # Update allowed fields only
        allowed_fields = [
            'phone', 'address', 'next_of_kin', 'next_of_kin_phone',
            'course', 'year_of_study'
        ]
        
        updated_fields = []
        for field in allowed_fields:
            if field in data:
                old_value = getattr(profile, field)
                new_value = data[field].strip() if isinstance(data[field], str) else data[field]
                if old_value != new_value:
                    setattr(profile, field, new_value)
                    updated_fields.append(field)
        
        # Handle date of birth separately
        if 'date_of_birth' in data and data['date_of_birth']:
            try:
                new_dob = datetime.strptime(data['date_of_birth'], '%Y-%m-%d').date()
                if profile.date_of_birth != new_dob:
                    profile.date_of_birth = new_dob
                    updated_fields.append('date_of_birth')
            except ValueError:
                return error_response("Invalid date format. Use YYYY-MM-DD", status_code=400)
        
        # Update user basic info if provided
        user_fields = ['name', 'department']
        for field in user_fields:
            if field in data:
                old_value = getattr(user, field)
                new_value = data[field].strip()
                if old_value != new_value:
                    setattr(user, field, new_value)
                    updated_fields.append(field)
        
        if updated_fields:
            profile.last_updated = datetime.utcnow()
            user.updated_at = datetime.utcnow()
            db.session.commit()
            
            current_app.logger.info(f"Profile updated for user {user.id}: {updated_fields}")
            
            return success_response(
                "Profile updated successfully",
                data={
                    'updated_fields': updated_fields,
                    'profile': profile.to_dict()
                }
            )
        else:
            return success_response("No changes detected")
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Update profile error: {str(e)}")
        return error_response("Failed to update profile", status_code=500)

# Removed duplicate upload_photo function - using the new secure version below

@student_bp.route('/status', methods=['GET'])
@role_required('student')
def get_id_status():
    """Get ID card application status"""
    try:
        user = get_current_user()
        if not user or not user.profile:
            return error_response("Profile not found", status_code=404)
        
        profile = user.profile
        
        # Calculate progress percentage
        status_progress = {
            'pending': 10,
            'reviewing': 30,
            'approved': 60,
            'printed': 80,
            'issued': 100,
            'rejected': 0
        }
        
        progress = status_progress.get(profile.status, 0)
        
        # Get status history
        status_history = []
        if profile.submitted_at:
            status_history.append({
                'status': 'submitted',
                'date': profile.submitted_at.isoformat(),
                'message': 'Application submitted for review'
            })
        
        if profile.status in ['reviewing', 'approved', 'printed', 'issued']:
            status_history.append({
                'status': 'reviewing',
                'date': profile.submitted_at.isoformat(),
                'message': 'Application under review'
            })
        
        if profile.approved_at and profile.status in ['approved', 'printed', 'issued']:
            status_history.append({
                'status': 'approved',
                'date': profile.approved_at.isoformat(),
                'message': 'Application approved'
            })
        
        if profile.printed_at and profile.status in ['printed', 'issued']:
            status_history.append({
                'status': 'printed',
                'date': profile.printed_at.isoformat(),
                'message': 'ID card printed'
            })
        
        if profile.issued_at and profile.status == 'issued':
            status_history.append({
                'status': 'issued',
                'date': profile.issued_at.isoformat(),
                'message': 'ID card issued - ready for collection'
            })
        
        if profile.status == 'rejected':
            status_history.append({
                'status': 'rejected',
                'date': profile.last_updated.isoformat(),
                'message': f'Application rejected: {profile.rejection_reason or "No reason provided"}'
            })
        
        # Next steps
        next_steps = {
            'pending': 'Your application is waiting for review. Please ensure all required information is complete.',
            'reviewing': 'Your application is being reviewed by the admin. You will be notified of any updates.',
            'approved': 'Your ID card has been approved and is queued for printing.',
            'printed': 'Your ID card has been printed. You will be notified when ready for collection.',
            'issued': 'Your ID card is ready for collection at the Student Services office.',
            'rejected': 'Your application was rejected. Please review the reason and resubmit if necessary.'
        }
        
        status_data = {
            'current_status': profile.status,
            'progress_percentage': progress,
            'id_number': profile.id_number,
            'submitted_date': profile.submitted_at.isoformat() if profile.submitted_at else None,
            'expiry_date': profile.expiry_date.isoformat() if profile.expiry_date else None,
            'next_steps': next_steps.get(profile.status, ''),
            'status_history': status_history,
            'rejection_reason': profile.rejection_reason if profile.status == 'rejected' else None,
            'admin_notes': profile.admin_notes
        }
        
        return success_response("Status retrieved successfully", data=status_data)
        
    except Exception as e:
        current_app.logger.error(f"Get status error: {str(e)}")
        return error_response("Failed to retrieve status", status_code=500)

@student_bp.route('/notifications', methods=['GET'])
@role_required('student')
def get_notifications():
    """Get student notifications and announcements"""
    try:
        # Get active announcements for students
        announcements = Announcement.query.filter(
            (Announcement.target_role.in_(['all', 'student'])) &
            (Announcement.is_active == True) &
            ((Announcement.expires_at == None) | (Announcement.expires_at > datetime.utcnow()))
        ).order_by(Announcement.priority.desc(), Announcement.created_at.desc()).all()
        
        # Get personal notifications (based on profile status changes)
        user = get_current_user()
        personal_notifications = []
        
        if user and user.profile:
            profile = user.profile
            
            # Check for status updates
            if profile.status == 'approved' and profile.approved_at:
                personal_notifications.append({
                    'id': f"approval_{profile.id}",
                    'title': 'ID Application Approved',
                    'message': 'Your ID card application has been approved and is now queued for printing.',
                    'priority': 'high',
                    'created_at': profile.approved_at.isoformat(),
                    'type': 'status_update'
                })
            
            if profile.status == 'printed' and profile.printed_at:
                personal_notifications.append({
                    'id': f"printed_{profile.id}",
                    'title': 'ID Card Printed',
                    'message': 'Your ID card has been printed. You will be notified when ready for collection.',
                    'priority': 'high',
                    'created_at': profile.printed_at.isoformat(),
                    'type': 'status_update'
                })
            
            if profile.status == 'issued' and profile.issued_at:
                personal_notifications.append({
                    'id': f"issued_{profile.id}",
                    'title': 'ID Card Ready for Collection',
                    'message': 'Your ID card is ready for collection at the Student Services office.',
                    'priority': 'urgent',
                    'created_at': profile.issued_at.isoformat(),
                    'type': 'status_update'
                })
            
            if profile.status == 'rejected':
                personal_notifications.append({
                    'id': f"rejected_{profile.id}",
                    'title': 'ID Application Rejected',
                    'message': f'Your ID application was rejected. Reason: {profile.rejection_reason or "No reason provided"}',
                    'priority': 'high',
                    'created_at': profile.last_updated.isoformat(),
                    'type': 'status_update'
                })
        
        # Combine and sort notifications
        all_notifications = []
        
        # Add announcements
        for announcement in announcements:
            all_notifications.append({
                'id': f"announcement_{announcement.id}",
                'title': announcement.title,
                'message': announcement.message,
                'priority': announcement.priority,
                'created_at': announcement.created_at.isoformat(),
                'type': 'announcement',
                'expires_at': announcement.expires_at.isoformat() if announcement.expires_at else None
            })
        
        # Add personal notifications
        all_notifications.extend(personal_notifications)
        
        # Sort by priority and date
        priority_order = {'urgent': 4, 'high': 3, 'medium': 2, 'low': 1}
        all_notifications.sort(
            key=lambda x: (priority_order.get(x['priority'], 0), x['created_at']),
            reverse=True
        )
        
        return success_response(
            "Notifications retrieved successfully",
            data={
                'notifications': all_notifications,
                'unread_count': len(personal_notifications)
            }
        )
        
    except Exception as e:
        current_app.logger.error(f"Get notifications error: {str(e)}")
        return error_response("Failed to retrieve notifications", status_code=500)

@student_bp.route('/resubmit', methods=['POST'])
@role_required('student')
def resubmit_application():
    """Resubmit rejected application"""
    try:
        user = get_current_user()
        if not user or not user.profile:
            return error_response("Profile not found", status_code=404)
        
        profile = user.profile
        if profile.status != 'rejected':
            return error_response("Only rejected applications can be resubmitted", status_code=400)
        
        # Reset application status
        profile.status = 'pending'
        profile.submitted_at = datetime.utcnow()
        profile.rejection_reason = None
        profile.admin_notes = None
        profile.last_updated = datetime.utcnow()
        
        db.session.commit()
        
        current_app.logger.info(f"Application resubmitted for user {user.id}")
        
        return success_response(
            "Application resubmitted successfully. It will be reviewed again.",
            data={'status': 'pending'}
        )
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Resubmit error: {str(e)}")
        return error_response("Failed to resubmit application", status_code=500)

@student_bp.route('/dashboard-stats', methods=['GET'])
@role_required('student')
def get_dashboard_stats():
    """Get dashboard statistics for student"""
    try:
        user = get_current_user()
        if not user or not user.profile:
            return error_response("Profile not found", status_code=404)
        
        profile = user.profile
        
        # Calculate days since application
        days_since_application = 0
        if profile.submitted_at:
            days_since_application = (datetime.utcnow() - profile.submitted_at).days
        
        # Calculate days until expiry
        days_until_expiry = None
        if profile.expiry_date:
            days_until_expiry = (profile.expiry_date - date.today()).days
        
        stats = {
            'application_status': profile.status,
            'days_since_application': days_since_application,
            'days_until_expiry': days_until_expiry,
            'profile_completion': calculate_profile_completion(user, profile),
            'id_number': profile.id_number,
            'has_photo': bool(profile.photo_url),
            'card_issued': profile.card_issued,
            'card_printed': profile.card_printed
        }
        
        return success_response("Dashboard stats retrieved successfully", data=stats)
        
    except Exception as e:
        current_app.logger.error(f"Dashboard stats error: {str(e)}")
        return error_response("Failed to retrieve dashboard stats", status_code=500)

def calculate_profile_completion(user, profile):
    """Calculate profile completion percentage"""
    total_fields = 12
    completed_fields = 0
    
    # Required user fields
    if user.name: completed_fields += 1
    if user.reg_number: completed_fields += 1
    if user.email: completed_fields += 1
    if user.department: completed_fields += 1
    
    # Profile fields
    if profile.phone: completed_fields += 1
    if profile.date_of_birth: completed_fields += 1
    if profile.address: completed_fields += 1
    if profile.next_of_kin: completed_fields += 1
    if profile.next_of_kin_phone: completed_fields += 1
    if profile.course: completed_fields += 1
    if profile.year_of_study: completed_fields += 1
    if profile.photo_url: completed_fields += 1
    
    return round((completed_fields / total_fields) * 100)

@student_bp.route('/upload-photo', methods=['POST'])
@role_required('student')
def upload_photo():
    """Upload profile photo"""
    try:
        user = get_current_user()
        if not user:
            return error_response("User not found", status_code=404)
        
        profile = user.profile
        if not profile:
            return error_response("Student profile not found", status_code=404)
        
        # Check if file is present
        if 'photo' not in request.files:
            return error_response("No photo file provided", status_code=400)
        
        file = request.files['photo']
        if file.filename == '':
            return error_response("No file selected", status_code=400)
        
        # Save the file
        success, message, file_path = secure_save_file(
            file, user.id, 'photo', 'profiles'
        )
        
        if not success:
            return error_response(message, status_code=400)
        
        # Delete old photo if exists
        if profile.photo_url:
            delete_file(profile.photo_url)
        
        # Update profile with new photo path
        profile.photo_url = file_path
        profile.last_updated = datetime.utcnow()
        db.session.commit()
        
        current_app.logger.info(f"Photo uploaded for user {user.id}: {file_path}")
        
        return success_response(
            message="Photo uploaded successfully",
            data={
                'photo_url': get_file_url(file_path),
                'uploaded_at': datetime.utcnow().isoformat()
            }
        )
        
    except Exception as e:
        current_app.logger.error(f"Photo upload error: {str(e)}")
        return error_response("Photo upload failed", status_code=500)

@student_bp.route('/upload-document', methods=['POST'])
@role_required('student')
def upload_document():
    """Upload supporting document"""
    try:
        user = get_current_user()
        if not user:
            return error_response("User not found", status_code=404)
        
        # Check if file is present
        if 'document' not in request.files:
            return error_response("No document file provided", status_code=400)
        
        file = request.files['document']
        if file.filename == '':
            return error_response("No file selected", status_code=400)
        
        # Get document description
        description = request.form.get('description', '')
        
        # Save the file
        success, message, file_path = secure_save_file(
            file, user.id, 'document', 'supporting'
        )
        
        if not success:
            return error_response(message, status_code=400)
        
        current_app.logger.info(f"Document uploaded for user {user.id}: {file_path}")
        
        return success_response(
            message="Document uploaded successfully",
            data={
                'file_path': file_path,
                'file_url': get_file_url(file_path),
                'description': description,
                'uploaded_at': datetime.utcnow().isoformat()
            }
        )
        
    except Exception as e:
        current_app.logger.error(f"Document upload error: {str(e)}")
        return error_response("Document upload failed", status_code=500)

@student_bp.route('/files/<path:filename>')
def serve_file(filename):
    """Serve uploaded files (for development only)"""
    try:
        upload_dir = current_app.config.get('UPLOAD_FOLDER', 'uploads')
        file_path = os.path.join(upload_dir, filename)
        
        if not os.path.exists(file_path):
            return error_response("File not found", status_code=404)
        
        return send_file(file_path)
        
    except Exception as e:
        current_app.logger.error(f"File serve error: {str(e)}")
        return error_response("Failed to serve file", status_code=500)