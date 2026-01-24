# 🎓 EduTrack API Master Documentation

**EduTrack** is a high-performance, MERN-stack Learning Management Ecosystem designed to modernize assessment and technical interviewing. This API collection provides the complete backend interface for managing the entire educational lifecycle—from secure authentication and AI-powered content generation to real-time student analytics.

This document serves as the comprehensive reference for developers, testers, and integrators working with the EduTrack platform.

---

## ⚡ Quick Summary
- **Base URL**: `http://localhost:5000/api`
- **Authentication**: Bearer Token (JWT)
- **Roles**: `Student`, `Teacher`
- **Data Format**: JSON
- **AI Engine**: OpenRouter / HuggingFace Integration

---

## 🛠 Core Capabilities

### 1. Enterprise-Grade Authentication 🔐
Security is the foundation of EduTrack. We utilize industry-standard practices to ensure data integrity and user safety.
- **JWT (JSON Web Tokens)**: Stateless authentication mechanism.
- **Bcrypt Hashing**: All passwords are salt-hashed before storage.
- **Strict Validation**: Passwords must meet specific complexity requirements:
  - Minimum **8 characters**
  - At least one **Uppercase** letter
  - At least one **Special Character** (e.g., `!@#$%`)
- **Role-Based Access Control (RBAC)**: Middleware strictly enforces permissions. Students cannot access Teacher routes, and vice-versa.

### 2. The Teacher Workspace (Creator Mode) 👩‍🏫
A suite of tools designed to reduce workload and enhance assessment quality.
- **AI Quiz Generation**: Teachers can generate full multi-choice quizzes simply by specifying a *Topic* and *Difficulty*.
- **PDF-to-Quiz**: Upload course material (PDF), and our parser extracts key concepts to build questions automatically.
- **Manual Builder**: Fine-grained control for creating custom assessments with specific point values and time limits.
- **Classroom Insights**: Teachers can view all results for their quizzes to identify learning gaps.

### 3. The Student Hub (Learner Mode) 👨‍🎓
A focused environment for performance and growth.
- **Real-Time Submission**: Answers are graded instantly upon submission.
- **Deep Analytics**: Students receive immediate breakdowns of their performance, including accuracy by category and time management.
- **History & Review**: Access to all past submissions for revision.

### 4. Artificial Intelligence Engine 🧠
EduTrack integrates with LLMs (Large Language Models) to provide smart features:
- **Generation**: Creates context-aware questions.
- **Explanation**: The "AI Tutor" feature explains *why* an answer was incorrect (`/api/ai/explain`).

---

## 🚀 Postman Automation & Workflow

This collection is fully optimized for **Rapid Development**. You do not need to manually copy-paste tokens or IDs.

### 🔄 Auto-Authentication
Every time you run the **Login** request, a post-request script automatically captures the `token` and `user_id` from the response and saves them to your **Postman Environment**.

```javascript
// Example Postman Script utilized in the collection
var jsonData = pm.response.json();
if (jsonData.token) {
    pm.environment.set("token", jsonData.token);
    pm.environment.set("user_id", jsonData.user.id);
    console.log("✅ Token automatically updated");
}
```

### 🔗 Dynamic Chaining
When a defined workflow is followed (e.g., Teacher creates a quiz), the system captures the new `Quiz ID` and stores it as `{{active_quiz_id}}`.
- Providing the **Student** workflows instant access to the "Submit Result" endpoint without manual ID entry.

---

## 🌍 Environment Variables

Ensure your Postman Environment is configured with these variables:

| Variable | Description | Source |
| :--- | :--- | :--- |
| `base_url` | The root URL of the server (e.g., `http://localhost:5000/api`) | **Manual** |
| `token` | The active JWT session token used for `Authorization: Bearer {{token}}` | **Auto (Login)** |
| `user_id` | The MongoDB `_id` of the currently logged-in user | **Auto (Login)** |
| `active_quiz_id` | The ID of the most recently created or viewed quiz | **Auto (Create Quiz)** |

