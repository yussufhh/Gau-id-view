# Database Models for GAU-ID-View System
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from datetime import datetime
import uuid

db = SQLAlchemy()
bcrypt = Bcrypt()

def generate_id_number():
    """Generate unique GAU ID number"""
    return f"GAU{datetime.now().year}{str(uuid.uuid4().int)[:6]}"

class User(db.Model):
    """User model for authentication and basic info"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    reg_number = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    department = db.Column(db.String(100), nullable=False)
    role = db.Column(db.Enum('student', 'staff', 'admin', name='user_roles'), default='student')
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    profile = db.relationship('StudentProfile', backref='user', uselist=False, cascade='all, delete-orphan')
    admin_activities = db.relationship('AdminActivity', foreign_keys='AdminActivity.admin_id', backref='admin_user', lazy='dynamic')
    
    def set_password(self, password):
        """Hash and set password"""
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    
    def check_password(self, password):
        """Check password against hash"""
        return bcrypt.check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        """Convert user to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'reg_number': self.reg_number,
            'email': self.email,
            'department': self.department,
            'role': self.role,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class StudentProfile(db.Model):
    """Extended student profile with ID card details"""
    __tablename__ = 'student_profiles'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)
    
    # Personal Information
    phone = db.Column(db.String(15))
    date_of_birth = db.Column(db.Date)
    address = db.Column(db.Text)
    next_of_kin = db.Column(db.String(100))
    next_of_kin_phone = db.Column(db.String(15))
    
    # ID Card Information
    id_number = db.Column(db.String(50), unique=True, default=generate_id_number)
    photo_url = db.Column(db.String(255))
    year_of_study = db.Column(db.String(20))
    course = db.Column(db.String(100))
    
    # Status Tracking
    status = db.Column(db.Enum('pending', 'reviewing', 'approved', 'rejected', 'printed', 'issued', name='id_status'), default='pending')
    card_printed = db.Column(db.Boolean, default=False)
    card_issued = db.Column(db.Boolean, default=False)
    expiry_date = db.Column(db.Date)
    
    # Timestamps
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)
    approved_at = db.Column(db.DateTime)
    printed_at = db.Column(db.DateTime)
    issued_at = db.Column(db.DateTime)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Admin notes
    admin_notes = db.Column(db.Text)
    rejection_reason = db.Column(db.Text)
    
    def to_dict(self):
        """Convert profile to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'phone': self.phone,
            'date_of_birth': self.date_of_birth.isoformat() if self.date_of_birth else None,
            'address': self.address,
            'next_of_kin': self.next_of_kin,
            'next_of_kin_phone': self.next_of_kin_phone,
            'id_number': self.id_number,
            'photo_url': self.photo_url,
            'year_of_study': self.year_of_study,
            'course': self.course,
            'status': self.status,
            'card_printed': self.card_printed,
            'card_issued': self.card_issued,
            'expiry_date': self.expiry_date.isoformat() if self.expiry_date else None,
            'submitted_at': self.submitted_at.isoformat() if self.submitted_at else None,
            'approved_at': self.approved_at.isoformat() if self.approved_at else None,
            'printed_at': self.printed_at.isoformat() if self.printed_at else None,
            'issued_at': self.issued_at.isoformat() if self.issued_at else None,
            'last_updated': self.last_updated.isoformat() if self.last_updated else None,
            'admin_notes': self.admin_notes,
            'rejection_reason': self.rejection_reason
        }

class AdminActivity(db.Model):
    """Track admin activities for audit trail"""
    __tablename__ = 'admin_activities'
    
    id = db.Column(db.Integer, primary_key=True)
    admin_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    action = db.Column(db.String(100), nullable=False)
    target_user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    details = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    ip_address = db.Column(db.String(45))
    
    # Relationship to target user
    target_user = db.relationship('User', foreign_keys=[target_user_id])
    
    def to_dict(self):
        return {
            'id': self.id,
            'admin_id': self.admin_id,
            'action': self.action,
            'target_user_id': self.target_user_id,
            'details': self.details,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None,
            'ip_address': self.ip_address
        }

class Announcement(db.Model):
    """System announcements and notifications"""
    __tablename__ = 'announcements'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    priority = db.Column(db.Enum('low', 'medium', 'high', 'urgent', name='priority_levels'), default='medium')
    target_role = db.Column(db.Enum('all', 'student', 'staff', 'admin', name='target_roles'), default='all')
    is_active = db.Column(db.Boolean, default=True)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    expires_at = db.Column(db.DateTime)
    
    # Relationship
    creator = db.relationship('User', backref='announcements')
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'message': self.message,
            'priority': self.priority,
            'target_role': self.target_role,
            'is_active': self.is_active,
            'created_by': self.created_by,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'expires_at': self.expires_at.isoformat() if self.expires_at else None
        }

class SystemSettings(db.Model):
    """System configuration settings"""
    __tablename__ = 'system_settings'
    
    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(100), unique=True, nullable=False)
    value = db.Column(db.Text)
    description = db.Column(db.Text)
    updated_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'key': self.key,
            'value': self.value,
            'description': self.description,
            'updated_by': self.updated_by,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }