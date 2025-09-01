# Deno Oak REST API Setup

This project provides a complete setup for a Deno web server using Oak framework with testing capabilities.

## Prerequisites

- [Deno](https://deno.land/) installed on your system
- [curl](https://curl.se/) (optional, for command line API testing)
- [jq](https://stedolan.github.io/jq/) (optional, for pretty JSON output in curl examples)
- [Postman](https://www.postman.com/) (optional, for GUI testing)

## Project Structure

```
├── server.ts         # Main web server (entry point)
├── router.ts         # API route definitions
├── controller.ts     # Handles HTTP requests, validation, and calls service
├── service.ts        # Business/data logic (can add transformers here)
├── validator.ts      # Validation schemas (Valibot)
├── main.test.ts      # Unit tests
├── curl.examples.sh  # cURL examples
└── README.md         # This file
```
## Future add to structure: Response Transformation

You can add a transformer function at the end of each service call in `service.ts` to shape or format the data before sending it to the frontend. This is useful for adapting backend data to frontend needs without changing core logic.

## Quick Start

### 1. Start the Server


```bash
deno run --allow-net server.ts
```

The server will start on `http://localhost:8000`

### 2. Test with cURL

Make the script executable and run it:

```bash
chmod +x curl.examples.sh
./curl.examples.sh
```

Or run individual commands:

```bash
# Get all users
curl http://localhost:8000/users

# Create a new user
curl -X POST http://localhost:8000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@example.com"}'

# Get specific user
curl http://localhost:8000/users/1

# Update user
curl -X PUT http://localhost:8000/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Name"}'

# Delete user
curl -X DELETE http://localhost:8000/users/1
```

### 3. Run Unit Tests

**Important:** Start the server first in one terminal, then run tests in another terminal.

```bash

# Terminal 1: Start server
deno run --allow-net server.ts

# Terminal 2: Run tests
deno test --allow-net main.test.ts
```

### 4. Use Postman (Optional)

1. Open Postman
2. Import the collection file: `deno-oak-api.postman.json`
3. The collection includes all API endpoints with example requests

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/`      | Welcome message and API info |
| GET    | `/users` | Get all users |
| GET    | `/users/:id` | Get user by ID |
| POST   | `/users` | Create new user |
| PUT    | `/users/:id` | Update user |
| DELETE | `/users/:id` | Delete user |

## Example Request/Response

### Create User
**Request:**
```bash
POST /users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "user": {
    "id": 3,
    "name": "John Doe", 
    "email": "john@example.com"
  }
}
```
