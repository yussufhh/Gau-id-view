#!/usr/bin/env python3
"""
Test Registration and Email System
"""

import requests
import json

def test_duplicate_email_prevention():
    """Test that duplicate emails are prevented"""
    print("🧪 Testing Duplicate Email Prevention")
    print("=" * 50)
    
    # Test data
    test_data = {
        "name": "Ahmed Mohamed Hassan",
        "reg_number": "S110/2024/23", 
        "email": "ahmed.hassan@student.gau.ac.ke",
        "department": "Computer Science",
        "password": "SecurePass123!"
    }
    
    print("📝 First registration attempt...")
    
    try:
        # First registration
        response1 = requests.post(
            'http://localhost:5000/auth/register',
            headers={'Content-Type': 'application/json'},
            json=test_data,
            timeout=10
        )
        
        print(f"📊 First attempt - Status: {response1.status_code}")
        print(f"📄 Response: {json.dumps(response1.json(), indent=2)}")
        
        print("\n📝 Second registration attempt (same email, different reg number)...")
        
        # Second registration with same email but different reg number
        test_data_duplicate = test_data.copy()
        test_data_duplicate["reg_number"] = "S111/2024/24"  # Different reg number
        test_data_duplicate["name"] = "Different Student"    # Different name
        
        response2 = requests.post(
            'http://localhost:5000/auth/register',
            headers={'Content-Type': 'application/json'},
            json=test_data_duplicate,
            timeout=10
        )
        
        print(f"📊 Second attempt - Status: {response2.status_code}")
        print(f"📄 Response: {json.dumps(response2.json(), indent=2)}")
        
        if response2.status_code == 409:
            print("\n✅ SUCCESS: Duplicate email correctly prevented!")
        else:
            print(f"\n❌ FAILED: Duplicate email was NOT prevented (Status: {response2.status_code})")
            
    except requests.exceptions.ConnectionError:
        print("❌ Error: Server not running on localhost:5000")
    except Exception as e:
        print(f"❌ Error: {str(e)}")

def test_registration_with_different_email():
    """Test registration with a different email (should succeed)"""
    print("\n🧪 Testing Registration with Different Email")
    print("=" * 50)
    
    test_data = {
        "name": "Sara Ali Mohamed",
        "reg_number": "S112/2024/25", 
        "email": "sara.ali@student.gau.ac.ke",  # Different email
        "department": "Computer Science",
        "password": "SecurePass123!"
    }
    
    try:
        response = requests.post(
            'http://localhost:5000/auth/register',
            headers={'Content-Type': 'application/json'},
            json=test_data,
            timeout=10
        )
        
        print(f"📊 Registration Status: {response.status_code}")
        print(f"📄 Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 201:
            print("\n✅ SUCCESS: Registration with different email successful!")
            print("📧 Email notification should have been attempted")
        else:
            print(f"\n❌ Registration failed: {response.status_code}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Error: Server not running on localhost:5000")
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    print("🚀 GAU-ID-View Registration & Email Test")
    print("=" * 60)
    
    # Test duplicate prevention
    test_duplicate_email_prevention()
    
    # Test with different email
    test_registration_with_different_email()
    
    print("\n" + "=" * 60)
    print("🎯 Test Complete!")
    print("💡 Check server logs for email sending attempts")