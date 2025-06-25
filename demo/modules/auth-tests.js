const { makeRequest, logTestInfo } = require("../utils/api-client");

/**
 * Authentication tests module
 * Handles user registration and login for both job seekers and employers
 */
class AuthTests {
  constructor() {
    this.authToken = null;
    this.employerAuthToken = null;
    this.userId = null;
    this.employerId = null;
  }

  /**
   * Run all authentication tests
   */
  async runAuthTests() {
    console.log("\n====== AUTHENTICATION TESTS ======");

    // Test the root endpoint
    logTestInfo(1, "Get API welcome message");
    await makeRequest("/");

    // Register job seeker user
    logTestInfo(2, "Register job seeker user");
    await makeRequest("/auth/signup", "POST", {
      username: "jobseeker1",
      password: "password123",
    });

    // Login as job seeker
    logTestInfo(3, "Login as job seeker");
    const loginResponse = await makeRequest("/auth/login", "POST", {
      username: "jobseeker1",
      password: "password123",
    });

    if (loginResponse.status === 201) {
      this.authToken = loginResponse.data.access_token;
      this.userId = loginResponse.data.id;
      console.log("Job seeker logged in successfully!");
    }

    // Register employer user
    logTestInfo(4, "Register employer user");
    await makeRequest("/auth/signup", "POST", {
      username: "employer1",
      password: "employer123",
      role: "employer",
    });

    // Login as employer
    logTestInfo(5, "Login as employer");
    const employerLoginResponse = await makeRequest("/auth/login", "POST", {
      username: "employer1",
      password: "employer123",
    });

    if (employerLoginResponse.status === 201) {
      this.employerAuthToken = employerLoginResponse.data.access_token;
      this.employerId = employerLoginResponse.data.id;
      console.log("Employer logged in successfully!");
    }

    console.log("====== AUTHENTICATION TESTS COMPLETED ======\n");

    return {
      authToken: this.authToken,
      employerAuthToken: this.employerAuthToken,
      userId: this.userId,
      employerId: this.employerId,
    };
  }
}

module.exports = AuthTests;
