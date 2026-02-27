import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* ---------- Public Pages ---------- */
import GreetingPage from "./pages/greeting/GreetingPage";
import LoginPage from "./pages/loginpage/LoginPage";
import Onboarding from "./pages/chooseBoard/ChooseBoard";
import Profile from "./pages/profile/ProfilePage";


/* ---------- Home Container ---------- */
import HomeContainer from "./pages/homePage/HomeContainer";

/* ---------- Protected Pages ---------- */
import DashBoard from "./pages/dashBoard/DashBoard";
import RankPredictor from "./pages/rankPredictor/RankPredictor";
import FlashCards from "./pages/flashCards/FlashCards";
import TrackExam from "./pages/TrackExam/TrackExam";
import DailyQuiz from "./pages/DailyQuiz/DailyQuiz";
import Roadmap from "./pages/roadmap/Roadmap";

/* ---------- Class Pages ---------- */
import SubjectResources from "./pages/chapter/SubjectResources";
import ChapterPage from "./pages/chapter/ChapterPage";

/* ---------- Exam Module ---------- */
import ExamList from "./pages/exam/ExamList";
import ExamDetail from "./pages/exam/ExamDetail/ExamDetail";
import ExamSyllabus from "./pages/exam/syllabus/ExamSyllabus";
import ChapterDetail from "./pages/exam/chapter/ChapterDetail";
import ChapterTests from "./pages/exam/chapter-tests/ChapterTests";
import TestPage from "./pages/exam/test/TestPage";
import PYQList from "./pages/exam/pyq/PYQList";
import Materials from "./pages/exam/materials/Materials";
import Folder from "./pages/exam/materials/Folder";
import PdfViewer from "./pages/exam/materials/PdfViewer";

/* ---------- PROTECTED ROUTE ---------- */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const board = localStorage.getItem("board");
  const classLevel = localStorage.getItem("classLevel");

  // Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but onboarding not completed
  if (!board || !classLevel) {
    return <Navigate to="/onboarding" replace />;
  }

  // Fully authenticated + onboarded
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ---------- Default ---------- */}
        <Route path="/" element={<Navigate to="/greet" replace />} />

        {/* ---------- Public Routes ---------- */}
        <Route path="/greet" element={<GreetingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/onboarding" element={<Onboarding />} />
         <Route path="/profile" element={<Profile />}/>

        {/* ---------- HOME ---------- */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomeContainer />
            </ProtectedRoute>
          }
        />

        {/* ---------- CORE PROTECTED ROUTES ---------- */}
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

        <Route
          path="/roadmap"
          element={
            <ProtectedRoute>
              <Roadmap />
            </ProtectedRoute>
          }
        />

        {/* ---------- EXAM MODULE ---------- */}
        <Route
          path="/exam"
          element={
            <ProtectedRoute>
              <ExamList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/exam/:examName"
          element={
            <ProtectedRoute>
              <ExamDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/exam/:examName/syllabus"
          element={
            <ProtectedRoute>
              <ExamSyllabus />
            </ProtectedRoute>
          }
        />

        <Route
          path="/exam/:examName/chapter/:chapterId"
          element={
            <ProtectedRoute>
              <ChapterDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/exam/:examName/chapter-tests"
          element={
            <ProtectedRoute>
              <ChapterTests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/exam/:examName/test/:subject/:testId"
          element={
            <ProtectedRoute>
              <TestPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/exam/:examName/pyqs"
          element={
            <ProtectedRoute>
              <PYQList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/exam/:examName/materials"
          element={
            <ProtectedRoute>
              <Materials />
            </ProtectedRoute>
          }
        />

        <Route
          path="/exam/:examName/folder"
          element={
            <ProtectedRoute>
              <Folder />
            </ProtectedRoute>
          }
        />

        <Route
          path="/exam/:examName/pdf"
          element={
            <ProtectedRoute>
              <PdfViewer />
            </ProtectedRoute>
          }
        />

        {/* ---------- CLASS / SYLLABUS ---------- */}
        <Route
          path="/chapter/:classLevel/:board/:subject"
          element={
            <ProtectedRoute>
              <SubjectResources />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chapter/:classLevel/:board/:subject/:chapterId"
          element={
            <ProtectedRoute>
              <ChapterPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;