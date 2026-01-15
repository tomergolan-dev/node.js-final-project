/*
  users-service unit tests

  These tests verify that the users-service REST API endpoints are working properly.
  The tests are executed against a running server (HTTP requests) and a real MongoDB database,
  as required in the project instructions.

  The purpose of these tests is to symbolically validate:
  - endpoint availability
  - correct HTTP status codes
  - basic structure of returned JSON responses
*/

const axios = require("axios");

// Base URL of the users-service process (runs on port 3002)
const USERS_BASE = "http://localhost:3002";

/*
  Generate a temporary user id for testing.
  We use the last digits of the current timestamp in order to minimize collisions
  with existing users in the database.
*/
const TEST_USER_ID = Number(String(Date.now()).slice(-6));

// Test user object that will be sent to POST /api/add
const TEST_USER = {
    id: TEST_USER_ID,
    first_name: "test",
    last_name: "user",
    birthday: "2000-01-01"
};

describe("users-service (port 3002)", () => {

    // Increase default timeout because database and network operations may take time
    jest.setTimeout(20000);

    // Test that the endpoint for listing all users is accessible and returns an array
    test("GET /api/users returns 200 and array", async () => {
        const res = await axios.get(`${USERS_BASE}/api/users`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.data)).toBe(true);
    });

    // Test adding a new user via POST request
    test("POST /api/add (add user) returns 200/201 and user fields", async () => {
        const res = await axios.post(`${USERS_BASE}/api/add`, TEST_USER);

        expect([200, 201]).toContain(res.status);
        expect(res.data).toHaveProperty("id");
        expect(res.data).toHaveProperty("first_name");
        expect(res.data).toHaveProperty("last_name");
    });

    /*
      Test retrieving a specific user by id.
      This test assumes that the user was successfully created in the previous test.
      The response should include the user's total costs field as required by the project specification.
    */
    test("GET /api/users/:id returns 200 and includes total", async () => {
        const res = await axios.get(`${USERS_BASE}/api/users/${TEST_USER_ID}`);

        expect(res.status).toBe(200);
        expect(res.data).toHaveProperty("id", TEST_USER_ID);
        expect(res.data).toHaveProperty("total");
    });
});
