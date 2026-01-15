/*
  costs-service unit tests

  These tests verify that the costs-service REST API endpoints are functioning correctly.
  The tests are executed using real HTTP requests against a running server and a real MongoDB database.

  The following scenarios are tested:
  1. Creating a temporary test user (required before adding costs)
  2. Adding a new cost item for that user
  3. Retrieving a monthly report for the user

  The purpose of these tests is symbolic validation of endpoint availability,
  correct HTTP status codes, and basic response structure.
*/

const axios = require("axios");

// Base URLs of the related services
const USERS_BASE = "http://localhost:3002";
const COSTS_BASE = "http://localhost:3003";

/*
  Generate a temporary user id for testing purposes.
  The id is derived from the current timestamp to minimize collisions with existing users.
*/
const TEST_USER_ID = Number(String(Date.now()).slice(-6));

// Current year and month used for the monthly report request
const TEST_YEAR = new Date().getFullYear();
const TEST_MONTH = new Date().getMonth() + 1;

describe("costs-service (port 3003)", () => {

    // Increase timeout to allow database and network operations to complete
    jest.setTimeout(20000);

    /*
      Setup step:
      Create a test user in the users-service.

      This step is required because the costs-service validates that the user exists
      before allowing a cost item to be added.
    */
    test("Setup: create a test user in users-service (needed for adding costs)", async () => {
        const payload = {
            id: TEST_USER_ID,
            first_name: "test",
            last_name: "user",
            birthday: "2000-01-01"
        };

        const res = await axios.post(`${USERS_BASE}/api/add`, payload);
        expect([200, 201]).toContain(res.status);
    });

    // Test adding a new cost item for the previously created user
    test("POST /api/add (add cost) returns 200/201 and cost fields", async () => {
        const payload = {
            description: "test cost",
            category: "food",
            userid: TEST_USER_ID,
            sum: 12.5
        };

        const res = await axios.post(`${COSTS_BASE}/api/add`, payload);

        expect([200, 201]).toContain(res.status);
        expect(res.data).toHaveProperty("description");
        expect(res.data).toHaveProperty("category");
        expect(res.data).toHaveProperty("userid", TEST_USER_ID);
        expect(res.data).toHaveProperty("sum");
    });

    /*
      Test retrieving the monthly report for the test user.

      The response should include:
      - the user id
      - the requested year and month
      - the "costs" field containing the grouped cost items
    */
    test("GET /api/report returns 200 and includes userid/year/month", async () => {
        const res = await axios.get(`${COSTS_BASE}/api/report`, {
            params: { id: TEST_USER_ID, year: TEST_YEAR, month: TEST_MONTH }
        });

        expect(res.status).toBe(200);
        expect(res.data).toHaveProperty("userid", TEST_USER_ID);
        expect(res.data).toHaveProperty("year", TEST_YEAR);
        expect(res.data).toHaveProperty("month", TEST_MONTH);
        expect(res.data).toHaveProperty("costs");
    });
});
