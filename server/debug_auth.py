#!/usr/bin/env python3
"""
Debug script for JWT authentication issues
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from models import db, User
import requests
import json

def test_auth_flow():
    """Test the complete authentication flow"""
    app = create_app()
    
    with app.test_client() as client:
        print("🔍 Testing Authentication Flow...")
        
        # Test 1: Register new user
        print("\n1. Testing user registration...")
        register_data = {
            "name": "Test User",
            "reg_number": "TEST001",
            "email": "test@student.gau.ac.ke",
            "department": "Computer Science",
            "password": "TestPass123!"
        }
        
        response = client.post('/auth/register', 
                             json=register_data,
                             content_type='application/json')
        print(f"Register status: {response.status_code}")
        print(f"Register response: {response.get_json()}")
        
        if response.status_code != 201:
            print("❌ Registration failed")
            return
        
        # Test 2: Login with credentials
        print("\n2. Testing user login...")
        login_data = {
            "email": "test@student.gau.ac.ke",
            "password": "TestPass123!"
        }
        
        response = client.post('/auth/login',
                             json=login_data,
                             content_type='application/json')
        print(f"Login status: {response.status_code}")
        login_result = response.get_json()
        print(f"Login response: {login_result}")
        
        if response.status_code != 200:
            print("❌ Login failed")
            return
        
        token = login_result.get('access_token')
        if not token:
            print("❌ No access token received")
            return
        
        print(f"✅ Token received: {token[:50]}...")
        
        # Test 3: Verify token
        print("\n3. Testing token verification...")
        headers = {'Authorization': f'Bearer {token}'}
        response = client.get('/auth/verify', headers=headers)
        print(f"Verify status: {response.status_code}")
        print(f"Verify response: {response.get_json()}")
        
        # Test 4: Access protected endpoint
        print("\n4. Testing protected endpoint (student profile)...")
        response = client.get('/student/profile', headers=headers)
        print(f"Profile status: {response.status_code}")
        print(f"Profile response: {response.get_json()}")
        
        # Test 5: Test admin login
        print("\n5. Testing admin login...")
        admin_login = {
            "email": "admin@gau.ac.ke",
            "password": "Admin@123"
        }
        
        response = client.post('/auth/login',
                             json=admin_login,
                             content_type='application/json')
        print(f"Admin login status: {response.status_code}")
        admin_result = response.get_json()
        print(f"Admin login response: {admin_result}")
        
        if response.status_code == 200:
            admin_token = admin_result.get('access_token')
            print(f"✅ Admin token received: {admin_token[:50]}...")
            
            # Test admin endpoint
            print("\n6. Testing admin endpoint...")
            admin_headers = {'Authorization': f'Bearer {admin_token}'}
            response = client.get('/admin/students', headers=admin_headers)
            print(f"Admin students status: {response.status_code}")
            print(f"Admin students response: {response.get_json()}")

def test_manual_jwt():
    """Test JWT creation and verification manually"""
    from flask_jwt_extended import create_access_token, decode_token
    import jwt
    
    app = create_app()
    
    with app.app_context():
        print("\n🔧 Manual JWT Testing...")
        
        # Create token manually
        test_identity = {'user_id': 1, 'role': 'student'}
        token = create_access_token(identity=test_identity)
        print(f"Created token: {token[:50]}...")
        
        try:
            # Decode token
            decoded = decode_token(token)
            print(f"Decoded token: {decoded}")
            
            # Test JWT secret
            secret = app.config['JWT_SECRET_KEY']
            print(f"JWT Secret configured: {secret[:10]}...")
            
            # Manual decode with PyJWT
            manual_decoded = jwt.decode(token, secret, algorithms=['HS256'])
            print(f"Manual decoded: {manual_decoded}")
            
        except Exception as e:
            print(f"❌ JWT Error: {e}")

if __name__ == '__main__':
    print("🚀 Starting JWT Authentication Debug...")
    test_auth_flow()
    test_manual_jwt()