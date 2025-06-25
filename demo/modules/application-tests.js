const { makeRequest, logTestInfo } = require("../utils/api-client");
const fs = require("fs");
const path = require("path");

/**
 * Application tests module
 * Handles job application CRUD and file upload
 */
class ApplicationTests {
  constructor(authToken, jobId) {
    this.authToken = authToken;
    this.jobId = jobId;
    this.applicationId = null;
    this.resumePath = path.join(__dirname, "../utils/dummy-resume.txt");
    this.coverLetterPath = path.join(
      __dirname,
      "../utils/dummy-cover-letter.txt"
    );
  }

  /**
   * Run all application tests (except cleanup)
   */
  async runApplicationTests() {
    console.log("\n====== APPLICATION TESTS ======");

    // Prepare dummy files for upload
    fs.writeFileSync(this.resumePath, "This is a dummy resume.");
    fs.writeFileSync(this.coverLetterPath, "This is a dummy cover letter.");

    // 1. Apply to a job (with resume and cover letter)
    logTestInfo(1, "Apply to a job with resume and cover letter");
    const formData = new FormData();
    formData.append("resume", fs.createReadStream(this.resumePath));
    formData.append("coverLetter", fs.createReadStream(this.coverLetterPath));
    const response = await fetch(`http://localhost:3001/apply/${this.jobId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.authToken}`,
      },
      body: formData,
    });
    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Response:", JSON.stringify(data, null, 2));
    if (response.status === 201) {
      this.applicationId = data.id;
    }

    // 2. Get all applications for the user
    logTestInfo(2, "Get all applications for the user");
    await makeRequest("/apply", "GET", null, this.authToken);

    // 3. Get specific application
    logTestInfo(3, "Get specific application");
    await makeRequest(
      `/apply/${this.applicationId}`,
      "GET",
      null,
      this.authToken
    );

    // 4. Update application (no fields to update, just test endpoint)
    logTestInfo(4, "Update application (noop)");
    await makeRequest(
      `/apply/${this.applicationId}`,
      "PATCH",
      {},
      this.authToken
    );

    // Clean up dummy files
    fs.unlinkSync(this.resumePath);
    fs.unlinkSync(this.coverLetterPath);

    console.log("====== APPLICATION TESTS COMPLETED ======\n");
  }

  /**
   * Cleanup method to delete the application if it was created
   */
  async cleanupApplications() {
    if (!this.applicationId) return;
    console.log("\n====== APPLICATION CLEANUP ======");
    logTestInfo(5, "Delete application");
    await makeRequest(
      `/apply/${this.applicationId}`,
      "DELETE",
      null,
      this.authToken
    );
    console.log("====== APPLICATION CLEANUP COMPLETED ======\n");
  }
}

module.exports = ApplicationTests;
