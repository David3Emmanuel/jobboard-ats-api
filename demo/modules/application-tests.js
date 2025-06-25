const {
  makeRequest,
  makeMultipartRequest,
  logTestInfo,
} = require("../utils/api-client");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");

/**
 * Application tests module
 * Handles job application CRUD and file upload
 */
class ApplicationTests {
  constructor(authToken, jobId) {
    this.authToken = authToken;
    this.jobId = jobId;
    this.applicationId = null;
    this.resumePath = path.join(__dirname, "../utils/dummy-resume.pdf");
    this.coverLetterPath = path.join(
      __dirname,
      "../utils/dummy-cover-letter.pdf"
    );
  }

  /**
   * Run all application tests (except cleanup)
   */
  async runApplicationTests() {
    console.log("\n====== APPLICATION TESTS ======");

    // Prepare dummy files for upload
    fs.writeFileSync(
      this.resumePath,
      "%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Contents 4 0 R\n>>\nendobj\n4 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 12 Tf\n72 720 Td\n(This is a dummy resume) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000204 00000 n \ntrailer\n<<\n/Size 5\n/Root 1 0 R\n>>\nstartxref\n297\n%%EOF"
    );
    fs.writeFileSync(
      this.coverLetterPath,
      "%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Contents 4 0 R\n>>\nendobj\n4 0 obj\n<<\n/Length 50\n>>\nstream\nBT\n/F1 12 Tf\n72 720 Td\n(This is a dummy cover letter) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000204 00000 n \ntrailer\n<<\n/Size 5\n/Root 1 0 R\n>>\nstartxref\n303\n%%EOF"
    );

    // 1. Apply to a job (with resume and cover letter)
    logTestInfo(1, "Apply to a job with resume and cover letter");

    const formData = new FormData();
    formData.append("resume", fs.createReadStream(this.resumePath), {
      filename: "resume.pdf",
      contentType: "application/pdf",
    });
    formData.append("coverLetter", fs.createReadStream(this.coverLetterPath), {
      filename: "cover-letter.pdf",
      contentType: "application/pdf",
    });

    const { status, data } = await makeMultipartRequest(
      `/apply/${this.jobId}`,
      "POST",
      formData,
      this.authToken
    );

    if (status === 201) this.applicationId = data.id;

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
