import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import GreetingPage from "./pages/greeting/GreetingPage";
import LoginPage from "./pages/loginpage/LoginPage";
import HomePage from "./pages/homePage/HomePage";
import Onboarding from "./pages/chooseBoard/ChooseBoard";
import DashBoard from "./pages/dashBoard/DashBoard";
import Home2 from "./pages/home2/Home2";
import RankPredictor from "./pages/rankPredictor/RankPredictor";
import FlashCards from "./pages/flashCards/FlashCards";
import TrackExam from "./pages/TrackExam/TrackExam";
import DailyQuiz from "./pages/DailyQuiz/DailyQuiz";

/* ---------- Protected Route ---------- */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default */}
        <Route path="/" element={<Navigate to="/greet" replace />} />

        {/* Public Routes */}
        <Route path="/greet" element={<GreetingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Onboarding */}
        <Route path="/onboarding" element={<Onboarding />} />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/homebase"
          element={
            <ProtectedRoute>
              <Home2 />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashBoard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/rank-predictor"
          element={
            <ProtectedRoute>
              <RankPredictor />
            </ProtectedRoute>
          }
        />

        <Route
          path="/flashcards"
          element={
            <ProtectedRoute>
              <FlashCards />
            </ProtectedRoute>
          }
        />

        <Route
          path="/track-exam"
          element={
            <ProtectedRoute>
              <TrackExam />
            </ProtectedRoute>
          }
        />

        <Route
          path="/daily-quiz"
          element={
            <ProtectedRoute>
              <DailyQuiz />
            </ProtectedRoute>
          }
        />
        
        
      </Routes>
      
    </BrowserRouter>

    
  );
}

export default App;
