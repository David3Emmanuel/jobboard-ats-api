const { logTestInfo } = require("../utils/api-client");
const fs = require("fs");
const path = require("path");

/**
 * File upload tests module
 * Handles file download for uploaded resumes/cover letters
 */
class FileUploadTests {
  constructor(filename) {
    this.filename = filename;
    this.downloadedPath = path.join(
      __dirname,
      `../utils/downloaded-${this.filename}`
    );
  }

  /**
   * Run all file upload/download tests (except cleanup)
   */
  async runFileUploadTests() {
    console.log("\n====== FILE UPLOAD/DOWNLOAD TESTS ======");

    // 1. Download uploaded file (simulate resume download)
    logTestInfo(1, "Download uploaded file");
    const response = await fetch(
      `http://localhost:3001/uploads/${this.filename}`
    );
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(this.downloadedPath, Buffer.from(buffer));
    console.log(`Downloaded file saved to: ${this.downloadedPath}`);

    console.log("====== FILE UPLOAD/DOWNLOAD TESTS COMPLETED ======\n");
  }

  /**
   * Cleanup method to delete the downloaded file if it exists
   */
  cleanupFileDownloads() {
    if (fs.existsSync(this.downloadedPath)) {
      fs.unlinkSync(this.downloadedPath);
      console.log(`Cleaned up downloaded file: ${this.downloadedPath}`);
    }
  }
}

module.exports = FileUploadTests;
