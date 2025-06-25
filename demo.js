const BASE_API_URL = "http://localhost:3001";

// Parse command line arguments
const args = process.argv.slice(2);
const shouldPersist = args.includes("--persist");

// Global variables to store tokens and IDs
let authToken = null;
let employerAuthToken = null;
let userId = null;
let employerId = null;
let jobId = null;
let secondJobId = null;
let thirdJobId = null;

/**
 * Helper function to make HTTP requests
 * @param {string} endpoint - API endpoint
 * @param {string} method - HTTP method
 * @param {object} body - Request body
 * @param {string} token - Auth token
 * @returns {Promise<object>} - Response object
 */
async function makeRequest(
  endpoint,
  method = "GET",
  body = null,
  token = null
) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }

  if (!endpoint.startsWith("/")) endpoint = `/${endpoint}`;

  try {
    const response = await fetch(`${BASE_API_URL}${endpoint}`, options);
    const data = await response.json();

    console.log(`\n--- ${method} ${endpoint} ---`);
    console.log("Options:", options);
    console.log("Status:", response.status);
    console.log("Response:", JSON.stringify(data, null, 2));

    return { status: response.status, data };
  } catch (error) {
    console.error(`Error in ${method} ${endpoint}:`, error);
    return { status: 500, data: { message: error.message } };
  }
}

/**
 * Helper function to log test information
 * @param {number} testNumber - Test number
 * @param {string} testName - Test name
 */
function logTestInfo(testNumber, testName) {
  console.log(`\n==== TEST ${testNumber}: ${testName} ====`);
}

/**
 * Test all endpoints in sequence
 */
