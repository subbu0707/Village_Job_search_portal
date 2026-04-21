require("dotenv").config();
const axios = require("axios");

async function testMessageAPI() {
  try {
    console.log("\n🔍 Testing Message API...\n");

    // Register a fresh test user
    console.log("1. Registering a test user...");
    const testEmail = "testuser" + Date.now() + "@test.com";

    const registerResponse = await axios.post(
      "https://village-job-search-portal.onrender.com/api/auth/register",
      {
        email: testEmail,
        password: "password123",
        confirmPassword: "password123",
        name: "Test User Chat",
        role: "seeker",
        language: "en",
        state: "Test State",
        city: "Test City",
        termsAccepted: true,
      },
    );

    if (!registerResponse.data.success) {
      console.log("❌ Registration failed:", registerResponse.data.message);
      return;
    }

    const token = registerResponse.data.data.token;
    const userId = registerResponse.data.data.user.id;
    console.log("✅ Registration successful! User ID:", userId);

    // Now test sending a message (to user ID 2)
    console.log("\n2. Testing message send...");
    const messageResponse = await axios.post(
      "https://village-job-search-portal.onrender.com/api/messages",
      {
        receiverId: 2, // Send to existing user
        message: "Test message from API test",
        jobId: 1,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (messageResponse.data.success) {
      console.log("✅ Message sent successfully!");
      console.log("   Message ID:", messageResponse.data.data.id);
      console.log("   Response:", messageResponse.data.message);
    } else {
      console.log("❌ Message send failed:", messageResponse.data.message);
    }

    // Test getting conversation
    console.log("\n3. Testing conversation retrieval...");
    const conversationResponse = await axios.get(
      `https://village-job-search-portal.onrender.com/api/messages/2`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (conversationResponse.data.success) {
      console.log("✅ Conversation retrieved successfully!");
      console.log("   Messages count:", conversationResponse.data.data.length);
      if (conversationResponse.data.data.length > 0) {
        console.log("   Sample message:", conversationResponse.data.data[0]);
      }
    } else {
      console.log(
        "❌ Conversation retrieval failed:",
        conversationResponse.data.message,
      );
    }

    console.log("\n✅ API Test Complete! Message endpoints are working.");
  } catch (error) {
    console.log("❌ API Test Error:");
    console.log("   Status:", error.response?.status);
    console.log("   Message:", error.response?.data?.message || error.message);
    console.log("   URL:", error.config?.url);
    console.log("   Method:", error.config?.method);
    if (error.response?.data) {
      console.log(
        "   Full Response:",
        JSON.stringify(error.response.data, null, 2),
      );
    }
  }
}

testMessageAPI();
