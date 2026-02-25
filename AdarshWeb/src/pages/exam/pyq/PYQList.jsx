import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { ChevronLeft, CheckCircle } from "lucide-react";
import { API_BASE_URL } from "../../../config/api";
import "./pyqs.css";

export default function PYQList() {
  const navigate = useNavigate();
  const { examName } = useParams();
  const [searchParams] = useSearchParams();

  const subject = searchParams.get("subject");
  const chapter = searchParams.get("chapter");

  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    if (!examName || !subject || !chapter) {
      setLoading(false);
      return;
    }
    loadPYQs();
  }, [examName, subject, chapter]);

  async function loadPYQs() {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/pyqs/${examName}/${subject}/${chapter}`
      );
      const json = await res.json();
      setTitle(json.title);
      setQuestions(json.questions || []);
    } catch {
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }

  function toggleOption(qId, value, multi = false) {
    setAnswers((prev) => {
      if (!multi) return { ...prev, [qId]: value };
      const arr = prev[qId] || [];
      return arr.includes(value)
        ? { ...prev, [qId]: arr.filter((v) => v !== value) }
        : { ...prev, [qId]: [...arr, value] };
    });
  }

  function isCorrect(q) {
    const userAns = answers[q.id];
    if (q.type === "multiple") {
      return (
        Array.isArray(userAns) &&
        Array.isArray(q.answer) &&
        userAns.sort().join() === q.answer.sort().join()
      );
    }
    return userAns === q.answer;
  }

  if (loading) {
    return (
      <div className="pyq-center">
        <p>Loading PYQs...</p>
      </div>
    );
  }

  return (
    <div className="pyq-container">
      {/* Header */}
      <div className="pyq-header">
        <button className="icon-btn" onClick={() => navigate(-1)}>
          <ChevronLeft size={22} />
        </button>
        <h3>{title} – PYQs</h3>
      </div>

      {questions.length === 0 && (
        <div className="pyq-center">
          <p>No PYQs found</p>
        </div>
      )}

      {questions.map((item, index) => {
        const expanded = expandedId === item.id;
        const correct = isCorrect(item);

        return (
          <div className="pyq-card" key={item.id}>
            <div
              className="pyq-question"
              onClick={() =>
                setExpandedId(expanded ? null : item.id)
              }
            >
              <p className="q-text">
                Q{index + 1}. {item.question}
              </p>
              {item.exam && <span className="meta">{item.exam}</span>}
            </div>

            {expanded && (
              <div className="answer-box">
                {/* MCQ */}
                {item.type === "mcq" &&
                  item.options?.map((opt, i) => (
                    <button
                      key={i}
                      className={`option ${
                        answers[item.id] === opt ? "selected" : ""
                      }`}
                      onClick={() => toggleOption(item.id, opt)}
                    >
                      {opt}
                    </button>
                  ))}

                {/* MULTIPLE */}
                {item.type === "multiple" &&
                  item.options?.map((opt, i) => (
                    <button
                      key={i}
                      className={`option ${
                        answers[item.id]?.includes(opt) ? "selected" : ""
                      }`}
                      onClick={() => toggleOption(item.id, opt, true)}
                    >
                      {opt}
                    </button>
                  ))}

                {/* INPUT */}
                {item.type === "input" && (
                  <input
                    className="answer-input"
                    placeholder="Enter your answer"
                    value={answers[item.id] || ""}
                    onChange={(e) =>
                      setAnswers((p) => ({
                        ...p,
                        [item.id]: e.target.value,
                      }))
                    }
                  />
                )}

                {/* RESULT */}
                {answers[item.id] !== undefined && (
                  <div
                    className={`result ${
                      correct ? "correct" : "wrong"
                    }`}
                  >
                    <CheckCircle size={16} />
                    <span>
                      {correct ? "Correct" : `Answer: ${item.answer}`}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}