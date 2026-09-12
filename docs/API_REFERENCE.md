# 🔗 API Reference - Kinetix Backend Routes

This document maps all available API endpoints in the Kinetix mobile app backend. Use this to understand the data flow and avoid breaking changes.

---

## 📍 Base URL

```
Development: http://localhost:3000/api
Production: https://kinetix.app/api
```

---

## 🔐 Authentication

### JWT Token
```typescript
// Header required for most endpoints:
Authorization: Bearer <token>

// Token obtained from:
POST /api/auth/login
POST /api/auth/register
```

### Public Endpoints (No Auth Required)
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

---

## 📋 Endpoint Categories

### 🔑 Authentication (`/api/auth/`)

#### POST `/api/auth/login`
Login with email and password

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "client" | "trainer"
  }
}
```

**Status Codes:**
- `200` - Success
- `401` - Invalid credentials
- `404` - User not found

---

#### POST `/api/auth/register`
Create new user account

**Request:**
```json
{
  "email": "newuser@example.com",
  "password": "securePassword",
  "name": "Jane Doe",
  "role": "client" | "trainer"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": "user_123", ... }
}
```

**Validations:**
- Email must be unique
- Password must be 8+ characters
- Role must be 'client' or 'trainer'

---

#### POST `/api/auth/refresh`
Refresh authentication token

**Response:**
```json
{
  "token": "newTokenHere"
}
```

---

### 💪 Workouts (`/api/workouts/`)

#### GET `/api/workouts`
Get all workouts for current user (paginated)

**Query Parameters:**
```
?page=1&limit=10&status=active|completed|archived
```

**Response:**
```json
{
  "workouts": [
    {
      "id": "workout_123",
      "name": "Upper Body Strength",
      "description": "...",
      "status": "active",
      "startDate": "2026-09-01T00:00:00Z",
      "endDate": "2026-09-30T23:59:59Z",
      "exercises": [
        { "id": "ex_1", "name": "Bench Press", "sets": 4, "reps": 8 }
      ],
      "phase": "strength",
      "progress": 45.5
    }
  ],
  "total": 12,
  "page": 1,
  "lastPage": 2
}
```

---

#### GET `/api/workouts/:id`
Get specific workout details with full exercise breakdown

**Response:**
```json
{
  "id": "workout_123",
  "name": "Upper Body Strength",
  "exercises": [
    {
      "id": "ex_1",
      "name": "Bench Press",
      "sets": [
        { "order": 1, "reps": 8, "weight": 100, "difficulty": "heavy" },
        { "order": 2, "reps": 8, "weight": 100, "difficulty": "heavy" }
      ],
      "rest": 180,
      "notes": "Focus on form"
    }
  ],
  "createdAt": "2026-09-01T00:00:00Z",
  "updatedAt": "2026-09-12T10:30:00Z"
}
```

---

#### POST `/api/workouts`
Create new workout program

**Request:**
```json
{
  "name": "New Workout",
  "description": "...",
  "phase": "strength" | "hypertrophy" | "endurance",
  "duration": 12,
  "exercises": [
    {
      "exerciseId": "ex_1",
      "sets": 4,
      "reps": 8,
      "rest": 180
    }
  ]
}
```

**Permission:** Only trainers can create for themselves or clients

---

#### PUT `/api/workouts/:id`
Update workout program

**Request:** Same as POST /api/workouts

**Permission:** Only creator (trainer) + superadmin

---

#### DELETE `/api/workouts/:id`
Delete workout (soft delete - keeps history)

**Permission:** Only creator

**Response:**
```json
{
  "success": true,
  "message": "Workout archived"
}
```

---

### 🏋️ Exercises (`/api/exercises/`)

#### GET `/api/exercises`
Get all available exercises (with search/filter)

**Query Parameters:**
```
?search=bench&category=chest&difficulty=intermediate&limit=50
```

**Response:**
```json
{
  "exercises": [
    {
      "id": "ex_1",
      "name": "Barbell Bench Press",
      "category": "chest",
      "difficulty": "intermediate",
      "equipment": ["barbell", "bench"],
      "muscleGroups": ["chest", "triceps", "shoulders"],
      "description": "...",
      "image": "https://...",
      "video": "https://...",
      "cues": ["Keep shoulders back", "Full range of motion"]
    }
  ],
  "total": 250
}
```

---

#### GET `/api/exercises/:id`
Get exercise details with form tips

**Response:** Single exercise object (see above)

---

### 📊 Workout Logs (`/api/workout-logs/`)

#### POST `/api/workout-logs`
Log completed workout session

**Request:**
```json
{
  "workoutId": "workout_123",
  "date": "2026-09-12T14:30:00Z",
  "exercises": [
    {
      "exerciseId": "ex_1",
      "sets": [
        {
          "order": 1,
          "reps": 8,
          "weight": 100,
          "difficulty": "heavy",
          "notes": "Good form"
        }
      ],
      "totalTime": 120
    }
  ],
  "totalDuration": 45,
  "mood": "energetic" | "okay" | "tired",
  "notes": "Great session!"
}
```

**Response:**
```json
{
  "id": "log_123",
  "workoutId": "workout_123",
  "userId": "user_123",
  "date": "2026-09-12T14:30:00Z",
  "achievements": [
    { "type": "5k_steps", "unlockedAt": "2026-09-12T14:35:00Z" }
  ],
  "createdAt": "2026-09-12T14:35:00Z"
}
```

---

#### GET `/api/workout-logs`
Get user's workout history

**Query Parameters:**
```
?startDate=2026-09-01&endDate=2026-09-30&limit=20&page=1
```

**Response:**
```json
{
  "logs": [
    {
      "id": "log_123",
      "workoutName": "Upper Body Strength",
      "date": "2026-09-12T14:30:00Z",
      "totalDuration": 45,
      "exercises": 5,
      "achievements": 2
    }
  ],
  "stats": {
    "totalSessions": 24,
    "averageDuration": 42.5,
    "currentStreak": 3,
    "longestStreak": 12
  }
}
```

---

### 🎯 Achievements (`/api/achievements/`)

#### GET `/api/achievements`
Get user's achievements and progress

**Response:**
```json
{
  "achievements": [
    {
      "id": "5k_steps",
      "name": "First 5K Steps",
      "description": "Complete 5,000 steps in one workout",
      "status": "unlocked",
      "unlockedAt": "2026-09-05T10:30:00Z",
      "icon": "https://...",
      "progress": 100
    },
    {
      "id": "100_workouts",
      "name": "Century Club",
      "description": "Complete 100 workouts",
      "status": "in-progress",
      "progress": 45,
      "next": "50 workouts"
    }
  ],
  "totalUnlocked": 12,
  "totalAvailable": 45,
  "points": 2340
}
```

---

#### POST `/api/achievements/:id/acknowledge`
Mark achievement as seen by user

**Response:**
```json
{
  "success": true,
  "achievement": { "id": "...", "acknowledgedAt": "..." }
}
```

---

### 👤 User Profile (`/api/users/`)

#### GET `/api/users/me`
Get current user profile

**Response:**
```json
{
  "id": "user_123",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "client",
  "avatar": "https://...",
  "bio": "...",
  "preferences": {
    "language": "es" | "en",
    "notifications": true,
    "theme": "dark" | "light"
  },
  "stats": {
    "totalWorkouts": 24,
    "totalSteps": 125000,
    "joinedDate": "2026-01-15T00:00:00Z"
  }
}
```

---

#### PUT `/api/users/me`
Update user profile

**Request:**
```json
{
  "name": "New Name",
  "avatar": "upload_data",
  "bio": "...",
  "preferences": {
    "language": "es",
    "notifications": true,
    "theme": "dark"
  }
}
```

---

#### PUT `/api/users/me/password`
Change password

**Request:**
```json
{
  "currentPassword": "oldPassword",
  "newPassword": "newSecurePassword"
}
```

---

### 📈 Analytics (`/api/analytics/`)

#### GET `/api/analytics/progress`
Get user's progress analytics

**Query Parameters:**
```
?period=week|month|year
```

**Response:**
```json
{
  "period": "month",
  "stats": {
    "workouts": 12,
    "averageIntensity": 7.5,
    "totalDuration": 540,
    "calories": 4500,
    "personalRecords": 3
  },
  "charts": {
    "workoutTrend": [
      { "date": "2026-09-01", "workouts": 1 },
      { "date": "2026-09-02", "workouts": 2 }
    ],
    "intensityTrend": [...]
  }
}
```

---

#### GET `/api/analytics/body-metrics`
Get body measurement history

**Response:**
```json
{
  "metrics": [
    {
      "date": "2026-09-12",
      "weight": 82.5,
      "bodyFat": 18.5,
      "measurements": {
        "chest": 102,
        "waist": 85,
        "biceps": 35
      }
    }
  ]
}
```

---

### 💬 Messaging (`/api/messages/`)

#### POST `/api/messages`
Send message to trainer/client

**Request:**
```json
{
  "recipientId": "user_456",
  "content": "...",
  "attachments": ["file_id_1"]
}
```

**Response:**
```json
{
  "id": "msg_123",
  "senderId": "user_123",
  "recipientId": "user_456",
  "content": "...",
  "createdAt": "2026-09-12T14:30:00Z",
  "read": false
}
```

---

#### GET `/api/messages/:conversationId`
Get message history with specific user

**Query Parameters:**
```
?limit=20&page=1
```

**Response:**
```json
{
  "messages": [
    {
      "id": "msg_123",
      "senderId": "user_123",
      "content": "Great work today!",
      "createdAt": "2026-09-12T14:30:00Z",
      "read": true
    }
  ],
  "total": 150
}
```

---

### 🏪 Payments (`/api/payments/`)

#### GET `/api/payments/methods`
Get saved payment methods

**Response:**
```json
{
  "methods": [
    {
      "id": "pm_123",
      "type": "credit_card",
      "last4": "4242",
      "brand": "visa",
      "default": true
    }
  ]
}
```

---

#### POST `/api/payments/charge`
Process payment for trainer session/service

**Request:**
```json
{
  "amount": 50.00,
  "currency": "USD",
  "description": "Personal Training Session",
  "paymentMethodId": "pm_123"
}
```

**Response:**
```json
{
  "success": true,
  "transactionId": "txn_123",
  "amount": 50.00,
  "status": "completed",
  "timestamp": "2026-09-12T14:30:00Z"
}
```

---

## 🛡️ Error Handling

All endpoints follow standard error format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR" | "AUTH_ERROR" | "NOT_FOUND" | "SERVER_ERROR",
    "message": "Human-readable error message",
    "details": {
      "field": "error details"
    }
  }
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (auth required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate, etc.)
- `500` - Server Error

---

## 🔄 Rate Limiting

```
- 100 requests per minute per user
- 1000 requests per minute per IP
- Rate limit headers:
  X-RateLimit-Limit: 100
  X-RateLimit-Remaining: 95
  X-RateLimit-Reset: 1694520600
