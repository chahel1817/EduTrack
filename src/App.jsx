import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CreateQuiz from "./pages/CreateQuiz";
import TakeQuiz from "./pages/TakeQuiz";
import Quizzes from "./pages/Quizzes";
import Contact from "./pages/Contact";
import Help from "./pages/Help";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import QuizResults from "./pages/QuizResults";
import QuizResultsList from "./pages/QuizResultsList";
import StudentResults from "./pages/StudentResults";
import StudentProfile from "./pages/StudentProfile";
import Leaderboard from "./pages/Leaderboard";

import "./App.css";

/* --------------------------------------------------
   Protected Route Component
-------------------------------------------------- */
function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();

  // Global App Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
        Loading...
      </div>
    );
  }

  // User not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role-based access
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

/* --------------------------------------------------
   Main App Component
-------------------------------------------------- */
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Dashboard (student + teacher) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* PROFILE (all users) */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <StudentProfile />
              </ProtectedRoute>
            }
          />

          {/* Teacher-only */}
          <Route
            path="/create-quiz"
            element={
              <ProtectedRoute roles={["teacher"]}>
                <CreateQuiz />
              </ProtectedRoute>
            }
          />

          <Route
            path="/results/:id"
            element={
              <ProtectedRoute roles={["teacher"]}>
                <QuizResults />
              </ProtectedRoute>
            }
          />

          {/* Student-only */}
          <Route
            path="/my-results/:id"
            element={
              <ProtectedRoute roles={["student"]}>
                <StudentResults />
              </ProtectedRoute>
            }
          />

          {/* Shared Route (student + teacher) */}
          <Route
            path="/quiz/:id"
            element={
              <ProtectedRoute>
                <TakeQuiz />
              </ProtectedRoute>
            }
          />

          {/* Quizzes Page */}
          <Route
            path="/quizzes"
            element={
              <ProtectedRoute>
                <Quizzes />
              </ProtectedRoute>
            }
          />

          {/* Help Page */}
          <Route
            path="/help"
            element={
              <ProtectedRoute>
                <Help />
              </ProtectedRoute>
            }
          />

          {/* Contact Page */}
          <Route
            path="/contact"
            element={
              <ProtectedRoute>
                <Contact />
              </ProtectedRoute>
            }
          />

          {/* About Page */}
          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <About />
              </ProtectedRoute>
            }
          />

          {/* Privacy Page */}
          <Route
            path="/privacy"
            element={
              <ProtectedRoute>
                <Privacy />
              </ProtectedRoute>
            }
          />

          {/* Teacher Results Page - List all quizzes with results */}
          <Route
            path="/results"
            element={
              <ProtectedRoute roles={["teacher"]}>
                <QuizResultsList />
              </ProtectedRoute>
            }
          />

          {/* Leaderboard Page */}
          <Route
            path="/leaderboard/:quizId"
            element={
              <ProtectedRoute>
                <Leaderboard />
              </ProtectedRoute>
            }
          />

          {/* Redirects */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
