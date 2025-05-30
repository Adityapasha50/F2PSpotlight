# F2P Spotlight API Documentation

## Base URL
```
https://aditpasha.shop
```

## Authentication
This API uses Bearer Token authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_access_token>
```

## Endpoints

### User Authentication

#### 1. Register User
**POST** `/users/register`

Register a new user account.

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response (Success - 201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "number",
    "username": "string",
    "email": "string"
  }
}
```

**Response (Error - 400):**
```json
{
  "message": "Error message"
}
```

---

#### 2. Login User
**POST** `/users/login`

Authenticate user with email and password.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (Success - 200):**
```json
{
  "access_token": "string",
  "user": {
    "id": "number",
    "username": "string",
    "email": "string",
    "profilePicture": "string"
  }
}
```

**Response (Error - 401):**
```json
{
  "message": "Invalid credentials"
}
```

---

#### 3. Google Login
**POST** `/users/login/google`

Authenticate user with Google ID token.

**Request Body:**
```json
{
  "id_token": "string"
}
```

**Response (Success - 200):**
```json
{
  "access_token": "string",
  "user": {
    "id": "number",
    "username": "string",
    "email": "string",
    "profilePicture": "string"
  }
}
```

**Response (Error - 401):**
```json
{
  "message": "Invalid Google token"
}
```

---

### User Profile

#### 4. Get User Profile
**GET** `/users/profile`

Get current user profile information.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (Success - 200):**
```json
{
  "id": "number",
  "username": "string",
  "email": "string",
  "profilePicture": "string",
  "createdAt": "string",
  "updatedAt": "string"
}
```

**Response (Error - 401):**
```json
{
  "message": "Unauthorized"
}
```

---

#### 5. Update User Profile
**PUT** `/users/profile`

Update current user profile information.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "username": "string",
  "profilePicture": "string"
}
```

**Response (Success - 200):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "number",
    "username": "string",
    "email": "string",
    "profilePicture": "string"
  }
}
```

**Response (Error - 400):**
```json
{
  "message": "Validation error message"
}
```

**Response (Error - 401):**
```json
{
  "message": "Unauthorized"
}
```

---

### Games/Content Endpoints (Jika Ada)

#### 6. Get All Games
**GET** `/games`

Get list of all games/content.

**Query Parameters:**
```
?page=1&limit=10&search=keyword&category=action
```

**Response (Success - 200):**
```json
{
  "games": [
    {
      "id": "number",
      "title": "string",
      "description": "string",
      "imageUrl": "string",
      "category": "string",
      "isFree": "boolean",
      "createdAt": "string"
    }
  ],
  "pagination": {
    "currentPage": "number",
    "totalPages": "number",
    "totalItems": "number"
  }
}
```

#### 7. Get Game by ID
**GET** `/games/:id`

Get specific game details.

**Response (Success - 200):**
```json
{
  "id": "number",
  "title": "string",
  "description": "string",
  "imageUrl": "string",
  "category": "string",
  "isFree": "boolean",
  "reviews": [],
  "createdAt": "string"
}
```

### Favorites/Bookmarks (Jika Ada)

#### 8. Add to Favorites
**POST** `/favorites`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "gameId": "number"
}
```

#### 9. Get User Favorites
**GET** `/favorites`

**Headers:**
```
Authorization: Bearer <access_token>
```

### Additional Sections

## Rate Limiting
```
- 100 requests per minute per IP
- 1000 requests per hour per authenticated user
```

## Data Validation Rules
```
- Email: Must be valid email format
- Password: Minimum 8 characters
- Username: 3-20 characters, alphanumeric only
```

## Environment Variables
```
NODE_ENV=production
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
DATABASE_URL=your_database_url
```