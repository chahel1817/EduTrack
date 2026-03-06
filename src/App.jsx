import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";

/* Pages */
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CreateQuiz = lazy(() => import("./pages/CreateQuiz"));
const TakeQuiz = lazy(() => import("./pages/TakeQuiz"));
const Quizzes = lazy(() => import("./pages/Quizzes"));
const Contact = lazy(() => import("./pages/Contact"));
const Feedback = lazy(() => import("./pages/Feedback"));
const Help = lazy(() => import("./pages/Help"));
const About = lazy(() => import("./pages/About"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const QuizResults = lazy(() => import("./pages/QuizResults"));
const QuizResultsList = lazy(() => import("./pages/QuizResultsList"));
const StudentResults = lazy(() => import("./pages/StudentResults"));
const MyResults = lazy(() => import("./pages/MyResults"));
const Analytics = lazy(() => import("./pages/Analytics"));
const StudentProfile = lazy(() => import("./pages/StudentProfile"));
const FAQs = lazy(() => import("./pages/FAQs"));
const VerifyOTP = lazy(() => import("./pages/VerifyOTP"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const CreateQuizQuestions = lazy(() => import("./pages/CreateQuizQuestions"));
const QuizSuccess = lazy(() => import("./pages/QuizSuccess"));
const Documentation = lazy(() => import("./pages/Documentation"));
const Tutorials = lazy(() => import("./pages/Tutorials"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));

import ScrollToTop from "./components/ScrollToTop";
import "./index.css";
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
  const routeFallback = (
    <div style={{ textAlign: "center", marginTop: "4rem" }}>Loading...</div>
  );

  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <ScrollToTop />

          <Suspense fallback={routeFallback}>
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
              <Route path="/faqs" element={<FAQs />} />
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
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
                path="/analytics"
                element={
                  <ProtectedRoute roles={["student"]}>
                    <Analytics />
                  </ProtectedRoute>
                }
              />

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

              {/* Quizzes Page */}
              <Route
                path="/quizzes"
                element={
                  <ProtectedRoute>
                    <Quizzes />
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
          </Suspense>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}
