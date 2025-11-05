#!/usr/bin/env python3
"""
Comprehensive API test suite for GAU-ID-View Backend
Tests all endpoints, authentication flows, and error handling
"""
import sys
import os
import json
from datetime import datetime

# Add the server directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from models import db, User

class APITestSuite:
    def __init__(self):
        self.app = create_app()
        self.client = self.app.test_client()
        self.admin_token = None
        self.staff_token = None
        self.student_token = None
        self.test_user_id = None
        
    def run_all_tests(self):
        """Run comprehensive API test suite"""
        print("🚀 Starting Comprehensive API Test Suite")
        print("=" * 60)
        
        with self.app.app_context():
            # Test 1: Health Check
            self.test_health_check()
            
            # Test 2: API Info
            self.test_api_info()
            
            # Test 3: Authentication Flow
            self.test_authentication_flow()
            
            # Test 4: Student Endpoints
            if self.student_token:
                self.test_student_endpoints()
            
            # Test 5: Admin Endpoints
            if self.admin_token:
                self.test_admin_endpoints()
            
            # Test 6: Error Handling
            self.test_error_handling()
            
            # Test 7: Security Features
            self.test_security_features()
            
        print("\n" + "=" * 60)
        print("✅ Test Suite Complete!")
        
    def test_health_check(self):
        """Test health check endpoint"""
        print("\n🏥 Testing Health Check...")
        
        response = self.client.get('/health')
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.get_json()
            print(f"✅ Health check passed: {data['message']}")
        else:
            print(f"❌ Health check failed")
    
    def test_api_info(self):
        """Test API info endpoint"""
        print("\n📋 Testing API Info...")
        
        response = self.client.get('/api/info')
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.get_json()
            print(f"✅ API Info: {data['name']} v{data['version']}")
        else:
            print(f"❌ API info failed")
    
    def test_authentication_flow(self):
        """Test complete authentication flow"""
        print("\n🔐 Testing Authentication Flow...")
        
        # Test admin login first
        admin_login = {
            "email": "admin@gau.ac.ke",
            "password": "Admin@123"
        }
        
        response = self.client.post('/auth/login',
                                  json=admin_login,
                                  content_type='application/json')
        
        if response.status_code == 200:
            result = response.get_json()
            self.admin_token = result['data']['access_token']
            print("✅ Admin login successful")
        else:
            print(f"❌ Admin login failed: {response.get_json()}")
        
        # Test student registration
        test_student = {
            "name": "API Test Student",
            "reg_number": f"TEST{int(datetime.now().timestamp())}",
            "email": f"apitest{int(datetime.now().timestamp())}@student.gau.ac.ke",
            "department": "Computer Science",
            "password": "TestPass123!"
        }
        
        response = self.client.post('/auth/register',
                                  json=test_student,
                                  content_type='application/json')
        
        if response.status_code == 201:
            result = response.get_json()
            self.test_user_id = result['data']['user']['id']
            print("✅ Student registration successful")
            
            # Test student login
            student_login = {
                "email": test_student["email"],
                "password": test_student["password"]
            }
            
            response = self.client.post('/auth/login',
                                      json=student_login,
                                      content_type='application/json')
            
            if response.status_code == 200:
                result = response.get_json()
                self.student_token = result['data']['access_token']
                print("✅ Student login successful")
            else:
                print(f"❌ Student login failed: {response.get_json()}")
        else:
            print(f"❌ Student registration failed: {response.get_json()}")
        
        # Test token verification
        if self.student_token:
            headers = {'Authorization': f'Bearer {self.student_token}'}
            response = self.client.get('/auth/verify', headers=headers)
            
            if response.status_code == 200:
                print("✅ Token verification successful")
            else:
                print(f"❌ Token verification failed: {response.get_json()}")
    
    def test_student_endpoints(self):
        """Test student-specific endpoints"""
        print("\n👨‍🎓 Testing Student Endpoints...")
        
        headers = {'Authorization': f'Bearer {self.student_token}'}
        
        # Test profile endpoint
        response = self.client.get('/student/profile', headers=headers)
        if response.status_code == 200:
            print("✅ Student profile retrieval successful")
        else:
            print(f"❌ Student profile failed: {response.get_json()}")
        
        # Test profile update
        update_data = {
            "phone": "+254700123456",
            "course": "Bachelor of Computer Science",
            "year_of_study": "Year 2"
        }
        
        response = self.client.put('/student/profile',
                                 json=update_data,
                                 headers=headers,
                                 content_type='application/json')
        
        if response.status_code == 200:
            print("✅ Student profile update successful")
        else:
            print(f"❌ Student profile update failed: {response.get_json()}")
        
        # Test notifications
        response = self.client.get('/student/notifications', headers=headers)
        if response.status_code == 200:
            print("✅ Student notifications retrieval successful")
        else:
            print(f"❌ Student notifications failed: {response.get_json()}")
        
        # Test application status
        response = self.client.get('/student/status', headers=headers)
        if response.status_code == 200:
            print("✅ Student status retrieval successful")
        else:
            print(f"❌ Student status failed: {response.get_json()}")
    
    def test_admin_endpoints(self):
        """Test admin-specific endpoints"""
        print("\n👨‍💼 Testing Admin Endpoints...")
        
        headers = {'Authorization': f'Bearer {self.admin_token}'}
        
        # Test students list
        response = self.client.get('/admin/students', headers=headers)
        if response.status_code == 200:
            print("✅ Admin students list successful")
        else:
            print(f"❌ Admin students list failed: {response.get_json()}")
        
        # Test analytics
        response = self.client.get('/admin/analytics', headers=headers)
        if response.status_code == 200:
            print("✅ Admin analytics successful")
        else:
            print(f"❌ Admin analytics failed: {response.get_json()}")
        
        # Test announcements
        response = self.client.get('/admin/announcements', headers=headers)
        if response.status_code == 200:
            print("✅ Admin announcements retrieval successful")
        else:
            print(f"❌ Admin announcements failed: {response.get_json()}")
        
        # Test creating announcement
        announcement_data = {
            "title": "API Test Announcement",
            "message": "This is a test announcement from API test suite",
            "priority": "medium",
            "target_role": "student"
        }
        
        response = self.client.post('/admin/announcements',
                                  json=announcement_data,
                                  headers=headers,
                                  content_type='application/json')
        
        if response.status_code == 201:
            print("✅ Admin announcement creation successful")
        else:
            print(f"❌ Admin announcement creation failed: {response.get_json()}")
    
    def test_error_handling(self):
        """Test error handling and edge cases"""
        print("\n🚨 Testing Error Handling...")
        
        # Test 404 endpoint
        response = self.client.get('/nonexistent')
        if response.status_code == 404:
            print("✅ 404 error handling working")
        else:
            print("❌ 404 error handling failed")
        
        # Test unauthorized access
        response = self.client.get('/admin/students')
        if response.status_code == 401:
            print("✅ Unauthorized access blocked")
        else:
            print("❌ Unauthorized access not blocked")
        
        # Test invalid JSON
        response = self.client.post('/auth/login',
                                  data="invalid json",
                                  content_type='application/json')
        if response.status_code == 400:
            print("✅ Invalid JSON handling working")
        else:
            print("❌ Invalid JSON handling failed")
        
        # Test missing required fields
        response = self.client.post('/auth/register',
                                  json={},
                                  content_type='application/json')
        if response.status_code == 400:
            print("✅ Missing fields validation working")
        else:
            print("❌ Missing fields validation failed")
    
    def test_security_features(self):
        """Test security features"""
        print("\n🔒 Testing Security Features...")
        
        # Test CORS headers
        response = self.client.options('/auth/login')
        headers = dict(response.headers)
        if 'Access-Control-Allow-Origin' in headers:
            print("✅ CORS headers present")
        else:
            print("❌ CORS headers missing")
        
        # Test password validation
        weak_password_data = {
            "name": "Test User",
            "reg_number": "WEAK001",
            "email": "weak@student.gau.ac.ke",
            "department": "Test",
            "password": "123"  # Weak password
        }
        
        response = self.client.post('/auth/register',
                                  json=weak_password_data,
                                  content_type='application/json')
        
        if response.status_code == 400:
            print("✅ Weak password validation working")
        else:
            print("❌ Weak password validation failed")

def main():
    """Run the test suite"""
    test_suite = APITestSuite()
    test_suite.run_all_tests()

if __name__ == '__main__':
    main()