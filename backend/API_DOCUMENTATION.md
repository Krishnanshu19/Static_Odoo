# StackIt Backend API Documentation

## Base URL

```
/api/v1/
```

---

## Authentication

### Register
- **POST** `/auth/register`
#### Payload
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "name": "string"
}
```
#### Response
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { /* user object, no password */ },
    "token": "jwt_token"
  },
  "statusCode": 201
}
```

### Login
- **POST** `/auth/login`
#### Payload
```json
{
  "email": "string",
  "password": "string"
}
```
#### Response
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { /* user object */ },
    "token": "jwt_token"
  },
  "statusCode": 200
}
```

---

## Questions

### Submit a Question
- **POST** `/questions`
- **Auth required**
#### Payload
```json
{
  "title": "string",
  "description": "string",
  "tags": ["string", ...]
}
```
#### Response
```json
{
  "message": "Question submitted successfully",
  "question": { /* question object */ }
}
```

### Get Questions
- **GET** `/questions?filter=popular|unanswered|newest`
- **No auth required**
- **Query Params:**
  - `filter` (optional):
    - `popular`: Most upvoted questions
    - `unanswered`: Questions with no answers
    - `newest` (default): Latest questions
#### Response
```json
{
  "questions": [
    {
      "_id": "...",
      "title": "...",
      "description": "...",
      "tags": ["..."],
      "user": "...", // userId
      "username": "...", // username of the question owner
      "upvoteCount": 5,
      "downvoteCount": 1,
      "totalReplies": 3,
      "createdAt": "...",
      "updatedAt": "..."
      // For popular: may include upvoteCount, downvoteCount, username, totalReplies
    }
    // ...
  ]
}
```

---

## Answers

### Post an Answer
- **POST** `/answers`
- **Auth required**
#### Payload
```json
{
  "questionId": "string",
  "content": "string",
  "userTagged": ["username1", "username2"] // optional
}
```
#### Response
```json
{
  "message": "Answer posted successfully",
  "answer": { /* answer object */ }
}
```

---

## Replies

### Reply to an Answer
- **POST** `/answers/reply`
- **Auth required**
#### Payload
```json
{
  "answerId": "string",
  "content": "string",
  "userTagged": ["username1", "username2"] // optional
}
```
#### Response
```json
{
  "message": "Reply added successfully",
  "answer": { /* answer object with replies */ }
}
```

---

## Votes

### Vote (Upvote/Downvote)
- **POST** `/votes`
- **Auth required**
#### Payload
```json
{
  "targetType": "question" | "answer" | "reply",
  "targetId": "string",
  "voteType": "up" | "down"
}
```
#### Response
```json
{
  "message": "Vote registered",
  "vote": { /* vote object */ }
}
```

---

## Notifications

### Get Notifications
- **GET** `/notifications`
- **Auth required**
- Returns all notifications for the logged-in user, sorted by newest first.
#### Response
```json
{
  "notifications": [
    {
      "_id": "...",
      "recipient": "username",
      "type": "answer" | "reply",
      "question": "...",
      "answer": "...", // optional
      "fromUser": "otheruser",
      "message": "...",
      "isRead": false,
      "createdAt": "...",
      "updatedAt": "..."
    }
    // ...
  ]
}
```

### Notification Model
- `recipient`: username
- `type`: "answer" | "reply"
- `question`: questionId
- `answer`: answerId (optional)
- `fromUser`: username
- `message`: string
- `isRead`: boolean

### Notification Triggers
- When someone answers your question
- When someone replies to your answer
- When someone tags you in an answer or reply

---

## WebSocket Events

### Register for Notifications
- **Client → Server**
```json
{
  "type": "register",
  "username": "string"
}
```

### Receive Notification
- **Server → Client**
```json
{
  "type": "notification",
  "notification": { /* notification object */ }
}
```

---

## Error Response Example
```json
{
  "success": false,
  "message": "Error message",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "statusCode": 400
}
```

---

## Notes
- All protected routes require a valid JWT in the `Authorization` header: `Bearer <token>`
- All endpoints are versioned under `/api/v1/`
- WebSocket server runs on the same port as the HTTP server 