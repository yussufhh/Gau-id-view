# API Documentation using Flask-RESTX for GAU-ID-View
from flask_restx import Api, Resource, fields, Namespace
from flask import Blueprint

# Create API blueprint
api_bp = Blueprint('api_docs', __name__)

# Initialize Flask-RESTX
api = Api(
    api_bp,
    version='1.0.0',
    title='GAU-ID-View API',
    description='Garissa University Student ID Management System API',
    doc='/docs/',
    prefix='/api/v1'
)

# Define namespaces
auth_ns = Namespace('auth', description='Authentication operations')
student_ns = Namespace('student', description='Student operations')
admin_ns = Namespace('admin', description='Admin operations')
files_ns = Namespace('files', description='File operations')

api.add_namespace(auth_ns, path='/auth')
api.add_namespace(student_ns, path='/student')
api.add_namespace(admin_ns, path='/admin')
api.add_namespace(files_ns, path='/files')

# Authentication models
auth_login_model = api.model('AuthLogin', {
    'email': fields.String(required=True, description='User email or registration number'),
    'password': fields.String(required=True, description='User password')
})

auth_register_model = api.model('AuthRegister', {
    'name': fields.String(required=True, description='Full name'),
    'reg_number': fields.String(required=True, description='Registration number'),
    'email': fields.String(required=True, description='Email address'),
    'department': fields.String(required=True, description='Academic department'),
    'password': fields.String(required=True, description='Password (min 8 chars, must include uppercase, lowercase, number, special char)')
})

auth_token_model = api.model('AuthToken', {
    'access_token': fields.String(description='JWT access token'),
    'refresh_token': fields.String(description='JWT refresh token'),
    'user': fields.Raw(description='User information')
})

change_password_model = api.model('ChangePassword', {
    'current_password': fields.String(required=True, description='Current password'),
    'new_password': fields.String(required=True, description='New password')
})

# User models
user_model = api.model('User', {
    'id': fields.Integer(description='User ID'),
    'name': fields.String(description='Full name'),
    'reg_number': fields.String(description='Registration number'),
    'email': fields.String(description='Email address'),
    'department': fields.String(description='Academic department'),
    'role': fields.String(description='User role', enum=['student', 'staff', 'admin']),
    'is_active': fields.Boolean(description='Account status'),
    'created_at': fields.DateTime(description='Account creation date'),
    'updated_at': fields.DateTime(description='Last update date')
})

# Student profile models
student_profile_model = api.model('StudentProfile', {
    'id': fields.Integer(description='Profile ID'),
    'user_id': fields.Integer(description='User ID'),
    'phone': fields.String(description='Phone number (+254XXXXXXXXX)'),
    'course': fields.String(description='Course of study'),
    'year_of_study': fields.String(description='Year of study', enum=['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Postgraduate']),
    'address': fields.String(description='Physical address'),
    'date_of_birth': fields.Date(description='Date of birth'),
    'next_of_kin': fields.String(description='Next of kin name'),
    'next_of_kin_phone': fields.String(description='Next of kin phone'),
    'status': fields.String(description='Application status', enum=['pending', 'reviewing', 'approved', 'rejected', 'printed', 'issued']),
    'id_number': fields.String(description='Generated ID number'),
    'photo_url': fields.String(description='Profile photo URL'),
    'submitted_at': fields.DateTime(description='Application submission date'),
    'approved_at': fields.DateTime(description='Approval date'),
    'printed_at': fields.DateTime(description='Print date'),
    'issued_at': fields.DateTime(description='Issue date'),
    'expiry_date': fields.Date(description='ID expiry date'),
    'rejection_reason': fields.String(description='Rejection reason'),
    'admin_notes': fields.String(description='Admin notes'),
    'card_printed': fields.Boolean(description='Card printed status'),
    'card_issued': fields.Boolean(description='Card issued status'),
    'last_updated': fields.DateTime(description='Last update timestamp')
})

