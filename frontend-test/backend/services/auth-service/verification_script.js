import axios from 'axios';

const AUTH_URL = 'http://localhost:3001/api/v1/auth';


function generateTestUser() {
  const timestamp = Date.now();
  return {
    name: 'Test User',
    email: `test${timestamp}_${Math.floor(Math.random() * 1000)}@example.com`,
    password: 'password123',
    role: 'USER'
  };
}

const TEST_USER_SIGNUP = generateTestUser();
const TEST_USER_DIRECT = generateTestUser();


async function testSignup() {
  try {
    console.log('Testing Signup...');
    const response = await axios.post(`${AUTH_URL}/signup`, TEST_USER_SIGNUP);
    console.log('Signup Successful:', response.data);
    return true;
  } catch (error) {
    console.error('Signup Failed:', error.response?.data?.message || error.message);
    if (error.response?.data?.stack) {
      console.error('Server Stack:', error.response.data.stack);
    }
    return false;
  }
}

async function testLogin() {
  try {
    console.log('Testing Login...');
    const response = await axios.post(`${AUTH_URL}/login`, {
      email: TEST_USER_SIGNUP.email,
      password: TEST_USER_SIGNUP.password
    });
    console.log('Login Successful:', response.data);
    return true;
  } catch (error) {
    console.error('Login Failed:', error.response?.data || error.message);
    return false;
  }
}


const USER_SERVICE_URL = 'http://localhost:3000/api/v1/user';
const INTERNAL_SECRET = 'traguin-internal-secret'; // Hardcoded for verification

async function checkUserService() {
  try {
    console.log('Checking User Service connectivity...');
    // Try to get a non-existent email to check DB connection and route
    const response = await axios.get(`${USER_SERVICE_URL}/email/health-check@example.com`, {
      headers: { 'x-internal-secret': INTERNAL_SECRET }
    });
    console.log('User Service returned:', response.status, response.data);
    return true;
  } catch (error) {
    if (error.response) {
      console.log('User Service check response:', error.response.status, error.response.data);
      // 404 is actually GOOD here, it means service is up and checked DB
      if (error.response.status === 404) {
        console.log('User Service is reachable and DB query likely worked (User not found).');
        return true;
      }
    } else {
      console.error('User Service Unreachable:', error.message);
    }
    return false;
  }
}


async function checkUserCreation() {
  try {
    console.log('Testing User Creation directly in User Service...');
    const response = await axios.post(`${USER_SERVICE_URL}/create`, TEST_USER_DIRECT, {
      headers: { 'x-internal-secret': INTERNAL_SECRET }
    });
    console.log('User Creation Direct Success:', response.status, response.data);
    return true;
  } catch (error) {
    console.error('User Creation Direct Failed:', error.response?.status, error.response?.data || error.message);
    return false;
  }
}

async function runTests() {
  console.log('Starting Verification...');

  const userHealth = await checkUserService();
  if (!userHealth) {
    console.error('Skipping Auth tests because User Service is not healthy.');
    return;
  }

  const userCreationSuccess = await checkUserCreation();
  if (!userCreationSuccess) {
    console.error('Skipping Auth tests because User Service creation failed directly.');
    return;
  }

  const signupSuccess = await testSignup();
  if (signupSuccess) {
    await testLogin();
  }
  console.log('Verification Complete.');
}

runTests();
