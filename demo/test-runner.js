// Parse command line arguments
const args = process.argv.slice(2);
const shouldPersist = args.includes("--persist");

// Import test modules
const AuthTests = require("./modules/auth-tests");
const UserTests = require("./modules/user-tests");
const JobTests = require("./modules/job-tests");
const JobQueryTests = require("./modules/job-query-tests");
const ApplicationTests = require("./modules/application-tests");
const FileUploadTests = require("./modules/file-upload-tests");

/**
 * Main test runner that orchestrates all test modules
 */
async function runTests() {
  try {
    console.log("\n====== STARTING API TESTS ======\n");

    if (shouldPersist) {
      console.log(
        "🚀 Running in PERSIST mode - delete tests will be skipped\n"
      );
    }

    // 1. Run authentication tests
    const authTests = new AuthTests();
    const authResults = await authTests.runAuthTests();

    // 2. Run user management tests
    const userTests = new UserTests(
      authResults.authToken,
      authResults.userId,
      authResults.employerAuthToken,
      authResults.employerId
    );
    await userTests.runUserTests();

    // 3. Run job management tests
    const jobTests = new JobTests(
      authResults.employerAuthToken,
      authResults.employerId,
      authResults.authToken
    );
    const jobResults = await jobTests.runJobTests();

    // 4. Run job query tests
    const jobQueryTests = new JobQueryTests();
    await jobQueryTests.runJobQueryTests();

    // 5. Run application tests (apply to the first created job)
    const applicationTests = new ApplicationTests(
      authResults.authToken,
      jobResults.jobId
    );
    await applicationTests.runApplicationTests();

    // 6. Run file upload tests (download the dummy resume file uploaded in application)
    const dummyResumeFilename = `dummy-resume.txt`;
    const fileUploadTests = new FileUploadTests(dummyResumeFilename);
    await fileUploadTests.runFileUploadTests();

    // 7. Cleanup (if not in persist mode)
    if (!shouldPersist) {
      await fileUploadTests.cleanupFileDownloads();
      await applicationTests.cleanupApplications();
      await jobTests.cleanupJobs();
      await userTests.cleanupUsers();
    } else {
      console.log(
        "\n==== SKIPPING DELETE TESTS (--persist flag detected) ===="
      );
      console.log("📝 Created data will persist in the database");
      console.log(
        `   - Job IDs: ${jobResults.jobId}, ${jobResults.secondJobId}, ${jobResults.thirdJobId}`
      );
      console.log(
        `   - User IDs: ${authResults.userId}, ${authResults.employerId}`
      );
      console.log(`   - Application ID: ${applicationTests.applicationId}`);
      console.log(`   - Resume filename: ${dummyResumeFilename}`);
    }

    console.log("\n====== API TESTS COMPLETED ======\n");
  } catch (error) {
    console.error("Test suite failed:", error);
  }
}

// Run the tests
runTests();
