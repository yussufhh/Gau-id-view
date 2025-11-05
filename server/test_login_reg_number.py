#!/usr/bin/env python3
"""
Test Login with Registration Number
"""

import requests
import json

def test_login_with_reg_number():
    """Test login using registration number and password"""
    print("🧪 Testing Login with Registration Number")
    print("=" * 50)
    
    # First, create a test user to login with
    print("📝 Creating test user...")
    registration_data = {
        "name": "Test Login User",
        "reg_number": "S101/2025/01",
        "email": "testlogin@student.gau.ac.ke",
        "department": "Computer Science",
        "password": "TestPass123!"
    }
    
    try:
        # Register user (might already exist)
        reg_response = requests.post(
            'http://localhost:5000/auth/register',
            headers={'Content-Type': 'application/json'},
            json=registration_data,
            timeout=10
        )
        
        if reg_response.status_code == 201:
            print("✅ Test user registered successfully")
        elif reg_response.status_code == 409:
            print("⚠️  Test user already exists (continuing with login test)")
        else:
            print(f"❌ Registration failed: {reg_response.status_code}")
            print(reg_response.json())
            return False
        
        # Now test login with registration number
        print("\n🔑 Testing login with registration number...")
        login_data = {
            "reg_number": "S101/2025/01",
            "password": "TestPass123!"
        }
        
        response = requests.post(
            'http://localhost:5000/auth/login',
            headers={'Content-Type': 'application/json'},
            json=login_data,
            timeout=10
        )
        
        print(f"📊 Login Status: {response.status_code}")
        data = response.json()
        print(f"📄 Response: {json.dumps(data, indent=2)}")
        
        if response.status_code == 200 and data.get('success'):
            print("\n✅ LOGIN SUCCESSFUL!")
            print(f"👤 User: {data['data']['user']['name']}")
            print(f"🆔 Registration Number: {data['data']['user']['reg_number']}")
            print(f"🔑 Access Token: {data['data']['access_token'][:50]}...")
            return True
        else:
            print(f"\n❌ LOGIN FAILED: {data.get('message', 'Unknown error')}")
            return False
            
    except Exception as e:
        print(f"❌ Test failed: {str(e)}")
        return False

def test_admin_login():
    """Test admin login with ADMIN001"""
    print("\n🔐 Testing Admin Login")
    print("=" * 50)
    
    # Create admin user if not exists
    admin_data = {
        "name": "System Administrator",
        "reg_number": "ADMIN001",
        "email": "admin@gau.ac.ke",
        "department": "Administration",
        "password": "AdminPass123!"
    }
    
    try:
        # Try to register admin (might exist)
        requests.post(
            'http://localhost:5000/auth/register',
            headers={'Content-Type': 'application/json'},
            json=admin_data,
            timeout=10
        )
        
        # Test admin login
        login_data = {
            "reg_number": "ADMIN001",
            "password": "AdminPass123!"
        }
        
        response = requests.post(
            'http://localhost:5000/auth/login',
            headers={'Content-Type': 'application/json'},
            json=login_data,
            timeout=10
        )
        
        print(f"📊 Admin Login Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ ADMIN LOGIN SUCCESSFUL!")
            print(f"👤 Admin: {data['data']['user']['name']}")
            print(f"🏛️ Role: {data['data']['user']['role']}")
            return True
        else:
            print(f"❌ Admin login failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Admin test failed: {str(e)}")
        return False

def test_invalid_login():
    """Test login with invalid credentials"""
    print("\n🚫 Testing Invalid Login Credentials")
    print("=" * 50)
    
    test_cases = [
        {
            "name": "Wrong Password",
            "data": {"reg_number": "S101/2025/01", "password": "WrongPass123!"}
        },
        {
            "name": "Wrong Registration Number",
            "data": {"reg_number": "S999/2099/99", "password": "TestPass123!"}
        },
        {
            "name": "Invalid Format",
            "data": {"reg_number": "INVALID", "password": "TestPass123!"}
        }
    ]
    
    for test_case in test_cases:
        try:
            response = requests.post(
                'http://localhost:5000/auth/login',
                headers={'Content-Type': 'application/json'},
                json=test_case["data"],
                timeout=10
            )
            
            if response.status_code == 401:
                print(f"✅ {test_case['name']}: Correctly rejected")
            elif response.status_code == 400:
                print(f"✅ {test_case['name']}: Validation error (expected)")
            else:
                print(f"⚠️  {test_case['name']}: Unexpected status {response.status_code}")
                
        except Exception as e:
            print(f"❌ {test_case['name']} test failed: {str(e)}")

def main():
    """Run all login tests"""
    print("🚀 Registration Number Login Test Suite")
    print("=" * 60)
    
    # Test regular student login
    student_result = test_login_with_reg_number()
    
    # Test admin login
    admin_result = test_admin_login()
    
    # Test invalid logins
    test_invalid_login()
    
    # Summary
    print("\n" + "=" * 60)
    print("📋 Test Results Summary:")
    print(f"   👤 Student Login: {'✅ PASS' if student_result else '❌ FAIL'}")
    print(f"   🔐 Admin Login: {'✅ PASS' if admin_result else '❌ FAIL'}")
    print("   🚫 Invalid Login Tests: Completed")
    
    if student_result and admin_result:
        print("\n🎉 All login tests PASSED!")
        print("✅ Registration number login is working correctly")
    else:
        print("\n⚠️  Some tests failed. Please check the issues above.")
    
    print("\n💡 Frontend Integration:")
    print("   • Visit http://localhost:5173")
    print("   • Click Login and use registration number + password")
    print("   • Student: S101/2025/01 / TestPass123!")
    print("   • Admin: ADMIN001 / AdminPass123!")

if __name__ == "__main__":
    main()