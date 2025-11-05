# Database Seeding Script for GAU-ID-View
import os
import sys
from datetime import datetime, date, timedelta

# Add the server directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from models import db, User, StudentProfile, Announcement, SystemSettings
from flask import current_app

def seed_database():
    """Seed the database with initial data"""
    app = create_app()
    
    with app.app_context():
        print("🌱 Starting database seeding...")
        
        # Create all tables first
        db.create_all()
        print("✅ Database tables created successfully!")
        
        # Seed data
        db.create_all()
        print("✅ Database tables created")
        
        # Seed system admin user
        seed_admin_user()
        
        # Seed system settings
        seed_system_settings()
        
        # Seed sample students (for development/testing)
        if current_app.config.get('FLASK_ENV') == 'development':
            seed_sample_data()
        
        print("🎉 Database seeding completed successfully!")

def seed_admin_user():
    """Create default admin user"""
    try:
        # Check if admin user already exists
        admin_user = User.query.filter_by(email='admin@gau.ac.ke').first()
        
        if not admin_user:
            admin_user = User(
                name='System Administrator',
                reg_number='ADM001',
                email='admin@gau.ac.ke',
                department='Administration',
                role='admin',
                is_active=True
            )
            admin_user.set_password('Admin@123')  # Default password - should be changed
            
            db.session.add(admin_user)
            db.session.commit()
            
            print(f"✅ Default admin user created:")
            print(f"   Email: admin@gau.ac.ke")
            print(f"   Password: Admin@123")
            print(f"   ⚠️  Please change the default password after first login!")
        else:
            print("ℹ️  Admin user already exists")
        
        # Create staff user
        staff_user = User.query.filter_by(email='staff@gau.ac.ke').first()
        
        if not staff_user:
            staff_user = User(
                name='Staff Member',
                reg_number='STF001',
                email='staff@gau.ac.ke',
                department='Student Services',
                role='staff',
                is_active=True
            )
            staff_user.set_password('Staff@123')  # Default password - should be changed
            
            db.session.add(staff_user)
            db.session.commit()
            
            print(f"✅ Default staff user created:")
            print(f"   Email: staff@gau.ac.ke")
            print(f"   Password: Staff@123")
            print(f"   ⚠️  Please change the default password after first login!")
        else:
            print("ℹ️  Staff user already exists")
            
    except Exception as e:
        print(f"❌ Error creating admin/staff users: {str(e)}")
        db.session.rollback()

def seed_system_settings():
    """Create default system settings"""
    try:
        default_settings = [
            {
                'key': 'university_name',
                'value': 'Garissa University',
                'description': 'Official university name'
            },
            {
                'key': 'university_code',
                'value': 'GAU',
                'description': 'University abbreviation code'
            },
            {
                'key': 'id_card_validity_days',
                'value': '365',
                'description': 'Number of days ID cards are valid'
            },
            {
                'key': 'auto_approve_applications',
                'value': 'false',
                'description': 'Whether to automatically approve applications'
            },
            {
                'key': 'max_file_size_mb',
                'value': '5',
                'description': 'Maximum file size for uploads in MB'
            },
            {
                'key': 'notification_email',
                'value': 'notifications@gau.ac.ke',
                'description': 'Email address for system notifications'
            },
            {
                'key': 'system_maintenance',
                'value': 'false',
                'description': 'System maintenance mode status'
            }
        ]
        
        for setting_data in default_settings:
            existing_setting = SystemSettings.query.filter_by(key=setting_data['key']).first()
            if not existing_setting:
                setting = SystemSettings(
                    key=setting_data['key'],
                    value=setting_data['value'],
                    description=setting_data['description']
                )
                db.session.add(setting)
        
        db.session.commit()
        print("✅ System settings initialized")
        
    except Exception as e:
        print(f"❌ Error creating system settings: {str(e)}")
        db.session.rollback()

