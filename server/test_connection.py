#!/usr/bin/env python3
"""
Simple API connectivity test
"""
import requests
import json

def test_api_connection():
    """Test basic API connectivity"""
    base_url = "http://localhost:5000"
    
    print("🔗 Testing API Connectivity...")
    
    # Test health check
    try:
        response = requests.get(f"{base_url}/health", timeout=5)
        print(f"Health Check: {response.status_code}")
        if response.status_code == 200:
            print(f"✅ {response.json()['message']}")
        else:
            print(f"❌ Health check failed")
    except requests.exceptions.RequestException as e:
        print(f"❌ Connection failed: {e}")
        return False
    
    # Test API info
    try:
        response = requests.get(f"{base_url}/api/info", timeout=5)
        print(f"API Info: {response.status_code}")
        if response.status_code == 200:
            info = response.json()
            print(f"✅ API: {info['name']} v{info['version']}")
        else:
            print(f"❌ API info failed")
    except requests.exceptions.RequestException as e:
        print(f"❌ API info failed: {e}")
    
    # Test admin login
    try:
        login_data = {
            "email": "admin@gau.ac.ke",
            "password": "Admin@123"
        }
        response = requests.post(
            f"{base_url}/auth/login",
            json=login_data,
            headers={'Content-Type': 'application/json'},
            timeout=5
        )
        print(f"Admin Login: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            token = result['data']['access_token']
            print(f"✅ Admin login successful, token: {token[:50]}...")
            
            # Test protected endpoint
            headers = {'Authorization': f'Bearer {token}'}
            response = requests.get(
                f"{base_url}/admin/students",
                headers=headers,
                timeout=5
            )
            print(f"Protected Endpoint: {response.status_code}")
            if response.status_code == 200:
                print("✅ Protected endpoint accessible")
            else:
                print(f"❌ Protected endpoint failed: {response.text}")
        else:
            print(f"❌ Admin login failed: {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Login test failed: {e}")
    
    print("\n🎉 API Connection Tests Complete!")
    return True

if __name__ == '__main__':
    test_api_connection()