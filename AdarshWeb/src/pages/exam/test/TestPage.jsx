import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Clock, Trophy, AlertCircle } from "lucide-react";
import { API_BASE_URL } from "../../../config/api";
import "./test.css";

export default function TestPage() {
  const navigate = useNavigate();
  const { examName, subject, testId } = useParams();

  const [test, setTest] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  /* ---------- FORMAT TIMER (HH:MM:SS) ---------- */
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const parts = [];
    if (hrs > 0) parts.push(hrs.toString().padStart(2, "0"));
    parts.push(mins.toString().padStart(2, "0"));
    parts.push(secs.toString().padStart(2, "0"));

    return parts.join(":");
  };

  /* ---------- LOAD TEST ---------- */
  useEffect(() => {
    if (!examName || !subject || !testId) return;
    const loadTest = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/tests/${examName}/${subject}/${testId}`);
        if (!res.ok) throw new Error();
        const json = await res.json();
        setTest(json);
        setTimeLeft((json.duration || 0) * 60);
      } catch {
        alert("Failed to load test");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    loadTest();
  }, [examName, subject, testId, navigate]);

  /* ---------- TIMER LOGIC ---------- */
  useEffect(() => {
    if (!test || submitted) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          submitTest();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [test, submitted]);

  /* ---------- SAVE TO DATABASE ---------- */
  const saveResult = async (finalScore) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await fetch(`${API_BASE_URL}/api/results`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          examName,
          subject,
          chapterId: test.chapterId || testId,
          testType: "chapter-test",
          score: finalScore,
          totalMarks: test.questions.length,
          accuracy: Math.round((finalScore / test.questions.length) * 100),
          timeTaken: (test.duration * 60) - timeLeft,
        }),
      });
    } catch (err) {
      console.error("Result save failed", err);
    }
  };

  /* ---------- SUBMIT TEST ---------- */
  const submitTest = () => {
    let sc = 0;
    test.questions.forEach((q, i) => {
      if (answers[i] === q.answer) sc++;
    });

    setScore(sc);
    setSubmitted(true);
    saveResult(sc);
  };

  if (loading) {
    return (
      <div className="loader-screen">
        <div className="spinner"></div>
        <p>Preparing your workspace...</p>
      </div>
    );
  }

  if (submitted) {
    const percent = Math.round((score / test.questions.length) * 100);
    return (
      <div className="result-container">
        <div className="result-card">
          <div className="trophy-wrapper">
            <Trophy size={60} className="trophy-icon" />
          </div>
          <h2>{percent >= 80 ? "Outstanding!" : "Good Effort!"}</h2>
          <div className="score-badge">
            <span className="score-text">{score} / {test.questions.length}</span>
            <span className="percent-text">{percent}% Score</span>
          </div>
          <p className="motivational-text">
            {percent >= 80 ? "You've mastered this chapter." : "A bit more practice and you'll be there!"}
          </p>
          <button className="finish-btn" onClick={() => navigate(-1)}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = test.questions[current];
  const progressPercent = ((current + 1) / test.questions.length) * 100;
  const isUrgent = timeLeft < 300; // Less than 5 mins

  return (
    <div className="test-layout">
      {/* GLASSMORPHISM HEADER */}
      <header className="test-header">
        <div className="header-left">
          <button className="back-circle" onClick={() => navigate(-1)}>
            <ChevronLeft size={20} />
          </button>
          <div className="test-meta">
            <span className="exam-label">{examName}</span>
            <h1 className="subject-label">{subject}</h1>
          </div>
        </div>

        <div className={`timer-box ${isUrgent ? "urgent" : ""}`}>
          <Clock size={16} />
          <span className="time-string">{formatTime(timeLeft)}</span>
        </div>

        <button className="end-session-btn" onClick={submitTest}>
          Finish
        </button>
      </header>

      {/* SLEEK PROGRESS BAR */}
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
      </div>

      <main className="question-area">
        <div className="question-card">
          <div className="q-header">
            <span className="q-count">Question {current + 1} of {test.questions.length}</span>
          </div>
          
          <h2 className="question-text">{currentQuestion.question}</h2>

          <div className="options-grid">
            {currentQuestion.options?.map((opt, i) => (
              <button
                key={i}
                className={`option-tile ${answers[current] === opt ? "active" : ""}`}
                onClick={() => setAnswers((prev) => ({ ...prev, [current]: opt }))}
              >
                <div className="option-indicator">{String.fromCharCode(65 + i)}</div>
                <span className="option-content">{opt}</span>
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* NAVIGATION FOOTER */}
      <footer className="test-footer">
        <div className="footer-inner">
          <button 
            className="nav-btn secondary" 
            disabled={current === 0} 
            onClick={() => setCurrent((p) => p - 1)}
          >
            Previous
          </button>

          <button 
            className="nav-btn primary" 
            onClick={() => current === test.questions.length - 1 ? submitTest() : setCurrent((p) => p + 1)}
          >
            {current === test.questions.length - 1 ? "Submit Exam" : "Save & Next"}
          </button>
        </div>
      </footer>
    </div>
  );
}