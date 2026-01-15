Cost Manager – RESTful Web Services (Final Project)

This project is implemented as four independent microservices, each running in its own process and on its own port, according to the course requirements.

In addition, the project includes unit tests that are executed from the root folder and communicate with the running services via real HTTP requests.

PROJECT STRUCTURE

node.js-final-project/
|
|-- services/
|   |-- logs-service     (port 3001)
|   |-- users-service    (port 3002)
|   |-- costs-service    (port 3003)
|   |-- admin-service    (port 3004)
|
|-- tests               (unit tests for all services)
|-- package.json        (root scripts for running all services & tests)
|-- README.txt

MICROSERVICES OVERVIEW

logs-service   : Retrieve system logs                    (port 3001)
users-service  : Users management (add user, list users) (port 3002)
costs-service  : Add cost items, monthly report          (port 3003)
admin-service  : Developers team info (/api/about)       (port 3004)

Each service is a standalone Node.js + Express + MongoDB application.

RUNNING EACH MICROSERVICE INDIVIDUALLY

You can run any service separately from its own folder.

Example (users-service):

cd services/users-service
npm install
npm start

Repeat for any other service:

services/logs-service
services/costs-service
services/admin-service

Each service will start its own server and connect to MongoDB.

RUNNING ALL SERVICES TOGETHER (FROM ROOT FOLDER)

The root project includes scripts that start all microservices simultaneously.

One-time setup (from root):

npm install

Install dependencies for each service:

npm --prefix services/logs-service install
npm --prefix services/users-service install
npm --prefix services/costs-service install
npm --prefix services/admin-service install

Start all services:

npm start

or

npm run start:all

Expected output:

logs-service running on [http://localhost:3001](http://localhost:3001)
users-service running on [http://localhost:3002](http://localhost:3002)
costs-service running on [http://localhost:3003](http://localhost:3003)
admin-service running on [http://localhost:3004](http://localhost:3004)

Stop all services:

Ctrl + C

API QUICK CHECK

Open in browser or Postman:

[http://localhost:3001/api/logs](http://localhost:3001/api/logs)
[http://localhost:3002/api/users](http://localhost:3002/api/users)
[http://localhost:3003/api/report?id=123123&year=2025&month=1](http://localhost:3003/api/report?id=123123&year=2025&month=1)
[http://localhost:3004/api/about](http://localhost:3004/api/about)

UNIT TESTS

Tests are located in:

tests/

Each service has its own test file:

logs.test.js
users.test.js
costs.test.js
admin.test.js

Important notes:

* Tests send real HTTP requests to the running services
* Tests use the same MongoDB database as the project
* Tests may create temporary users and cost items
* Tests verify endpoint availability, HTTP status codes, and basic response structure

Run tests (services must already be running):

npm test

ENVIRONMENT VARIABLES

Each microservice uses its own .env file for:

* MongoDB connection string
* Port configuration

DATABASE REQUIREMENTS FOR SUBMISSION

The database must be empty except for one user:

id: 123123
first_name: mosh
last_name: israeli

TECHNOLOGIES USED

Node.js
Express.js
MongoDB Atlas
Mongoose
Pino (logging)
Jest + Axios (unit tests)
concurrently (multi-process execution)

NOTES

* Each microservice is fully independent and can be deployed separately
* Root folder scripts are provided for development convenience only
* Unit tests are included for code review as required by the course

Good
