/*
  logs-service unit tests

  These tests verify that the logs-service REST API is accessible and functioning correctly.
  The tests are executed using real HTTP requests against a running server and a real MongoDB database.

  The goal is to symbolically validate that:
  - the endpoint exists
  - the server responds successfully
  - the returned data has a valid structure
*/

const axios = require("axios");

// Base URL of the logs-service process (runs on port 3001)
const LOGS_BASE = "http://localhost:3001";

describe("logs-service (port 3001)", () => {

    // Increase timeout to allow database and network operations to complete
    jest.setTimeout(20000);

    // Test that the logs endpoint is accessible and returns a JSON array
    test("GET /api/logs returns 200 and array", async () => {
        const res = await axios.get(`${LOGS_BASE}/api/logs`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.data)).toBe(true);
    });
});
