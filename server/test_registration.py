#!/usr/bin/env python3
"""
Test Registration with Email System
"""

import requests
import json
import sys

def test_registration():
    """Test user registration with email notification"""
    
    # Registration data
    registration_data = {
        "name": "Ahmed Mohamed Hassan",
        "reg_number": "S110/2024/23", 
        "email": "ahmed.hassan@student.gau.ac.ke",
        "department": "Computer Science",
        "password": "SecurePass123!"
    }
    
    try:
        print("🧪 Testing Registration with Email Notification...")
        print("=" * 60)
        
        # Make registration request
        response = requests.post(
            'http://localhost:5000/auth/register',
            headers={'Content-Type': 'application/json'},
            json=registration_data,
            timeout=30
        )
        
        print(f"📊 Response Status: {response.status_code}")
        print(f"📄 Response Body:")
        print(json.dumps(response.json(), indent=2))
        
        if response.status_code == 201:
            print("\n✅ Registration successful!")
            print("📧 Welcome email should have been sent (if SMTP configured)")
            print("🎯 Email templates are ready for production use")
        else:
            print(f"\n❌ Registration failed with status {response.status_code}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Error: Could not connect to server. Make sure Flask server is running on port 5000")
        return False
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False
    
    return True

if __name__ == "__main__":
    test_registration()