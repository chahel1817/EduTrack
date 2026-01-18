# EduTrack API Documentation

This document provides details for the API endpoints available in the EduTrack platform.

## Authentication

### Login as Teacher
*   **Endpoint:** `/api/auth/login`
*   **Method:** `POST`
*   **Description:** Authenticates a user and returns a JWT token.
*   **Headers:**
    *   `Content-Type: application/json`
*   **Body (JSON):**
    ```json
    {
      "email": "teacher@example.com",
      "password": "password123"
    }
    ```
*   **Response (200 OK):** Returns a token to be used for subsequent requests.

---

## Quiz Management

### Create Quiz
*   **Endpoint:** `/api/quiz`
*   **Method:** `POST`
*   **Description:** Creates a new quiz.
*   **Headers:**
    *   `Content-Type: application/json`
    *   `Authorization: Bearer {{token}}`
*   **Body (JSON):**
    ```json
    {
      "title": "Sample Quiz",
      "subject": "Mathematics",
      "description": "A basic math quiz",
      "questions": [
        {
          "question": "What is 2 + 2?",
          "options": ["3", "4", "5", "6"],
          "correctAnswer": 1
        },
        {
          "question": "What is 5 * 3?",
          "options": ["15", "12", "18", "20"],
          "correctAnswer": 0
        }
      ]
    }
    ```

### Get All Quizzes
*   **Endpoint:** `/api/quiz`
*   **Method:** `GET`
*   **Description:** Retrieves a list of all available quizzes.
*   **Headers:**
    *   `Authorization: Bearer {{token}}`

---

## AI Features

### Generate Quiz with AI
*   **Endpoint:** `/api/ai/generate-quiz`
*   **Method:** `POST`
*   **Description:** Generates a quiz using AI based on a topic and difficulty.
*   **Headers:**
    *   `Content-Type: application/json`
    *   `Authorization: Bearer {{token}}`
*   **Body (JSON):**
    ```json
    {
      "topic": "Mathematics",
      "difficulty": "Easy",
      "totalQuestions": 5
    }
    ```

---

## Variables
*   `token`: The JWT token received from the login endpoint.
