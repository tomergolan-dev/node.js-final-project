/*
  admin-service unit tests

  These tests verify that the admin-service REST API is accessible and functioning correctly.
  The tests are executed using real HTTP requests against a running server.

  The purpose of this test is to symbolically validate that:
  - the /api/about endpoint exists
  - the server responds successfully
  - the returned data structure is a JSON array
*/

const axios = require("axios");

// Base URL of the admin-service process (runs on port 3004)
const ADMIN_BASE = "http://localhost:3004";

describe("admin-service (port 3004)", () => {

    // Increase timeout to allow network operations to complete
    jest.setTimeout(20000);

    // Test that the developers information endpoint is accessible and returns an array
    test("GET /api/about returns 200 and array", async () => {
        const res = await axios.get(`${ADMIN_BASE}/api/about`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.data)).toBe(true);
    });
});