```

---

## 📝 Request/Response Conventions

### Pagination
```
Query: ?page=1&limit=20

Response:
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 245,
    "lastPage": 13,
    "hasMore": true
  }
}
```

### Timestamps
All timestamps use ISO 8601 format:
```
2026-09-12T14:30:00.000Z (UTC)
```

### IDs
All resource IDs are prefixed:
```
user_123       (users)
workout_123    (workouts)
ex_1           (exercises)
log_123        (logs)
msg_123        (messages)
pm_123         (payment methods)
```

---

## 🚫 Breaking Changes to Avoid

**DO NOT CHANGE:**
```
- POST /api/auth/login request/response structure
- GET /api/workouts/:id response schema
- POST /api/workout-logs request structure
- Required fields in any existing endpoint
- Existing endpoint paths (can add new ones)
- Database IDs format
- Authentication header format
```

**SAFE TO CHANGE:**
```
- Add new optional fields to responses
- Add new query parameters
- Deprecate old endpoints (keep working but mark deprecated)
- Improve performance (same response)
- Better error messages
- Add new endpoints
```

---

## 🔍 API Request Examples

### cURL
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Get workouts (with token)
curl http://localhost:3000/api/workouts \
  -H "Authorization: Bearer eyJhbGc..."
```

### TypeScript/JavaScript
```typescript
const response = await fetch('/api/workouts', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
```

---

## 📚 Related Documentation

- [Database Schema](../apps/mobile/prisma/schema.prisma)
- [Auth Flow](../apps/mobile/src/lib/auth.ts)
- [API Implementation](../apps/mobile/src/app/api/)
- [Contributing Guide](./AI_CONTRIBUTION_GUIDE.md)

---

**Last Updated:** September 12, 2026  
**Version:** 1.0  
**Status:** STABLE
