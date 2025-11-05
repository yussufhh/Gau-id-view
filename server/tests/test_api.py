# Unit Tests for GAU-ID-View Backend API
import os
import sys
import pytest
import tempfile
from datetime import datetime, date

# Add the server directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app
from models import db, User, StudentProfile

class TestGAUIDViewAPI:
    """Test suite for GAU-ID-View Backend API"""
    
    @pytest.fixture
    def app(self):
        """Create application for testing"""
        # Create a temporary file for test database
        db_fd, db_path = tempfile.mkstemp(suffix='.db')
        
        app = create_app('testing')
        app.config.update({
            'TESTING': True,
            'SQLALCHEMY_DATABASE_URI': f'sqlite:///{db_path}',
            'WTF_CSRF_ENABLED': False
        })
        
        with app.app_context():
            db.create_all()
            yield app
            db.session.remove()
            db.drop_all()
        
        os.close(db_fd)
        os.unlink(db_path)
    
    @pytest.fixture
    def client(self, app):
        """Create test client"""
        return app.test_client()
    
    @pytest.fixture
    def admin_user(self, app):
        """Create test admin user"""
        with app.app_context():
            admin = User(
                name='Test Admin',
                reg_number='ADM001',
                email='admin@test.gau.ac.ke',
                department='Administration',
                role='admin'
            )
            admin.set_password('TestAdmin@123')
            db.session.add(admin)
            db.session.commit()
            return admin
    
    @pytest.fixture
    def student_user(self, app):
        """Create test student user"""
        with app.app_context():
            student = User(
                name='Test Student',
                reg_number='S110/TEST/23',
                email='student@test.gau.ac.ke',
                department='Computer Science',
                role='student'
            )
            student.set_password('TestStudent@123')
            db.session.add(student)
            db.session.flush()
            
            profile = StudentProfile(
                user_id=student.id,
                course='Bachelor of Computer Science',
                year_of_study='Year 2',
                phone='+254712345678',
                status='pending'
            )
            db.session.add(profile)
            db.session.commit()
            return student
    
    def get_auth_token(self, client, email, password):
        """Helper to get JWT token"""
        response = client.post('/auth/login', json={
            'email': email,
            'password': password
        })
        if response.status_code == 200:
            return response.json['data']['access_token']
        return None
    
    def test_health_check(self, client):
        """Test health check endpoint"""
        response = client.get('/health')
        assert response.status_code == 200
        assert 'healthy' in response.json['status']
    
    def test_api_info(self, client):
        """Test API info endpoint"""
        response = client.get('/api/info')
        assert response.status_code == 200
        assert 'GAU-ID-View Backend API' in response.json['name']
    
    def test_student_registration(self, client):
        """Test student registration"""
        student_data = {
            'name': 'John Doe',
            'reg_number': 'S110/2024/01',
            'email': 'john.doe@test.gau.ac.ke',
            'password': 'TestPassword@123',
            'department': 'Computer Science',
            'course': 'Bachelor of Computer Science',
            'year_of_study': 'Year 1'
        }
        
        response = client.post('/auth/register', json=student_data)
        assert response.status_code == 201
        assert response.json['success'] == True
        assert 'Registration successful' in response.json['message']
    
    def test_duplicate_registration(self, client, student_user):
        """Test registration with duplicate email/reg_number"""
        student_data = {
            'name': 'Another Student',
            'reg_number': 'S110/TEST/23',  # Same as existing
            'email': 'another@test.gau.ac.ke',
            'password': 'TestPassword@123',
            'department': 'Computer Science'
        }
        
        response = client.post('/auth/register', json=student_data)
        assert response.status_code == 409
        assert 'already exists' in response.json['message']
    
    def test_student_login(self, client, student_user):
        """Test student login"""
        login_data = {
            'email': 'student@test.gau.ac.ke',
            'password': 'TestStudent@123'
        }
        
        response = client.post('/auth/login', json=login_data)
        assert response.status_code == 200
        assert 'access_token' in response.json['data']
        assert response.json['data']['user']['role'] == 'student'
    
    def test_admin_login(self, client, admin_user):
        """Test admin login"""
        login_data = {
            'email': 'admin@test.gau.ac.ke',
            'password': 'TestAdmin@123'
        }
        
        response = client.post('/auth/login', json=login_data)
        assert response.status_code == 200
        assert 'access_token' in response.json['data']
        assert response.json['data']['user']['role'] == 'admin'
    
    def test_invalid_login(self, client):
        """Test login with invalid credentials"""
        login_data = {
            'email': 'invalid@test.gau.ac.ke',
            'password': 'InvalidPassword'
        }
        
        response = client.post('/auth/login', json=login_data)
        assert response.status_code == 401
        assert 'Invalid credentials' in response.json['message']
    
    def test_token_verification(self, client, student_user):
        """Test JWT token verification"""
        token = self.get_auth_token(client, 'student@test.gau.ac.ke', 'TestStudent@123')
        assert token is not None
        
        headers = {'Authorization': f'Bearer {token}'}
        response = client.get('/auth/verify', headers=headers)
        assert response.status_code == 200
        assert response.json['data']['user']['email'] == 'student@test.gau.ac.ke'
    
    def test_student_profile_access(self, client, student_user):
        """Test student profile access"""
        token = self.get_auth_token(client, 'student@test.gau.ac.ke', 'TestStudent@123')
        headers = {'Authorization': f'Bearer {token}'}
        
        response = client.get('/student/profile', headers=headers)
        assert response.status_code == 200
        assert 'profile' in response.json['data']
        assert response.json['data']['user']['name'] == 'Test Student'
    
    def test_unauthorized_access(self, client):
        """Test accessing protected endpoints without token"""
        response = client.get('/student/profile')
        assert response.status_code == 401
        assert 'Authorization token is required' in response.json['message']
    
    def test_student_profile_update(self, client, student_user):
        """Test student profile update"""
        token = self.get_auth_token(client, 'student@test.gau.ac.ke', 'TestStudent@123')
        headers = {'Authorization': f'Bearer {token}'}
        
        update_data = {
            'phone': '+254700123456',
            'address': 'P.O. Box 1234, Nairobi',
            'next_of_kin': 'Jane Doe',
            'next_of_kin_phone': '+254711223344'
        }
        
        response = client.put('/student/update', json=update_data, headers=headers)
        assert response.status_code == 200
        assert 'updated successfully' in response.json['message']
    
    def test_student_status_check(self, client, student_user):
        """Test student ID status check"""
        token = self.get_auth_token(client, 'student@test.gau.ac.ke', 'TestStudent@123')
        headers = {'Authorization': f'Bearer {token}'}
        
        response = client.get('/student/status', headers=headers)
        assert response.status_code == 200
        assert 'current_status' in response.json['data']
        assert response.json['data']['current_status'] == 'pending'
    
    def test_admin_dashboard_access(self, client, admin_user):
        """Test admin dashboard access"""
        token = self.get_auth_token(client, 'admin@test.gau.ac.ke', 'TestAdmin@123')
        headers = {'Authorization': f'Bearer {token}'}
        
        response = client.get('/admin/dashboard', headers=headers)
        assert response.status_code == 200
        assert 'summary' in response.json['data']
    
    def test_admin_student_approval(self, client, admin_user, student_user):
        """Test admin student approval"""
        token = self.get_auth_token(client, 'admin@test.gau.ac.ke', 'TestAdmin@123')
        headers = {'Authorization': f'Bearer {token}'}
        
        approval_data = {
            'notes': 'Application approved - all documents verified'
        }
        
        response = client.put(f'/admin/approve/{student_user.id}', 
                            json=approval_data, headers=headers)
        assert response.status_code == 200
        assert 'approved successfully' in response.json['message']
    
    def test_admin_student_rejection(self, client, admin_user, student_user):
        """Test admin student rejection"""
        token = self.get_auth_token(client, 'admin@test.gau.ac.ke', 'TestAdmin@123')
        headers = {'Authorization': f'Bearer {token}'}
        
        rejection_data = {
            'reason': 'Missing passport photo',
            'notes': 'Please resubmit with proper photo'
        }
        
        response = client.put(f'/admin/reject/{student_user.id}', 
                            json=rejection_data, headers=headers)
        assert response.status_code == 200
        assert 'rejected' in response.json['message']
    
    def test_admin_students_list(self, client, admin_user, student_user):
        """Test admin students list"""
        token = self.get_auth_token(client, 'admin@test.gau.ac.ke', 'TestAdmin@123')
        headers = {'Authorization': f'Bearer {token}'}
        
        response = client.get('/admin/students', headers=headers)
        assert response.status_code == 200
        assert 'items' in response.json['data']
        assert len(response.json['data']['items']) > 0
    
    def test_student_role_restriction(self, client, student_user):
        """Test that students cannot access admin endpoints"""
        token = self.get_auth_token(client, 'student@test.gau.ac.ke', 'TestStudent@123')
        headers = {'Authorization': f'Bearer {token}'}
        
        response = client.get('/admin/dashboard', headers=headers)
        assert response.status_code == 403
        assert 'Insufficient permissions' in response.json['message']
    
    def test_password_change(self, client, student_user):
        """Test password change"""
        token = self.get_auth_token(client, 'student@test.gau.ac.ke', 'TestStudent@123')
        headers = {'Authorization': f'Bearer {token}'}
        
        password_data = {
            'current_password': 'TestStudent@123',
            'new_password': 'NewPassword@456'
        }
        
        response = client.put('/auth/change-password', json=password_data, headers=headers)
        assert response.status_code == 200
        assert 'changed successfully' in response.json['message']
        
        # Test login with new password
        login_data = {
            'email': 'student@test.gau.ac.ke',
            'password': 'NewPassword@456'
        }
        
        response = client.post('/auth/login', json=login_data)
        assert response.status_code == 200
    
    def test_invalid_json_request(self, client):
        """Test request with invalid JSON"""
        response = client.post('/auth/login', data='invalid json')
        assert response.status_code == 400
    
    def test_missing_required_fields(self, client):
        """Test registration with missing required fields"""
        incomplete_data = {
            'name': 'John Doe',
            # Missing reg_number, email, password, department
        }
        
        response = client.post('/auth/register', json=incomplete_data)
        assert response.status_code == 400
        assert 'required' in response.json['message'].lower()

if __name__ == '__main__':
    # Run tests
    pytest.main(['-v', __file__])