# 🎓 EduTrack - Advanced Learning Management & Quiz Platform

EduTrack is a comprehensive MERN stack application designed to streamline the educational experience for both teachers and students. It provides a robust platform for creating, managing, and taking quizzes with a modern, responsive user interface and integrated AI features.

## 🚀 Key Features

### For Teachers
- **Quiz Creation:** Build complex quizzes with multiple-choice questions, difficulty levels, and time limits.
- **AI-Powered Generation:** Leverage AI to automatically generate questions based on topics and difficulty.
- **Student Analytics:** Detailed insights into student performance, exportable to CSV.
- **Leaderboards:** Real-time ranking of students across different quiz categories.

### For Students
- **Interactive Quizzes:** Clean, timed quiz interface with immediate feedback.
- **Personal Dashboard:** Track personal progress, view history, and earned badges.
- **Global Leaderboards:** Compare performance with peers.
- **Detailed Results:** Deep dive into correct/incorrect answers for better learning.

### Modern UI/UX
- **Beautiful Design:** Glass-morphism, smooth animations, and a professional aesthetic.
- **Dark Mode Support:** Fully integrated dark mode for late-night study sessions.
- **Responsive Layout:** Works seamlessly across mobile, tablet, and desktop.

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, Lucide Icons, Vanilla CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (via Mongoose) / Supabase (PostgreSQL)
- **Authentication:** JWT (JSON Web Tokens) with Role-Based Access Control
- **AI Integration:** Specialized endpoints for automated content generation

## 📁 Documentation

- [Features List](FEATURES.md) - Full breakdown of all implemented and future features.
- [API Documentation](API_DOCUMENTATION.md) - Detailed API endpoint usage and Postman-style docs.

## ⚙️ Getting Started

### Prerequisites
- Node.js installed
- MongoDB or Supabase account/URL
- JWT Secret

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd edutrack
   ```

2. **Backend Setup:**
   ```bash
   cd server
   npm install
   # Create a .env file from .env.example and add your MONGO_URI and JWT_SECRET
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd ..
   npm install
   npm run dev
   ```

## 📝 License
This project is licensed under the MIT License.

---
Built with ❤️ for better education. online at [EduTrack](https://github.com/chahel1817/EduTrack)