---

## 📡 API Endpoint Reference

### 🟠 Authentication Module
*Base endpoint: `/auth`*

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/signup` | Register a new user (Student/Teacher). **Note:** Requires strong password. | ❌ No |
| `POST` | `/login` | Authenticate and receive JWT. **Auto-updates environment.** | ❌ No |
| `GET` | `/me` | Get current user profile details. | ✅ Yes |
| `POST` | `/forgot-password` | Initiate password reset flow (Email OTP). | ❌ No |
| `POST` | `/verify-otp` | Verify the OTP sent to email. | ❌ No |

### 🟣 Quiz Management Module
*Base endpoint: `/quizzes`*

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Fetch all available quizzes (Student view). | ✅ Yes |
| `POST` | `/` | Create a new quiz (Teacher only). **Auto-saves ID.** | ✅ Yes (Teacher) |
| `GET` | `/:id` | Get details for a specific quiz. | ✅ Yes |
| `PUT` | `/:id` | Update an existing quiz. | ✅ Yes (Owner) |
| `DELETE` | `/:id` | Delete a quiz and its results. | ✅ Yes (Owner) |
| `GET` | `/teacher/my-quizzes` | Get all quizzes created by the current teacher. | ✅ Yes (Teacher) |

### � Results & Analytics Module
*Base endpoint: `/results`*

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/` | Submit a quiz attempt. Requires `quiz` ID and `answers` array. | ✅ Yes (Student) |
| `GET` | `/analytics` | Get skill breakdown and performance trends. | ✅ Yes |
| `GET` | `/student` | Get history of all quizzes taken by current student. | ✅ Yes |
| `GET` | `/all` | Get all results for quizzes created by the teacher. | ✅ Yes (Teacher) |

### 🟢 AI Services Module
*Base endpoint: `/ai`*

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/generate-quiz` | Generates questions based on `topic` and `difficulty`. | ✅ Yes |
| `POST` | `/generate-from-pdf` | Upload a PDF file to generate questions from its text. | ✅ Yes |
| `POST` | `/explain` | Ask AI to explain why an answer is correct/incorrect. | ✅ Yes |

### 🟡 Feedback Module
*Base endpoint: `/feedback`*

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/` | Submit general platform feedback. | ❌ No |

---

## 🚫 Error Code Reference

| Status Code | Meaning | Common Cause |
| :--- | :--- | :--- |
| **200 OK** | Success | Request completed successfully. |
| **201 Created** | Created | Resource (User/Quiz/Result) successfully created. |
| **400 Bad Request** | Validation Error | Missing fields, weak password, or invalid ID format. |
| **401 Unauthorized** | Auth Failure | Missing or expired Token. Run **Login** again. |
| **403 Forbidden** | Access Denied | Student trying to act as Teacher (or vice versa). Check your `role`. |
| **404 Not Found** | Missing Resource | The Quiz ID or User ID provided does not exist. |
| **500 Server Error** | System Failure | Database connection issue or internal bug. Check server logs. |

---

## 🎓 Recommended Testing Workflow

To fully test the capabilities of EduTrack, follow this "Happy Path":

1.  **Teacher Setup**:
    *   Register a Teacher (`POST /auth/signup`).
    *   Login to get the token (`POST /auth/login`).
    *   Create a Quiz using AI (`POST /ai/generate-quiz` -> save content -> `POST /quizzes`).

2.  **Student Action**:
    *   Register a Student.
    *   Login (Token updates automatically).
    *   Fetch available quizzes (`GET /quizzes`).
    *   Submit a result (`POST /results`) using the ID from step 1.

3.  **Review**:
    *   Check Student Analytics (`GET /results/analytics`).
    *   Login as Teacher again.
    *   Check Class Results (`GET /results/all`).

---
*Built with ❤️ for the EduTrack Developer Community.*
