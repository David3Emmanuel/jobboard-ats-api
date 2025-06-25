const { fetch } = require("undici");
const BASE_API_URL = "http://localhost:3001";

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
    console.log("Options:", JSON.stringify(options, null, 2));
    console.log("Status:", response.status);
    console.log("Response:", JSON.stringify(data, null, 2));

    return { status: response.status, data };
  } catch (error) {
    console.error(`Error in ${method} ${endpoint}:`, error);
    return { status: 500, data: { message: error.message } };
  }
}

/**
 * Helper function to make multipart/form-data requests
 * @param {string} endpoint - API endpoint
 * @param {string} method - HTTP method
 * @param {FormData} formData - Form data object
 * @param {string} token - Auth token
 * @returns {Promise<object>} - Response object
 */
async function makeMultipartRequest(
  endpoint,
  method = "POST",
  formData = null,
  token = null
) {
  // FIXME: this function has issues
  const options = {
    method,
    headers: {},
  };

  if (formData) {
    options.body = formData;
  }

  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }

  if (!endpoint.startsWith("/")) endpoint = `/${endpoint}`;

  try {
    const response = await fetch(`${BASE_API_URL}${endpoint}`, options);
    const data = await response.json();

    console.log(`\n--- ${method} ${endpoint} ---`);
    console.log(
      "Options:",
      JSON.stringify(
        {
          ...options,
          body: formData ? "FormData object" : options.body,
        },
        null,
        2
      )
    );
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

module.exports = {
  makeRequest,
  makeMultipartRequest,
  logTestInfo,
  BASE_API_URL,
};
