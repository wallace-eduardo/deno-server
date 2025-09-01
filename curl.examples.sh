#!/bin/bash

# API Testing Script with cURL
# Make sure the server is running first: deno run --allow-net server.ts

BASE_URL="http://localhost:8000"

echo "Testing Deno Oak REST API"
echo "================================"

echo
echo "1. GET / - main endpoint"
curl -X GET "$BASE_URL/" | jq .

echo
echo "2. GET /users - Get all users"
curl -X GET "$BASE_URL/users" | jq .

echo
echo "3. GET /users/1 - Get specific user"
curl -X GET "$BASE_URL/users/1" | jq .

echo
echo "4. POST /users - Create new user"
curl -X POST "$BASE_URL/users" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson", 
    "email": "alice@example.com"
  }' | jq .

echo
echo "5. PUT /users/1 - Update user"
curl -X PUT "$BASE_URL/users/1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Updated",
    "email": "john.updated@example.com"
  }' | jq .

echo
echo "6. DELETE /users/2 - Delete user"
curl -X DELETE "$BASE_URL/users/2" -v

echo
echo "7. GET /users - Verify changes"
curl -X GET "$BASE_URL/users" | jq .

echo
echo "8. GET /users/999 - Test 404 error"
curl -X GET "$BASE_URL/users/999" | jq .

echo
echo "API testing complete!"