profile_update_model = api.model('ProfileUpdate', {
    'phone': fields.String(description='Phone number'),
    'course': fields.String(description='Course of study'),
    'year_of_study': fields.String(description='Year of study'),
    'address': fields.String(description='Physical address'),
    'date_of_birth': fields.Date(description='Date of birth'),
    'next_of_kin': fields.String(description='Next of kin name'),
    'next_of_kin_phone': fields.String(description='Next of kin phone')
})

id_application_model = api.model('IDApplication', {
    'phone': fields.String(required=True, description='Phone number (+254XXXXXXXXX)'),
    'course': fields.String(required=True, description='Course of study'),
    'year_of_study': fields.String(required=True, description='Year of study'),
    'address': fields.String(required=True, description='Physical address'),
    'date_of_birth': fields.Date(required=True, description='Date of birth'),
    'next_of_kin': fields.String(required=True, description='Next of kin name'),
    'next_of_kin_phone': fields.String(required=True, description='Next of kin phone')
})

# Admin models
application_action_model = api.model('ApplicationAction', {
    'action': fields.String(required=True, description='Action to take', enum=['approve', 'reject', 'review']),
    'reason': fields.String(description='Reason for action'),
    'admin_notes': fields.String(description='Admin notes')
})

bulk_action_model = api.model('BulkAction', {
    'application_ids': fields.List(fields.Integer, required=True, description='List of application IDs'),
    'action': fields.String(required=True, description='Bulk action', enum=['approve', 'reject', 'delete']),
    'reason': fields.String(description='Reason for action')
})

announcement_model = api.model('Announcement', {
    'title': fields.String(required=True, description='Announcement title'),
    'message': fields.String(required=True, description='Announcement message'),
    'priority': fields.String(description='Priority level', enum=['low', 'medium', 'high']),
    'target_role': fields.String(description='Target audience', enum=['all', 'student', 'staff', 'admin']),
    'expires_at': fields.DateTime(description='Expiration date')
})

# Response models
success_response_model = api.model('SuccessResponse', {
    'success': fields.Boolean(description='Success status'),
    'message': fields.String(description='Response message'),
    'data': fields.Raw(description='Response data')
})

error_response_model = api.model('ErrorResponse', {
    'success': fields.Boolean(description='Success status (always false)'),
    'message': fields.String(description='Error message'),
    'details': fields.Raw(description='Error details')
})

paginated_response_model = api.model('PaginatedResponse', {
    'success': fields.Boolean(description='Success status'),
    'message': fields.String(description='Response message'),
    'data': fields.Raw(description='Response data'),
    'pagination': fields.Raw(description='Pagination info')
})

# File upload models
file_upload_response_model = api.model('FileUploadResponse', {
    'file_path': fields.String(description='File path'),
    'file_url': fields.String(description='File URL'),
    'uploaded_at': fields.DateTime(description='Upload timestamp')
})

# Analytics models
analytics_model = api.model('Analytics', {
    'total_students': fields.Integer(description='Total students'),
    'pending_applications': fields.Integer(description='Pending applications'),
    'approved_applications': fields.Integer(description='Approved applications'),
    'rejected_applications': fields.Integer(description='Rejected applications'),
    'printed_cards': fields.Integer(description='Printed cards'),
    'issued_cards': fields.Integer(description='Issued cards'),
    'monthly_stats': fields.Raw(description='Monthly statistics'),
    'department_stats': fields.Raw(description='Department statistics')
})

# Export models for use in routes
__all__ = [
    'api', 'auth_ns', 'student_ns', 'admin_ns', 'files_ns',
    'auth_login_model', 'auth_register_model', 'auth_token_model',
    'change_password_model', 'user_model', 'student_profile_model',
    'profile_update_model', 'id_application_model', 'application_action_model',
    'bulk_action_model', 'announcement_model', 'success_response_model',
    'error_response_model', 'paginated_response_model', 'file_upload_response_model',
    'analytics_model'
]