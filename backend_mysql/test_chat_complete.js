require("dotenv").config();
const axios = require("axios");

async function testChatFunctionality() {
  try {
    console.log("\n🔍 CHAT FUNCTIONALITY TEST\n");

    // Step 1: Create a test user
    console.log("1. Creating test user...");
    const testUser = {
      email: `chattest${Date.now()}@test.com`,
      password: "password123",
      confirmPassword: "password123",
      name: "Chat Test User",
      role: "seeker",
      language: "en",
      state: "TestState",
      city: "TestCity",
    };

    const registerRes = await axios.post(
      "http://localhost:4000/api/auth/register",
      testUser
    );

    if (!registerRes.data.success) {
      console.log("❌ Registration failed:", registerRes.data.message);
      return;
    }

    const token = registerRes.data.data.token;
    const userId = registerRes.data.data.user.id;
    console.log("✅ User created:", userId);

    // Step 2: Test sending a message
    console.log("\n2. Testing message send...");
    const sendRes = await axios.post(
      "http://localhost:4000/api/messages",
      {
        receiverId: 2, // Send to existing user
        message: "Hello from chat test!",
        jobId: 1,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (sendRes.data.success) {
      console.log("✅ Message sent successfully");
      console.log("   Message ID:", sendRes.data.data.id);
    } else {
      console.log("❌ Message send failed:", sendRes.data.message);
      return;
    }

    // Step 3: Test getting conversation
    console.log("\n3. Testing conversation retrieval...");
    const convRes = await axios.get("http://localhost:4000/api/messages/2", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (convRes.data.success) {
      console.log("✅ Conversation retrieved successfully");
      console.log("   Messages count:", convRes.data.data.length);
      console.log(
        "   Latest message:",
        convRes.data.data[convRes.data.data.length - 1]?.message
      );
    } else {
      console.log("❌ Conversation retrieval failed:", convRes.data.message);
    }

    console.log("\n🎉 CHAT TEST COMPLETE!");
    console.log("\n📝 Frontend Requirements:");
    console.log("   • User must be logged in");
    console.log("   • Token must be in localStorage");
    console.log("   • API calls: POST /messages, GET /messages/:userId");

    console.log("\n🧪 Test JWT Token (for manual testing):");
    console.log(`   ${token.substring(0, 50)}...`);
  } catch (error) {
    console.log("\n❌ Chat Test Error:");
    console.log("   Status:", error.response?.status);
    console.log("   Message:", error.response?.data?.message || error.message);

    if (error.response?.status === 401) {
      console.log(
        "\n💡 This is expected if testing auth - chat requires login!"
      );
    }
  }
}

testChatFunctionality();
