# Feedback System Implementation TODO

- [x] Create server/models/Feedback.js: Define schema with name, email, subject, message, timestamps; specify collection name as 'feedback'.
- [x] Create server/controllers/feedbackController.js: Add submitFeedback function to save feedback to DB.
- [x] Create server/routes/feedbackRoutes.js: Add POST /api/feedback route.
- [x] Edit server/index.js: Import and use feedbackRoutes.
- [x] Edit src/pages/Feedback.jsx: Add form handling with React state, axios POST to /api/feedback, display success message with checkmark icon on success.
