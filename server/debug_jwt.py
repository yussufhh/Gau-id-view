#!/usr/bin/env python3
"""
Debug JWT Authentication Issues
This script helps identify and fix JWT authentication problems
"""
import requests
import json
import sys
import os

# Add the server directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from models import db, User

def test_jwt_debug():
    """Debug JWT token creation and validation"""
    app = create_app()
    
    with app.app_context():
        # Test 1: Check if admin user exists
        admin_user = User.query.filter_by(email='admin@gau.ac.ke').first()
        if not admin_user:
            print("❌ Admin user not found")
            return False
        
        print(f"✅ Admin user found: {admin_user.email}")
        
        # Test 2: Check password verification
        if admin_user.check_password('Admin@123'):
            print("✅ Password verification works")
        else:
            print("❌ Password verification failed")
            return False
        
        # Test 3: Test JWT token creation manually
        from flask_jwt_extended import create_access_token
        
        try:
            token = create_access_token(
                identity=str(admin_user.id),
                additional_claims={'role': admin_user.role}
            )
            print(f"✅ JWT token created: {token[:50]}...")
            
            # Test 4: Test token verification
            from flask_jwt_extended import decode_token
            decoded = decode_token(token)
            print(f"✅ Token decoded successfully: {decoded['sub']}")
            
        except Exception as e:
            print(f"❌ JWT error: {str(e)}")
            return False
        
        return True

def test_api_endpoints():
    """Test API endpoints directly"""
    base_url = "http://localhost:5000"
    
    # Test health endpoint
    try:
        response = requests.get(f"{base_url}/health", timeout=5)
        print(f"Health check: {response.status_code}")
        if response.status_code == 200:
            print(f"✅ Health check response: {response.json()}")
        else:
            print(f"❌ Health check failed: {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Cannot connect to server: {e}")
        return False
    
    # Test login endpoint
    try:
        login_data = {
            "email": "admin@gau.ac.ke",
            "password": "Admin@123"
        }
        response = requests.post(
            f"{base_url}/auth/login", 
            json=login_data,
            timeout=5
        )
        print(f"Login attempt: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            token = data.get('token')
            print(f"✅ Login successful, token: {token[:50] if token else 'None'}...")
            
            # Test authenticated endpoint
            headers = {'Authorization': f'Bearer {token}'}
            profile_response = requests.get(
                f"{base_url}/student/profile",
                headers=headers,
                timeout=5
            )
            print(f"Profile endpoint: {profile_response.status_code}")
            
        else:
            print(f"❌ Login failed: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ API request failed: {e}")
    
    return True

if __name__ == '__main__':
    print("🔍 Starting JWT Authentication Debug...")
    print("="*50)
    
    # Test JWT functionality
    if test_jwt_debug():
        print("\n🔍 Testing API endpoints...")
        print("="*30)
        test_api_endpoints()
    
    print("\n✅ Debug session completed")