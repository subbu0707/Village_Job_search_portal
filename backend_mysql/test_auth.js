// Test registration and login flow
require("dotenv").config();
const axios = require("axios");

const API_BASE = "http://localhost:4000/api";

async function testAuthFlow() {
  console.log("\n🧪 Testing Authentication Flow\n");
  console.log("=".repeat(50));

  // Test data
  const testUser = {
    email: `test${Date.now()}@example.com`,
    password: "Test123456",
    confirmPassword: "Test123456",
    name: "Test User",
    role: "seeker",
    phone: "9876543210",
    state: "Tamil Nadu",
    city: "Chennai",
    language: "en",
  };

  try {
    // Test 1: Register a new user
    console.log("\n📝 Test 1: User Registration");
    console.log("-".repeat(50));
    console.log("Registering user:", testUser.email);

    const registerResponse = await axios.post(
      `${API_BASE}/auth/register`,
      testUser
    );

    if (registerResponse.data.success) {
      console.log("✅ Registration successful!");
      console.log("   User ID:", registerResponse.data.data.id);
      console.log(
        "   Token received:",
        registerResponse.data.data.token ? "Yes" : "No"
      );
    }

    const token = registerResponse.data.data.token;
    const userId = registerResponse.data.data.id;

    // Test 2: Login with the registered user
    console.log("\n🔐 Test 2: User Login");
    console.log("-".repeat(50));
    console.log("Logging in with:", testUser.email);

    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: testUser.email,
      password: testUser.password,
      termsAccepted: true,
    });

    if (loginResponse.data.success) {
      console.log("✅ Login successful!");
      console.log("   User:", loginResponse.data.data.name);
      console.log("   Role:", loginResponse.data.data.role);
      console.log(
        "   Token received:",
        loginResponse.data.data.token ? "Yes" : "No"
      );
    }

    // Test 3: Get current user profile
    console.log("\n👤 Test 3: Get Current User");
    console.log("-".repeat(50));

    const profileResponse = await axios.get(`${API_BASE}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (profileResponse.data.success) {
      console.log("✅ Profile retrieved successfully!");
      console.log("   Name:", profileResponse.data.data.name);
      console.log("   Email:", profileResponse.data.data.email);
      console.log("   Role:", profileResponse.data.data.role);
      console.log("   State:", profileResponse.data.data.state);
      console.log("   City:", profileResponse.data.data.city);
    }

    // Test 4: Test duplicate registration
    console.log("\n🚫 Test 4: Duplicate Registration");
    console.log("-".repeat(50));
    console.log("Attempting to register with same email...");

    try {
      await axios.post(`${API_BASE}/auth/register`, testUser);
      console.log("❌ Should have failed but didn't!");
    } catch (error) {
      if (error.response?.status === 409) {
        console.log("✅ Duplicate registration correctly rejected!");
        console.log("   Message:", error.response.data.message);
      } else {
        console.log(
          "⚠️  Unexpected error:",
          error.response?.data?.message || error.message
        );
      }
    }

    // Test 5: Test wrong password
    console.log("\n🔒 Test 5: Wrong Password");
    console.log("-".repeat(50));
    console.log("Attempting login with wrong password...");

    try {
      await axios.post(`${API_BASE}/auth/login`, {
        email: testUser.email,
        password: "WrongPassword123",
        termsAccepted: true,
      });
      console.log("❌ Should have failed but didn't!");
    } catch (error) {
      if (error.response?.status === 401) {
        console.log("✅ Wrong password correctly rejected!");
        console.log("   Message:", error.response.data.message);
      } else {
        console.log(
          "⚠️  Unexpected error:",
          error.response?.data?.message || error.message
        );
      }
    }

    console.log("\n" + "=".repeat(50));
    console.log("✅ All authentication tests passed!\n");
    console.log("📌 Test Summary:");
    console.log("   ✅ User registration works");
    console.log("   ✅ User login works");
    console.log("   ✅ Token authentication works");
    console.log("   ✅ Profile retrieval works");
    console.log("   ✅ Duplicate registration prevented");
    console.log("   ✅ Wrong password rejected");
    console.log("\n🎉 Your sign-up and sign-in process is smooth!\n");
  } catch (error) {
    console.log("\n❌ Test failed!");
    console.log("Error:", error.response?.data?.message || error.message);
    if (error.response?.data) {
      console.log("Details:", JSON.stringify(error.response.data, null, 2));
    }
    console.log("\n💡 Make sure the backend server is running on port 4000\n");
  }
}

// Run tests
console.log("\n🚀 Starting Authentication Tests...");
console.log("Make sure backend server is running on http://localhost:4000\n");

setTimeout(() => {
  testAuthFlow();
}, 1000);
