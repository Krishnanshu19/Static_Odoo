<<<<<<< HEAD
Problem Statement 2: StackIt – A Minimal Q&A Forum Platform

Team Member Name:                       Email:
    Krishnanshu Agrawal(TL)                 Krishnanshuagrawal.19@gmail.com
    Uday Singh                              udaysingh131105@gmail.com
    Ravi Gangwar                            ravigangwar7465@gmail.com
    Prakhar Singh Parihaar                  prakharsingh130303@gmail.com
=======
# Backend API

This is the backend API for the Oddo StackIt application.

## Features

- **Database Connection**: Robust MongoDB connection with retry logic and connection monitoring
- **JWT Authentication**: Secure token-based authentication with access and refresh tokens
- **Utility Functions**: Comprehensive utility functions for common operations
- **Error Handling**: Centralized error handling and logging
- **Input Validation**: Input sanitization and validation utilities

## Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory with the following variables:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/oddo-stackit

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
```

3. Start the server:
```bash
npm start
```

## Database Connection

The database connection is handled by `src/db/connect.js` with the following features:

- **Automatic Retry**: Retries connection up to 5 times with 5-second intervals
- **Connection Monitoring**: Tracks connection state and events
- **Graceful Shutdown**: Properly closes connections on app termination
- **Health Check**: Database status included in health endpoint

### Connection Status

The health endpoint (`/api/health`) returns database connection information:

```json
{
  "message": "Server is running",
  "status": "OK",
  "database": {
    "isConnected": true,
    "readyState": 1,
    "host": "localhost",
    "port": 27017,
    "name": "oddo-stackit"
  }
}
```

## Utility Functions

### JWT Utilities (`src/utils/jwtUtils.js`)

- `generateAccessToken(userId, email, role)` - Generate access token
- `generateRefreshToken(userId)` - Generate refresh token
- `generateTokenPair(userId, email, role)` - Generate both tokens
- `verifyAccessToken(token)` - Verify access token
- `verifyRefreshToken(token)` - Verify refresh token
- `extractTokenFromHeader(authHeader)` - Extract token from Authorization header
- `isTokenExpired(token)` - Check if token is expired

### General Utilities (`src/utils/utils.js`)

- `hashPassword(password, saltRounds)` - Hash password with bcrypt
- `comparePassword(password, hash)` - Compare password with hash
- `validatePasswordStrength(password)` - Validate password strength
- `isValidEmail(email)` - Validate email format
- `successResponse(message, data, statusCode)` - Format success response
- `errorResponse(message, error, statusCode)` - Format error response
- `sanitizeInput(input)` - Sanitize user input
- `generatePagination(page, limit, total)` - Generate pagination info
- `asyncHandler(fn)` - Async error handler wrapper
- `logError(error, context, additionalInfo)` - Log errors with context

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Health Check

- `GET /api/health` - Server and database health status

## Error Handling

All errors are logged with context and formatted consistently:

```json
{
  "success": false,
  "message": "Error message",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "statusCode": 500
}
```

## Security Features

- Password hashing with bcrypt
- JWT token validation
- Input sanitization
- CORS enabled
- Environment variable configuration 
>>>>>>> 0d46f5b (Add: basic auth and posting question api)