async function runTests() {
  try {
    console.log("\n====== STARTING API TESTS ======\n");

    if (shouldPersist) {
      console.log(
        "🚀 Running in PERSIST mode - delete tests will be skipped\n"
      );
    }

    // 1. Test the root endpoint
    logTestInfo(1, "Get API welcome message");
    await makeRequest("/"); // 2. Create a job seeker user
    logTestInfo(2, "Register job seeker user");
    const signupResponse = await makeRequest("/auth/signup", "POST", {
      username: "jobseeker1",
      password: "password123",
    });

    // 3. Login as job seeker
    logTestInfo(3, "Login as job seeker");
    const loginResponse = await makeRequest("/auth/login", "POST", {
      username: "jobseeker1",
      password: "password123",
    });

    if (loginResponse.status === 201) {
      authToken = loginResponse.data.access_token;
      userId = loginResponse.data.id;
      console.log("Job seeker logged in successfully!");
    }

    // 4. Create an employer user
    logTestInfo(4, "Register employer user");
    await makeRequest("/auth/signup", "POST", {
      username: "employer1",
      password: "employer123",
      role: "employer",
    });

    // 5. Login as employer
    logTestInfo(5, "Login as employer");
    const employerLoginResponse = await makeRequest("/auth/login", "POST", {
      username: "employer1",
      password: "employer123",
    });

    if (employerLoginResponse.status === 201) {
      employerAuthToken = employerLoginResponse.data.access_token;
      employerId = employerLoginResponse.data.id;
      console.log("Employer logged in successfully!");
    }

    // // 6. Get all users
    logTestInfo(6, "Get all users");
    await makeRequest("/users");

    // 7. Get specific user
    logTestInfo(7, "Get specific user by ID");
    await makeRequest(`users/${userId}`);

    // 8. Update user
    logTestInfo(8, "Update user information");
    await makeRequest(
      `users/${userId}`,
      "PATCH",
      {
        username: "updated_jobseeker",
      },
      authToken
    );

    // 9. Create multiple jobs (as employer) for testing list filters and pagination
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
        employerId: employerId,
      },
      employerAuthToken
    );

    if (createJobResponse.status === 201) {
      jobId = createJobResponse.data.id;
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
        employerId: employerId,
      },
      employerAuthToken
    );

    if (createJob2Response.status === 201) {
      secondJobId = createJob2Response.data.id;
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
        employerId: employerId,
      },
      employerAuthToken
    );

    if (createJob3Response.status === 201) {
      thirdJobId = createJob3Response.data.id;
    }

    // 10. Get all jobs (without filters)
    logTestInfo(10, "Get all job listings (no filters)");
    await makeRequest("/jobs");

    // 11. Test filtering by job type
    logTestInfo(11, "Filter jobs by job type");
    await makeRequest("/jobs?jobType=full-time");

    // 12. Test filtering by location
    logTestInfo(12, "Filter jobs by location");
    await makeRequest("/jobs?location=Remote");

    // 13. Test filtering by salary range
    logTestInfo(13, "Filter jobs by salary range");
    await makeRequest("/jobs?minSalary=70000&maxSalary=100000");

    // 14. Test filtering by title (partial match)
    logTestInfo(14, "Filter jobs by title");
    await makeRequest("/jobs?title=Developer");

    // 15. Test sorting by salary (ascending)
    logTestInfo(15, "Sort jobs by min salary (ascending)");
    await makeRequest("/jobs?sortBy=min-salary&sortOrder=asc");

    // 16. Test sorting by salary (descending)
    logTestInfo(16, "Sort jobs by max salary (descending)");
    await makeRequest("/jobs?sortBy=max-salary&sortOrder=desc");

    // 17. Test pagination
    logTestInfo(17, "Test pagination (page 1, limit 2)");
    await makeRequest("/jobs?page=1&limit=2");

    // 18. Test pagination (page 2)
    logTestInfo(18, "Test pagination (page 2, limit 1)");
    await makeRequest("/jobs?page=2&limit=1");

    // 19. Test combining filters, sorting and pagination
    logTestInfo(19, "Test combined filtering, sorting and pagination");
    await makeRequest(
      "/jobs?location=Remote&sortBy=min-salary&sortOrder=desc&page=1&limit=2"
    );

    // 20. Get specific job
    logTestInfo(20, "Get specific job by ID");
    await makeRequest(`jobs/${jobId}`);

    // 21. Update job (as employer)
    logTestInfo(21, "Update job posting (as employer)");
    await makeRequest(
      `jobs/${jobId}`,
      "PATCH",
      {
        title: "Senior Software Developer",
        maxSalary: 100000,
      },
      employerAuthToken
    );

    // 22. Try to update job as job seeker (should fail)
    logTestInfo(
      22,
      "Authorization test - Update job as job seeker (should fail)"
    );
    await makeRequest(
      `jobs/${jobId}`,
      "PATCH",
      {
        title: "This should not work",
      },
      authToken
    );

    // Skip delete tests if --persist flag is used
    if (!shouldPersist) {
      // 23. Delete jobs (as employer)
      logTestInfo(23, "Delete job postings (as employer)");
      await makeRequest(`jobs/${jobId}`, "DELETE", null, employerAuthToken);
      await makeRequest(
        `jobs/${secondJobId}`,
        "DELETE",
        null,
        employerAuthToken
      );
      await makeRequest(
        `jobs/${thirdJobId}`,
        "DELETE",
        null,
        employerAuthToken
      );

      // 24. Delete user account
      logTestInfo(24, "Delete user account");
      await makeRequest(`users/${userId}`, "DELETE", null, authToken);

      // 25. Delete employer account
      logTestInfo(25, "Delete employer account");
      await makeRequest(
        `users/${employerId}`,
        "DELETE",
        null,
        employerAuthToken
      );
    } else {
      console.log(
        "\n==== SKIPPING DELETE TESTS (--persist flag detected) ===="
      );
      console.log("📝 Created data will persist in the database");
      console.log(`   - Job IDs: ${jobId}, ${secondJobId}, ${thirdJobId}`);
      console.log(`   - User IDs: ${userId}, ${employerId}`);
    }

    console.log("\n====== API TESTS COMPLETED ======\n");
  } catch (error) {
    console.error("Test suite failed:", error);
  }
}

// Run the tests
runTests();
