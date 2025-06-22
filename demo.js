const BASE_API_URL = "http://localhost:3001";

// Global variables to store tokens and IDs
let authToken = null;
let employerAuthToken = null;
let userId = null;
let employerId = null;
let jobId = null;

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

    // 9. Create a job (as employer)
    logTestInfo(9, "Create new job posting (as employer)");
    const createJobResponse = await makeRequest(
      "jobs",
      "POST",
      {
        title: "Software Developer",
        description: "Exciting role for a talented developer",
        location: "Remote",
        minSalary: 60000,
        maxSalary: 90000,
        jobType: "Full-time",
        employerId: employerId,
      },
      employerAuthToken
    );

    if (createJobResponse.status === 201) {
      jobId = createJobResponse.data.id;
    }

    // 10. Get all jobs
    logTestInfo(10, "Get all job listings");
    await makeRequest("/jobs");

    // 11. Get specific job
    logTestInfo(11, "Get specific job by ID");
    await makeRequest(`jobs/${jobId}`);

    // 12. Update job (as employer)
    logTestInfo(12, "Update job posting (as employer)");
    await makeRequest(
      `jobs/${jobId}`,
      "PATCH",
      {
        title: "Senior Software Developer",
        maxSalary: 100000,
      },
      employerAuthToken
    );

    // 13. Try to update job as job seeker (should fail)
    logTestInfo(
      13,
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

    // 14. Delete job (as employer)
    logTestInfo(14, "Delete job posting (as employer)");
    await makeRequest(`jobs/${jobId}`, "DELETE", null, employerAuthToken);

    // 15. Delete user account
    logTestInfo(15, "Delete user account");
    await makeRequest(`users/${userId}`, "DELETE", null, authToken);

    // 16. Delete employer account
    logTestInfo(16, "Delete employer account");
    await makeRequest(`users/${employerId}`, "DELETE", null, employerAuthToken);

    console.log("\n====== API TESTS COMPLETED ======\n");
  } catch (error) {
    console.error("Test suite failed:", error);
  }
}

// Run the tests
runTests();
