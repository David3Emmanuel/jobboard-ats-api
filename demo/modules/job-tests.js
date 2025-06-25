const { makeRequest, logTestInfo } = require("../utils/api-client");

/**
 * Job management tests module
 * Handles CRUD operations on jobs
 */
class JobTests {
  constructor(employerAuthToken, employerId, authToken) {
    this.employerAuthToken = employerAuthToken;
    this.employerId = employerId;
    this.authToken = authToken;
    this.jobId = null;
    this.secondJobId = null;
    this.thirdJobId = null;
  }

  /**
   * Run all job management tests
   */
  async runJobTests() {
    console.log("\n====== JOB MANAGEMENT TESTS ======");

    // Create multiple jobs (as employer) for testing list filters and pagination
    logTestInfo(9, "Create new job postings (as employer)");

    // Create first job
    const createJobResponse = await makeRequest(
      "jobs",
      "POST",
      {
        title: "Software Developer",
        description: "Exciting role for a talented developer",
        location: "Remote",
        minSalary: 60000,
        maxSalary: 90000,
        jobType: "full-time",
        employerId: this.employerId,
      },
      this.employerAuthToken
    );

    if (createJobResponse.status === 201) {
      this.jobId = createJobResponse.data.id;
    }

    // Create second job with different properties for filter/sort testing
    const createJob2Response = await makeRequest(
      "jobs",
      "POST",
      {
        title: "Frontend Developer",
        description: "UI/UX focused developer role",
        location: "New York",
        minSalary: 75000,
        maxSalary: 110000,
        jobType: "contract",
        employerId: this.employerId,
      },
      this.employerAuthToken
    );

    if (createJob2Response.status === 201) {
      this.secondJobId = createJob2Response.data.id;
    }

    // Create third job with different properties for filter/sort testing
    const createJob3Response = await makeRequest(
      "jobs",
      "POST",
      {
        title: "DevOps Engineer",
        description: "Infrastructure and deployment automation",
        location: "Remote",
        minSalary: 85000,
        maxSalary: 120000,
        jobType: "part-time",
        employerId: this.employerId,
      },
      this.employerAuthToken
    );

    if (createJob3Response.status === 201) {
      this.thirdJobId = createJob3Response.data.id;
    }

    // Get specific job
    logTestInfo(20, "Get specific job by ID");
    await makeRequest(`jobs/${this.jobId}`);

    // Update job (as employer)
    logTestInfo(21, "Update job posting (as employer)");
    await makeRequest(
      `jobs/${this.jobId}`,
      "PATCH",
      {
        title: "Senior Software Developer",
        maxSalary: 100000,
      },
      this.employerAuthToken
    );

    // Try to update job as job seeker (should fail)
    logTestInfo(
      22,
      "Authorization test - Update job as job seeker (should fail)"
    );
    await makeRequest(
      `jobs/${this.jobId}`,
      "PATCH",
      {
        title: "This should not work",
      },
      this.authToken
    );

    console.log("====== JOB MANAGEMENT TESTS COMPLETED ======\n");

    return {
      jobId: this.jobId,
      secondJobId: this.secondJobId,
      thirdJobId: this.thirdJobId,
    };
  }

  /**
   * Clean up job data (called when not in persist mode)
   */
  async cleanupJobs() {
    console.log("\n====== JOB CLEANUP ======");

    // Delete jobs (as employer)
    logTestInfo(23, "Delete job postings (as employer)");
    await makeRequest(
      `jobs/${this.jobId}`,
      "DELETE",
      null,
      this.employerAuthToken
    );
    await makeRequest(
      `jobs/${this.secondJobId}`,
      "DELETE",
      null,
      this.employerAuthToken
    );
    await makeRequest(
      `jobs/${this.thirdJobId}`,
      "DELETE",
      null,
      this.employerAuthToken
    );

    console.log("====== JOB CLEANUP COMPLETED ======\n");
  }
}

module.exports = JobTests;
