import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Clock, Trophy } from "lucide-react";
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

  /* ---------- LOAD TEST ---------- */
  useEffect(() => {
    if (!examName || !subject || !testId) return;
    loadTest();
  }, [examName, subject, testId]);

  async function loadTest() {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/tests/${examName}/${subject}/${testId}`
      );
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
  }

  /* ---------- TIMER ---------- */
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

  /* ---------- SAVE RESULT ---------- */
  async function saveResult(finalScore) {
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
          accuracy: Math.round(
            (finalScore / test.questions.length) * 100
          ),
          timeTaken: test.duration * 60 - timeLeft,
        }),
      });
    } catch {
      console.log("Result save failed");
    }
  }

  /* ---------- SUBMIT TEST ---------- */
  function submitTest() {
    let sc = 0;
    test.questions.forEach((q, i) => {
      if (answers[i] === q.answer) sc++;
    });

    setScore(sc);
    setSubmitted(true);
    saveResult(sc);
  }

  /* ---------- LOADING ---------- */
  if (loading) {
    return (
      <div className="center">
        <p>Setting up your exam...</p>
      </div>
    );
  }

  /* ---------- RESULT ---------- */
  if (submitted) {
    const percent = Math.round(
      (score / test.questions.length) * 100
    );

    return (
      <div className="center padded">
        <div className="result-icon">
          <Trophy size={50} color="#4F46E5" />
        </div>

        <h2>{percent >= 80 ? "Excellent Work!" : "Keep Practicing!"}</h2>
        <p className="sub-text">
          You scored {score}/{test.questions.length}
        </p>

        <button className="done-btn" onClick={() => navigate(-1)}>
          Finish Review
        </button>
      </div>
    );
  }

  /* ---------- QUESTION VIEW ---------- */
  const q = test.questions[current];
  const progress = ((current + 1) / test.questions.length) * 100;
  const min = Math.floor(timeLeft / 60);
  const sec = timeLeft % 60;

  return (
    <div className="test-container">
      {/* HEADER */}
      <div className="header">
        <button className="icon-btn" onClick={() => navigate(-1)}>
          <ChevronLeft size={22} />
        </button>

        <div className="timer">
          <Clock size={16} />
          <span>
            {min}:{sec.toString().padStart(2, "0")}
          </span>
        </div>

        <button className="exit-btn" onClick={submitTest}>
          End Test
        </button>
      </div>

      {/* PROGRESS */}
      <div className="progress-track">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>

      {/* CONTENT */}
      <div className="content">
        <p className="q-index">
          QUESTION {current + 1} OF {test.questions.length}
        </p>
        <h3>{q.question}</h3>

        {q.options?.map((opt, i) => (
          <button
            key={i}
            className={`option ${
              answers[current] === opt ? "selected" : ""
            }`}
            onClick={() =>
              setAnswers((p) => ({ ...p, [current]: opt }))
            }
          >
            {opt}
          </button>
        ))}
      </div>

      {/* FOOTER */}
      <div className="footer">
        <button
          disabled={current === 0}
          onClick={() => setCurrent((p) => p - 1)}
        >
          Previous
        </button>

        <button
          className="primary"
          onClick={() =>
            current === test.questions.length - 1
              ? submitTest()
              : setCurrent((p) => p + 1)
          }
        >
          {current === test.questions.length - 1
            ? "Submit Exam"
            : "Save & Next"}
        </button>
      </div>
    </div>
  );
}