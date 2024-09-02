# Technical Documentation for Payment Gateway Service

## Overview

This documentation provides a brief overview of the design of the Payment Gateway Service, including its API endpoints and usage instructions.

## Design Overview

The Payment Gateway Service is built using the NestJS framework, a progressive Node.js framework for building efficient and scalable server-side applications. The service handles payment operations, including authorization, capture, and refund processes. It employs a global exception filter to manage errors uniformly across the application, ensuring consistent error responses.

## Instructions

### .env

Add a .env into the project root

```bash
ME_CONFIG_MONGODB_SERVER=mongodb

# Basic Auth Configuration for Mongo Express
ME_CONFIG_BASICAUTH_USERNAME=admin
ME_CONFIG_BASICAUTH_PASSWORD=qwert

MONGODB_CONNECT_URL="mongodb://localhost:27017/"
MONGODB_DATABASE="vc_payments_gateway"
```

### Running Services with Docker

To run all services with Docker Compose, use the following commands:

```bash
$ docker-compose build
```

```bash
$ docker-compose up
```

### Mongo Express Access

You can view and manage the MongoDB data using Mongo Express at the following URL:

http://localhost:8081/

Login: admin

Password: qwert

## API Endpoints

### Swagger UI

After building the project, you can access and interact with all API endpoints using Swagger UI at the following URL:

http://localhost:3000/api

This interface provides a user-friendly way to explore and test the available endpoints.

### 1. Authorize Payment

**Endpoint:** POST /payments/authorize
**Description:** Authorizes a payment by validating card details and storing an authorization token.

**Request Body:**

```json
{
  "card_number": "string",
  "expiry_date": "string",
  "cvv": "number",
  "amount": "float"
}
```

**Response:**

```json
{
  "status": "success",
  "auth_token": "string"
}
```

**Errors:**

400 Bad Request: Invalid card details or request format.

500 Internal Server Error: General server error.

### 2. Capture Payment

**Endpoint:** POST /payments/capture
**Description:** Captures an authorized payment based on the provided authorization token and amount.

**Request Body:**

```json
{
  "token": "string",
  "amount": "float"
}
```

**Response:**

```json
{
  "status": "success",
  "transaction_id": "string"
}
```

**Errors:**

400 Bad Request: Token invalid, expired, or amount mismatch.

500 Internal Server Error: General server error.

### 3. Refund Payment

**Endpoint:** POST /payments/refund
**Description:** Processes a refund for a captured transaction.

**Request Body:**

```json
{
  "transaction_id": "string",
  "amount": "float"
}
```

**Response:**

```json
{
  "status": "success",
  "refund_id": "string"
}
```

**Errors:**

400 Bad Request: Invalid transaction ID or refund already processed.

500 Internal Server Error: General server error.

## Additional Notes

### Framework/Language

The service is built using the NestJS framework written into Node.JS, which provides robust error-handling capabilities through a global exception filter.

### Error Handling

The application uses a global exception filter to manage errors across the service. This filter intercepts and handles exceptions, ensuring all errors are uniformly processed and returned consistently.

### Data Types and Precision

Amount Attribute: The amount attribute in the API requests is defined as a number. In TypeScript, this type supports floating-point numbers (e.g., 5.44). Therefore, the attribute can accept and process decimal values.
