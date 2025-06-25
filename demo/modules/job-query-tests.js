const { makeRequest, logTestInfo } = require("../utils/api-client");

/**
 * Job query tests module
 * Handles filtering, sorting, and pagination tests
 */
class JobQueryTests {
  /**
   * Run all job query tests
   */
  async runJobQueryTests() {
    console.log("\n====== JOB QUERY TESTS ======");

    // Get all jobs (without filters)
    logTestInfo(10, "Get all job listings (no filters)");
    await makeRequest("/jobs");

    // Test filtering by job type
    logTestInfo(11, "Filter jobs by job type");
    await makeRequest("/jobs?jobType=full-time");

    // Test filtering by location
    logTestInfo(12, "Filter jobs by location");
    await makeRequest("/jobs?location=Remote");

    // Test filtering by salary range
    logTestInfo(13, "Filter jobs by salary range");
    await makeRequest("/jobs?minSalary=70000&maxSalary=100000");

    // Test filtering by title (partial match)
    logTestInfo(14, "Filter jobs by title");
    await makeRequest("/jobs?title=Developer");

    // Test sorting by salary (ascending)
    logTestInfo(15, "Sort jobs by min salary (ascending)");
    await makeRequest("/jobs?sortBy=min-salary&sortOrder=asc");

    // Test sorting by salary (descending)
    logTestInfo(16, "Sort jobs by max salary (descending)");
    await makeRequest("/jobs?sortBy=max-salary&sortOrder=desc");

    // Test pagination
    logTestInfo(17, "Test pagination (page 1, limit 2)");
    await makeRequest("/jobs?page=1&limit=2");

    // Test pagination (page 2)
    logTestInfo(18, "Test pagination (page 2, limit 1)");
    await makeRequest("/jobs?page=2&limit=1");

    // Test combining filters, sorting and pagination
    logTestInfo(19, "Test combined filtering, sorting and pagination");
    await makeRequest(
      "/jobs?location=Remote&sortBy=min-salary&sortOrder=desc&page=1&limit=2"
    );

    console.log("====== JOB QUERY TESTS COMPLETED ======\n");
  }
}

module.exports = JobQueryTests;
