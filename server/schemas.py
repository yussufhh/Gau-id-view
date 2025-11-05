# Input validation schemas using Marshmallow
from marshmallow import Schema, fields, validate, validates, ValidationError
from models import User, StudentProfile
import re

# Custom validators
def validate_email(email):
    """Validate GAU email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@(student\.)?gau\.ac\.ke$'
    if not re.match(pattern, email):
        raise ValidationError('Must be a valid GAU email address (@gau.ac.ke or @student.gau.ac.ke)')

def validate_reg_number(reg_number):
    """Validate registration number format"""
    if not reg_number:
        return
    
    # Admin/Staff format: ADM001, STF001
    admin_pattern = r'^(ADM|STF)\d{3}$'
    # Student format: S110/2099/23 or similar
    student_pattern = r'^S\d{3}/\d{4}/\d{2}$'
    
    if not (re.match(admin_pattern, reg_number) or re.match(student_pattern, reg_number)):
        raise ValidationError('Invalid registration number format')

def validate_phone(phone):
    """Validate phone number format"""
    pattern = r'^\+254[0-9]{9}$'
    if not re.match(pattern, phone):
        raise ValidationError('Phone must be in format +254XXXXXXXXX')

def validate_password(password):
    """Validate password strength"""
    if len(password) < 8:
        raise ValidationError('Password must be at least 8 characters long')
    
    if not re.search(r'[A-Z]', password):
        raise ValidationError('Password must contain at least one uppercase letter')
    
    if not re.search(r'[a-z]', password):
        raise ValidationError('Password must contain at least one lowercase letter')
    
    if not re.search(r'\d', password):
        raise ValidationError('Password must contain at least one number')
    
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        raise ValidationError('Password must contain at least one special character')

# Authentication schemas
class RegisterSchema(Schema):
    name = fields.Str(required=True, validate=validate.Length(min=2, max=100))
    reg_number = fields.Str(required=True, validate=validate_reg_number)
    email = fields.Email(required=True, validate=validate_email)
    department = fields.Str(required=True, validate=validate.Length(min=2, max=100))
    password = fields.Str(required=True, validate=validate_password)
    role = fields.Str(validate=validate.OneOf(['student', 'staff', 'admin']), load_default='student')
    
    @validates('email')
    def validate_unique_email(self, email):
        if User.query.filter_by(email=email).first():
            raise ValidationError('Email already registered')
    
    @validates('reg_number')
    def validate_unique_reg_number(self, reg_number):
        if User.query.filter_by(reg_number=reg_number).first():
            raise ValidationError('Registration number already exists')

class LoginSchema(Schema):
    reg_number = fields.Str(required=True, validate=validate_reg_number)
    password = fields.Str(required=True, validate=validate.Length(min=1))

class ChangePasswordSchema(Schema):
    current_password = fields.Str(required=True)
    new_password = fields.Str(required=True, validate=validate_password)

# Student schemas
class StudentProfileUpdateSchema(Schema):
    phone = fields.Str(validate=validate_phone)
    course = fields.Str(validate=validate.Length(min=2, max=200))
    year_of_study = fields.Str(validate=validate.OneOf(['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Postgraduate']))
    address = fields.Str(validate=validate.Length(max=500))
    date_of_birth = fields.Date()
    next_of_kin = fields.Str(validate=validate.Length(max=100))
    next_of_kin_phone = fields.Str(validate=validate_phone)

class IDApplicationSchema(Schema):
    phone = fields.Str(required=True, validate=validate_phone)
    course = fields.Str(required=True, validate=validate.Length(min=2, max=200))
    year_of_study = fields.Str(required=True, validate=validate.OneOf(['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Postgraduate']))
    address = fields.Str(required=True, validate=validate.Length(min=10, max=500))
    date_of_birth = fields.Date(required=True)
    next_of_kin = fields.Str(required=True, validate=validate.Length(min=2, max=100))
    next_of_kin_phone = fields.Str(required=True, validate=validate_phone)

# Admin schemas
class AdminUserCreateSchema(Schema):
    name = fields.Str(required=True, validate=validate.Length(min=2, max=100))
    email = fields.Email(required=True, validate=validate_email)
    department = fields.Str(required=True, validate=validate.Length(min=2, max=100))
    role = fields.Str(required=True, validate=validate.OneOf(['staff', 'admin']))
    reg_number = fields.Str(required=True, validate=validate_reg_number)

class ApplicationActionSchema(Schema):
    action = fields.Str(required=True, validate=validate.OneOf(['approve', 'reject', 'review']))
    reason = fields.Str(validate=validate.Length(max=500))
    admin_notes = fields.Str(validate=validate.Length(max=1000))

class BulkActionSchema(Schema):
    application_ids = fields.List(fields.Int(), required=True, validate=validate.Length(min=1))
    action = fields.Str(required=True, validate=validate.OneOf(['approve', 'reject', 'delete']))
    reason = fields.Str(validate=validate.Length(max=500))

class AnnouncementSchema(Schema):
    title = fields.Str(required=True, validate=validate.Length(min=3, max=200))
    message = fields.Str(required=True, validate=validate.Length(min=10, max=2000))
    priority = fields.Str(validate=validate.OneOf(['low', 'medium', 'high']), load_default='medium')
    target_role = fields.Str(validate=validate.OneOf(['all', 'student', 'staff', 'admin']), load_default='all')
    expires_at = fields.DateTime()

class SystemSettingsSchema(Schema):
    university_name = fields.Str(validate=validate.Length(min=2, max=100))
    university_code = fields.Str(validate=validate.Length(min=2, max=10))
    id_card_validity_days = fields.Int(validate=validate.Range(min=1, max=3650))
    auto_approve_applications = fields.Bool()
    max_file_size_mb = fields.Int(validate=validate.Range(min=1, max=50))
    notification_email = fields.Email()
    system_maintenance = fields.Bool()

# Search and filter schemas
class StudentSearchSchema(Schema):
    search = fields.Str(validate=validate.Length(max=100))
    status = fields.Str(validate=validate.OneOf(['pending', 'reviewing', 'approved', 'rejected', 'printed', 'issued']))
    department = fields.Str(validate=validate.Length(max=100))
    year_of_study = fields.Str(validate=validate.OneOf(['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Postgraduate']))
    page = fields.Int(validate=validate.Range(min=1), load_default=1)
    per_page = fields.Int(validate=validate.Range(min=1, max=100), load_default=20)
    sort_by = fields.Str(validate=validate.OneOf(['name', 'reg_number', 'status', 'submitted_at', 'approved_at']))
    order = fields.Str(validate=validate.OneOf(['asc', 'desc']), load_default='desc')

# File upload schemas
class FileUploadSchema(Schema):
    file_type = fields.Str(required=True, validate=validate.OneOf(['photo', 'document']))
    description = fields.Str(validate=validate.Length(max=200))

# Response schemas
class UserResponseSchema(Schema):
    id = fields.Int()
    name = fields.Str()
    reg_number = fields.Str()
    email = fields.Str()
    department = fields.Str()
    role = fields.Str()
    is_active = fields.Bool()
    created_at = fields.DateTime()
    updated_at = fields.DateTime()

class StudentProfileResponseSchema(Schema):
    id = fields.Int()
    user_id = fields.Int()
    phone = fields.Str()
    course = fields.Str()
    year_of_study = fields.Str()
    address = fields.Str()
    date_of_birth = fields.Date()
    next_of_kin = fields.Str()
    next_of_kin_phone = fields.Str()
    status = fields.Str()
    id_number = fields.Str()
    photo_url = fields.Str()
    submitted_at = fields.DateTime()
    approved_at = fields.DateTime()
    printed_at = fields.DateTime()
    issued_at = fields.DateTime()
    expiry_date = fields.Date()
    rejection_reason = fields.Str()
    admin_notes = fields.Str()
    card_printed = fields.Bool()
    card_issued = fields.Bool()
    last_updated = fields.DateTime()

# Validation helper functions
def validate_json(schema_class):
    """Decorator for validating JSON input"""
    def decorator(f):
        def wrapper(*args, **kwargs):
            from flask import request, jsonify
            from utils.helpers import error_response
            
            try:
                schema = schema_class()
                result = schema.load(request.get_json() or {})
                request.validated_json = result
                return f(*args, **kwargs)
            except ValidationError as err:
                return error_response(f'Validation failed: {err.messages}', status_code=400)
            except Exception as err:
                return error_response('Invalid JSON data', status_code=400)
        
        wrapper.__name__ = f.__name__
        return wrapper
    return decorator

def validate_args(schema_class):
    """Decorator for validating URL arguments"""
    def decorator(f):
        def wrapper(*args, **kwargs):
            from flask import request
            from utils.helpers import error_response
            
            try:
                schema = schema_class()
                result = schema.load(request.args.to_dict())
                request.validated_args = result
                return f(*args, **kwargs)
            except ValidationError as err:
                return error_response(f'Invalid parameters: {err.messages}', status_code=400)
        
        wrapper.__name__ = f.__name__
        return wrapper
    return decorator