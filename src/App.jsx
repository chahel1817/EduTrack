import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

/* Pages */
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CreateQuiz from "./pages/CreateQuiz";
import TakeQuiz from "./pages/TakeQuiz";
import Quizzes from "./pages/Quizzes";
import Contact from "./pages/Contact";
import Feedback from "./pages/Feedback";
import Help from "./pages/Help";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import QuizResults from "./pages/QuizResults";
import QuizResultsList from "./pages/QuizResultsList";
import StudentResults from "./pages/StudentResults";
import MyResults from "./pages/MyResults";
import StudentProfile from "./pages/StudentProfile";
import FAQs from "./pages/FAQs"; // ✅ FAQ IMPORT
import ScrollToTop from "./components/ScrollToTop";
import "./index.css";
import VerifyOTP from "./pages/VerifyOTP";
import ForgotPassword from "./pages/ForgotPassword";
import CreateQuizQuestions from "./pages/CreateQuizQuestions";
import QuizSuccess from "./pages/QuizSuccess";
import Documentation from "./pages/Documentation";
import Tutorials from "./pages/Tutorials";
import Leaderboard from "./pages/Leaderboard";

import "./App.css";


/* --------------------------------------------------
   Protected Route Wrapper (ONLY for core features)
-------------------------------------------------- */
function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ textAlign: "center", marginTop: "4rem" }}>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

/* --------------------------------------------------
   App
-------------------------------------------------- */
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />

        <Routes>

          {/* ---------- PUBLIC ---------- */}
          <Route path="/login" element={<Login />} />
<Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/verify-otp" element={<VerifyOTP />} />

          <Route path="/signup" element={<Signup />} />


          {/* ---------- PUBLIC INFO PAGES ---------- */}
          <Route path="/contact" element={<Contact />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/help" element={<Help />} />
          <Route path="/faqs" element={<FAQs />} /> {/* ✅ FAQ ROUTE ADDED */}
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />

          <Route path="/docs" element={<Documentation />} />
<Route path="/tutorials" element={<Tutorials />} />


          {/* ---------- PROTECTED (COMMON) ---------- */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <StudentProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/quizzes"
            element={
              <ProtectedRoute>
                <Quizzes />
              </ProtectedRoute>
            }
          />

          <Route
            path="/quiz/:id"
            element={
              <ProtectedRoute>
                <TakeQuiz />
              </ProtectedRoute>
            }
          />

          {/* ---------- STUDENT ONLY ---------- */}
          <Route
            path="/my-results"
            element={
              <ProtectedRoute roles={["student"]}>
                <MyResults />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-results/:id"
            element={
              <ProtectedRoute roles={["student"]}>
                <StudentResults />
              </ProtectedRoute>
            }
          />

          {/* ---------- TEACHER ONLY ---------- */}
         {/* ---------- TEACHER ONLY ---------- */}
<Route
  path="/create-quiz"
  element={
    <ProtectedRoute roles={["teacher"]}>
      <CreateQuiz />
    </ProtectedRoute>
  }
/>

<Route
  path="/create/quiz/questions"
  element={
    <ProtectedRoute roles={["teacher"]}>
      <CreateQuizQuestions />
    </ProtectedRoute>
  }
/>

<Route
  path="/quiz-success"
  element={
    <ProtectedRoute roles={["teacher"]}>
      <QuizSuccess />
    </ProtectedRoute>
  }
/>


         

          <Route
            path="/results"
            element={
              <ProtectedRoute roles={["teacher"]}>
                <QuizResultsList />
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
          <Route path="*" element={<Navigate to="/dashboard" replace />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}