def seed_sample_data():
    """Create sample data for development/testing"""
    try:
        print("🧪 Creating sample data for development...")
        
        # Sample departments
        departments = [
            'Computer Science',
            'Business Administration',
            'Education',
            'Engineering',
            'Health Sciences'
        ]
        
        # Sample courses
        courses = [
            'Bachelor of Computer Science',
            'Bachelor of Business Administration',
            'Bachelor of Education (Arts)',
            'Bachelor of Civil Engineering',
            'Bachelor of Nursing'
        ]
        
        # Sample students
        sample_students = [
            {
                'name': 'John Kamau Doe',
                'reg_number': 'S110/2099/23',
                'email': 'john.doe@student.gau.ac.ke',
                'department': 'Computer Science',
                'course': 'Bachelor of Computer Science',
                'year_of_study': 'Year 3',
                'phone': '+254712345678',
                'status': 'approved'
            },
            {
                'name': 'Mary Njeri Mwangi',
                'reg_number': 'S110/2088/23',
                'email': 'mary.mwangi@student.gau.ac.ke',
                'department': 'Business Administration',
                'course': 'Bachelor of Business Administration',
                'year_of_study': 'Year 2',
                'phone': '+254722987654',
                'status': 'pending'
            },
            {
                'name': 'David Ochieng Otieno',
                'reg_number': 'S110/2077/23',
                'email': 'david.otieno@student.gau.ac.ke',
                'department': 'Education',
                'course': 'Bachelor of Education (Arts)',
                'year_of_study': 'Year 4',
                'phone': '+254733456789',
                'status': 'reviewing'
            },
            {
                'name': 'Sarah Wanjiku Mbugua',
                'reg_number': 'S110/2066/23',
                'email': 'sarah.mbugua@student.gau.ac.ke',
                'department': 'Engineering',
                'course': 'Bachelor of Civil Engineering',
                'year_of_study': 'Year 1',
                'phone': '+254744567890',
                'status': 'issued'
            },
            {
                'name': 'Ahmed Hassan Ali',
                'reg_number': 'S110/2055/23',
                'email': 'ahmed.ali@student.gau.ac.ke',
                'department': 'Health Sciences',
                'course': 'Bachelor of Nursing',
                'year_of_study': 'Year 2',
                'phone': '+254755678901',
                'status': 'rejected'
            }
        ]
        
        for student_data in sample_students:
            # Check if student already exists
            existing_user = User.query.filter_by(email=student_data['email']).first()
            if existing_user:
                continue
            
            # Create user
            user = User(
                name=student_data['name'],
                reg_number=student_data['reg_number'],
                email=student_data['email'],
                department=student_data['department'],
                role='student',
                is_active=True
            )
            user.set_password('Student@123')  # Default password for all sample students
            
            db.session.add(user)
            db.session.flush()  # Get the user ID
            
            # Create student profile
            profile = StudentProfile(
                user_id=user.id,
                phone=student_data['phone'],
                course=student_data['course'],
                year_of_study=student_data['year_of_study'],
                status=student_data['status'],
                submitted_at=datetime.utcnow() - timedelta(days=5),
                address=f"P.O. Box 1234, {student_data['department']} Campus",
                next_of_kin=f"{student_data['name'].split()[0]} Parent",
                next_of_kin_phone=f"+25470{student_data['phone'][-7:]}"
            )
            
            # Set status-specific dates
            if profile.status in ['approved', 'printed', 'issued']:
                profile.approved_at = datetime.utcnow() - timedelta(days=2)
                profile.expiry_date = date.today() + timedelta(days=365)
            
            if profile.status in ['printed', 'issued']:
                profile.printed_at = datetime.utcnow() - timedelta(days=1)
                profile.card_printed = True
            
            if profile.status == 'issued':
                profile.issued_at = datetime.utcnow()
                profile.card_issued = True
            
            if profile.status == 'rejected':
                profile.rejection_reason = "Incomplete documentation - missing passport photo"
            
            db.session.add(profile)
        
        # Create sample announcements
        sample_announcements = [
            {
                'title': 'New ID Card Collection Process',
                'message': 'Starting next week, ID cards will be collected from the main office between 9 AM and 4 PM.',
                'priority': 'high',
                'target_role': 'student'
            },
            {
                'title': 'System Maintenance Notice',
                'message': 'The ID management system will undergo maintenance on Friday from 2 PM to 4 PM.',
                'priority': 'medium',
                'target_role': 'all'
            },
            {
                'title': 'Document Verification Requirements',
                'message': 'Please ensure all documents are properly certified before submitting your ID application.',
                'priority': 'medium',
                'target_role': 'student'
            }
        ]
        
        admin_user = User.query.filter_by(role='admin').first()
        if admin_user:
            for ann_data in sample_announcements:
                announcement = Announcement(
                    title=ann_data['title'],
                    message=ann_data['message'],
                    priority=ann_data['priority'],
                    target_role=ann_data['target_role'],
                    created_by=admin_user.id,
                    expires_at=datetime.utcnow() + timedelta(days=30)
                )
                db.session.add(announcement)
        
        db.session.commit()
        print(f"✅ Sample data created:")
        print(f"   - {len(sample_students)} sample students")
        print(f"   - {len(sample_announcements)} sample announcements")
        print(f"   - Default password for students: Student@123")
        
    except Exception as e:
        print(f"❌ Error creating sample data: {str(e)}")
        db.session.rollback()

def reset_database():
    """Reset the database (use with caution!)"""
    app = create_app()
    
    with app.app_context():
        print("⚠️  Resetting database...")
        
        response = input("Are you sure you want to reset the database? This will delete all data! (yes/no): ")
        if response.lower() == 'yes':
            db.drop_all()
            print("🗑️  Database reset completed")
            seed_database()
        else:
            print("❌ Database reset cancelled")

if __name__ == '__main__':
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == '--reset':
        reset_database()
    else:
        seed_database()