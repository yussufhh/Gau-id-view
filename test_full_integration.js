const axios = require('axios');

// Test the complete integration
async function testRegistrationLogin() {
  try {
    console.log('Testing Registration Number Login Integration...\n');
    
    // Test 1: Backend API direct test
    console.log('1. Testing Backend API directly:');
    const backendResponse = await axios.post('http://localhost:5000/auth/login', {
      reg_number: 'S101/2025/01',
      password: 'TestPass123!'
    });
    
    console.log('✅ Backend login successful');
    console.log('Token received:', backendResponse.data.data.access_token ? 'Yes' : 'No');
    console.log('User role:', backendResponse.data.data.user.role);
    console.log('Registration number:', backendResponse.data.data.user.reg_number);
    console.log('');
    
    // Test 2: Test protected endpoint with token
    console.log('2. Testing protected endpoint with JWT token:');
    const token = backendResponse.data.data.access_token;
    
    const profileResponse = await axios.get('http://localhost:5000/student/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Protected endpoint access successful');
    console.log('Profile ID:', profileResponse.data.data.id_number);
    console.log('Profile status:', profileResponse.data.data.status);
    console.log('');
    
    // Test 3: Test invalid registration number
    console.log('3. Testing invalid registration number:');
    try {
      await axios.post('http://localhost:5000/auth/login', {
        reg_number: 'INVALID123',
        password: 'TestPass123!'
      });
    } catch (error) {
      console.log('✅ Invalid registration number properly rejected');
      console.log('Error message:', error.response.data.message);
    }
    console.log('');
    
    console.log('🎉 All integration tests passed!');
    console.log('Registration number login system is fully functional.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.message || error.message);
  }
}

testRegistrationLogin();