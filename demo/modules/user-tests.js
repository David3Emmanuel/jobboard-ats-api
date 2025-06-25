const { makeRequest, logTestInfo } = require("../utils/api-client");

/**
 * User management tests module
 * Handles CRUD operations on users
 */
class UserTests {
  constructor(authToken, userId, employerAuthToken, employerId) {
    this.authToken = authToken;
    this.userId = userId;
    this.employerAuthToken = employerAuthToken;
    this.employerId = employerId;
  }

  /**
   * Run all user management tests
   */
  async runUserTests() {
    console.log("\n====== USER MANAGEMENT TESTS ======");

    // Get all users
    logTestInfo(6, "Get all users");
    await makeRequest("/users");

    // Get specific user
    logTestInfo(7, "Get specific user by ID");
    await makeRequest(`users/${this.userId}`);

    // Update user
    logTestInfo(8, "Update user information");
    await makeRequest(
      `users/${this.userId}`,
      "PATCH",
      {
        username: "updated_jobseeker",
      },
      this.authToken
    );

    console.log("====== USER MANAGEMENT TESTS COMPLETED ======\n");
  }

  /**
   * Clean up user data (called when not in persist mode)
   */
  async cleanupUsers() {
    console.log("\n====== USER CLEANUP ======");

    // Delete user account
    logTestInfo(24, "Delete user account");
    await makeRequest(`users/${this.userId}`, "DELETE", null, this.authToken);

    // Delete employer account
    logTestInfo(25, "Delete employer account");
    await makeRequest(
      `users/${this.employerId}`,
      "DELETE",
      null,
      this.employerAuthToken
    );

    console.log("====== USER CLEANUP COMPLETED ======\n");
  }
}

module.exports = UserTests;
