# Employee Management System

A full-stack web application for HR departments to manage employee records. Built with **Spring Boot + Kotlin** on the backend and **Next.js** on the frontend, backed by **MongoDB**.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Docker Setup](#docker-setup)
- [API Reference](#api-reference)
- [Data Models](#data-models)
- [Frontend Pages](#frontend-pages)
- [Form Validation](#form-validation)
- [Unit Testing](#unit-testing)
- [Optional Features Implemented](#optional-features-implemented)
- [Known Limitations](#known-limitations)

---

## Overview

Employee Management System is a full-stack web application that allows HR staff to:

- Add, view, edit, and delete employee records
- Search and browse employees with server-side pagination
- Upload and display employee profile photos
- View individual employee profiles with full details
- Receive real-time form validation and error feedback

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Spring Boot 3, Kotlin |
| Database | MongoDB |
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Validation | Jakarta Validation (`@NotBlank`, `@Email`, `@Positive`) |
| Testing | JUnit 5, Mockito |
| Containerisation | Docker, Docker Compose |
| API Testing | Postman |

---

## Project Structure

```
employee-management-project/
├── docker-compose.yml
├── README.md
├── submissions/
│   ├── Employee Management API.postman_collection.json
│   └── employees_database_export.json
│
├── backend/                        # Spring Boot Kotlin project
│   ├── Dockerfile
│   └── src/
│       ├── main/kotlin/com/example/employee/
│       │   ├── controller/
│       │   │   └── EmployeeController.kt
│       │   ├── service/
│       │   │   └── EmployeeService.kt
│       │   ├── repository/
│       │   │   ├── EmployeeRepository.kt
│       │   │   └── DepartmentRepository.kt
│       │   ├── model/
│       │   │   ├── Employee.kt
│       │   │   └── Department.kt
│       │   ├── dto/
│       │   │   └── EmployeeDto.kt
│       │   ├── exception/
│       │   │   └── GlobalExceptionHandler.kt
│       │   └── EmployeeApplication.kt
│       └── test/kotlin/com/example/employee/
│           └── service/
│               └── EmployeeServiceTest.kt
│
└── employee-management-ui/         # Next.js project
    ├── Dockerfile
    ├── next.config.ts
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx                # Dashboard
    │   └── employees/
    │       ├── page.tsx            # Employee list
    │       ├── add/page.tsx        # Add employee
    │       └── [id]/
    │           ├── page.tsx        # Employee details
    │           ├── edit/page.tsx   # Edit employee
    │           └── delete/page.tsx # Delete confirmation
    ├── components/
    │   ├── Sidebar.tsx
    │   └── Header.tsx
    └── lib/
        └── api.ts                  # Centralised API base URL
```

---

## Getting Started

### Prerequisites

- Java 21
- Node.js LTS (18+)
- MongoDB Community Server running on `localhost:27017`
- Git

### Backend Setup

**1. Clone the repository**

```bash
git clone <your-repo-url>
cd employee-management-project/backend
```

**2. Configure MongoDB**

The default connection is set in `src/main/resources/application.properties`:

```properties
spring.data.mongodb.uri=mongodb://localhost:27017/employee_db
spring.application.name=employee
```

Make sure MongoDB is running before starting the backend:

```bash
# macOS / Linux
mongod --dbpath /data/db

# Windows
net start MongoDB
```

**3. Run the backend**

```bash
./gradlew bootRun
```

The backend starts on `http://localhost:8080`.

---

### Frontend Setup

**1. Navigate to the frontend directory**

```bash
cd employee-management-project/employee-management-ui
```

**2. Install dependencies**

```bash
npm install
```

**3. Run the development server**

```bash
npm run dev
```

The frontend starts on `http://localhost:3000`.

> Make sure the backend is running before using the frontend — all API calls target `http://localhost:8080`.

---

### Docker Setup

Docker configuration is fully implemented. To run the entire stack (MongoDB, backend, frontend) in containers with a single command:

**Prerequisites:** Docker and Docker Compose installed and running.

```bash
# From the project root
docker compose up --build

# Stop all containers
docker compose down

# Stop and delete the database volume too
docker compose down -v
```

Once running, visit `http://localhost:3000` as normal. All three services start automatically in the correct order — MongoDB first, then the backend once MongoDB is healthy, then the frontend.

> Note: Requires unrestricted access to Docker Hub to pull base images (`mongo:7`, `gradle:8.5-jdk21`, `node:20-alpine`). May not work on networks with a corporate Docker registry mirror configured.

---

## API Reference

Base URL: `http://localhost:8080/api`

All endpoints return JSON. CORS is enabled for `http://localhost:3000`.

### Employees

| Method | Endpoint | Description | Status Code |
|---|---|---|---|
| `POST` | `/employees` | Create a new employee | `201 Created` |
| `GET` | `/employees` | List employees (paginated) | `200 OK` |
| `GET` | `/employees/{id}` | Get employee by ID | `200 OK` |
| `PUT` | `/employees/{id}` | Update employee by ID | `200 OK` |
| `DELETE` | `/employees/{id}` | Delete employee by ID | `204 No Content` |

### Pagination & Search

The `GET /employees` endpoint supports query parameters:

| Parameter | Default | Description |
|---|---|---|
| `page` | `0` | Page number (zero-based) |
| `size` | `10` | Results per page |
| `search` | `""` | Search across first name, last name, and email |

Example: `GET /api/employees?page=0&size=10&search=jane`

### Example Request — Create Employee

```http
POST /api/employees
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane.doe@company.com",
  "nic": "901234567V",
  "designation": "Software Engineer",
  "departmentId": "ENG",
  "salary": 85000,
  "profileImage": "data:image/jpeg;base64,/9j/4AAQ..."
}
```

### Example Response

```json
{
  "employeeId": "64f1a2b3c4d5e6f7a8b9c0d1",
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane.doe@company.com",
  "nic": "901234567V",
  "designation": "Software Engineer",
  "departmentId": "ENG",
  "salary": 85000,
  "dateOfJoining": "2024-01-15",
  "profileImage": "data:image/jpeg;base64,/9j/4AAQ..."
}
```


### Error Responses

Validation errors return `400 Bad Request` with a field-level map:

```json
{
  "email": "must be a well-formed email address",
  "salary": "must be greater than 0"
}
```

Not-found errors return `404 Not Found`:

```json
{
  "error": "Employee with ID xyz not found"
}
```

Duplicate email returns `409 Conflict`:

```json
{
  "error": "An employee with this email already exists."
}
```

---

## Data Models

### Employee

| Field | Type | Description |
|---|---|---|
| `employeeId` | `String` | Auto-generated MongoDB ObjectId |
| `firstName` | `String` | Required |
| `lastName` | `String` | Required |
| `email` | `String` | Required, unique, must be valid email format |
| `nic` | `String` | National Identity Card number |
| `designation` | `String` | Job title (e.g. "Software Engineer") |
| `departmentId` | `String` | Reference to department (`ENG`, `HR`, `FIN`, `MKT`) |
| `salary` | `Double` | Must be a positive number |
| `dateOfJoining` | `LocalDate` | Auto-set to current date on creation, preserved on update |
| `profileImage` | `String?` | Optional Base64 encoded profile photo |

### Department

| Field | Type | Values |
|---|---|---|
| `departmentId` | `String` | Auto-generated |
| `departmentName` | `DepartmentName` | `HR`, `FINANCE`, `ENGINEERING`, `SALES` |

---

## Frontend Pages

| Route | Page | Description |
|---|---|---|
| `/` | Dashboard | Stats overview (total employees, avg salary, departments), recent employees list |
| `/employees` | Employee List | Paginated, searchable table with profile photos and department badges |
| `/employees/add` | Add Employee | Form with profile photo upload |
| `/employees/[id]` | Employee Profile | Full detail view with gradient header and profile photo |
| `/employees/[id]/edit` | Edit Employee | Pre-filled form with existing photo loaded |
| `/employees/[id]/delete` | Delete Confirmation | Confirmation screen showing employee details before deletion |

---

## Form Validation

Client-side validation is applied on both the Add and Edit forms before any API call is made:

| Rule | Field | Message |
|---|---|---|
| Required | All fields | "All fields are required." |
| Email format | Email | "Please enter a valid email address." |
| Positive number | Salary | "Salary must be greater than zero." |
| File size | Profile photo | "Image must be smaller than 2MB." |

Server-side validation is enforced independently via Jakarta Validation annotations on the `EmployeeDto`.

---

## Unit Testing

Service layer unit tests are implemented using **JUnit 5** and **Mockito**. The repository is mocked so no real MongoDB connection is required to run the tests.

### Test Coverage

| Test | Description |
|---|---|
| `addEmployee should save and return the employee` | Verifies `save()` is called and the correct employee is returned |
| `getAllEmployees should return a page when search is blank` | Verifies paginated response with empty search term |
| `getAllEmployees should filter results when search term is provided` | Verifies search term is passed to repository |
| `getEmployeeById should return employee when found` | Verifies correct employee is returned by ID |
| `getEmployeeById should throw RuntimeException when not found` | Verifies error message when ID does not exist |
| `updateEmployee should preserve the original dateOfJoining` | Verifies join date is not overwritten on update |
| `updateEmployee should throw RuntimeException when not found` | Verifies `save()` is never called if employee missing |
| `deleteEmployee should call deleteById when employee exists` | Verifies `deleteById()` is called exactly once |
| `deleteEmployee should throw RuntimeException when not found` | Verifies `deleteById()` is never called if employee missing |

### Running Tests

```bash
cd backend
./gradlew test
```

Results are available at `build/reports/tests/test/index.html`.

**Last run:** 10 tests, 0 failures, 100% successful.

---

## Optional Features Implemented

| Feature | Status | Notes                                                                         |
|---|---|-------------------------------------------------------------------------------|
| Pagination & Search | ✅ Done | Server-side via MongoDB regex, debounced search input, sliding page buttons   |
| Profile Image Upload | ✅ Done | Base64 stored in MongoDB, 2MB limit enforced client-side                      |
| Unit Testing | ✅ Done | 9 service layer tests, 100% passing via JUnit 5 + Mockito                     |
| Docker Setup | ✅ Done | `docker-compose.yml` with health checks, Dockerfiles for backend and frontend |
| Dark Mode | Planned | -                                                                             |
| JWT Authentication | Planned | -                                                                             |
| Role-Based Access Control | Planned | Depends on JWT                                                                |

---

## Known Limitations

- No authentication or role-based access control, all endpoints are publicly accessible.
- Department records are not pre-seeded; `departmentId` on employees is stored as a plain string reference.
- Docker requires unrestricted Docker Hub access to pull base images may fail on networks with a corporate registry mirror configured.
- Profile images are stored as Base64 strings in MongoDB. For production use, external object storage (e.g. AWS S3) would be more appropriate for large images.