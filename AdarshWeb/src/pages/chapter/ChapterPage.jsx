import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./chapterPage.css";
import { CheckCircle, ChevronLeft } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function ChapterPage() {
  const navigate = useNavigate();
  const { classLevel, board, subject, chapterId } = useParams();

  const [chapter, setChapter] = useState(null);
  const [content, setContent] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [activeTab, setActiveTab] = useState("notes");
  const [loading, setLoading] = useState(true);

  const normalizedBoard = board.toLowerCase();

  useEffect(() => {
    loadChapter();
    // eslint-disable-next-line
  }, []);

  async function loadChapter() {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      /* 1️⃣ Load syllabus */
      const syllabusRes = await fetch(
        `${API_BASE_URL}/api/syllabus/${classLevel}/${normalizedBoard}/${subject}`,
        { headers }
      );

      const syllabus = await syllabusRes.json();
      const foundChapter = syllabus.chapters.find(
        (c) => String(c.id) === String(chapterId)
      );

      if (!foundChapter) {
        alert("Chapter not found");
        navigate(-1);
        return;
      }

      setChapter(foundChapter);

      /* 2️⃣ Load chapter content */
      const contentRes = await fetch(
        `${API_BASE_URL}/api/chapter/${classLevel}/${normalizedBoard}/${subject}/${foundChapter.file}`,
        { headers }
      );

      const contentData = await contentRes.json();
      setContent(contentData);

      /* 3️⃣ Load progress */
      if (token) {
        const progressRes = await fetch(`${API_BASE_URL}/api/progress`, {
          headers,
        });

        if (progressRes.ok) {
          const progressData = await progressRes.json();
          const subjectProgress = progressData.progress?.find(
            (p) => p.subject === subject
          );

          setCompleted(
            subjectProgress?.completedChapters?.includes(String(chapterId)) ||
              false
          );
        }
      }
    } catch (err) {
      console.error(err);
      alert("Failed to load chapter");
    } finally {
      setLoading(false);
    }
  }

  async function toggleCompleted() {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Login required to track progress");
      return;
    }

    const url = completed
      ? `${API_BASE_URL}/api/progress/uncomplete`
      : `${API_BASE_URL}/api/progress/complete`;

    await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subject,
        chapterId,
        classLevel,
        board: normalizedBoard,
      }),
    });

    setCompleted(!completed);
  }

  /* ---------- LOADER ---------- */
  if (loading) {
    return (
      <div className="cp-center">
        <div className="loader" />
      </div>
    );
  }

  if (!chapter || !content) {
    return (
      <div className="cp-center">
        <p>Chapter not found</p>
      </div>
    );
  }

  return (
    <div className="cp-container">
      {/* HEADER */}
      <div className="cp-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ChevronLeft />
        </button>
        <span>
          {subject.toUpperCase()} • Class {classLevel}
        </span>
      </div>

      {/* TITLE */}
      <div className="cp-title">
        <h1>{chapter.title}</h1>
        <p>Unit {chapter.unit}</p>
      </div>

      {/* TABS */}
      <div className="tabs">
        {["notes", "mcqs", "pyqs", "theory"].map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "tab active" : "tab"}
            onClick={() => setActiveTab(tab)}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div className="content">
        {activeTab === "notes" &&
          content.notes?.map((n, i) => (
            <div className="block" key={i}>
              <h4>{n.heading}</h4>
              <p>{n.content}</p>
            </div>
          ))}

        {activeTab === "mcqs" &&
          content.mcqs?.map((m, i) => (
            <div className="block" key={i}>
              <strong>
                Q{i + 1}. {m.question}
              </strong>
              {m.options.map((o, j) => (
                <p key={j}>• {o}</p>
              ))}
              <span className="answer">Answer: {m.answer}</span>
            </div>
          ))}

        {activeTab === "pyqs" &&
          content.pyqs?.map((p, i) => (
            <div className="block" key={i}>
              <strong>{p.question}</strong>
              {p.options?.map((o, j) => (
                <p key={j}>• {o}</p>
              ))}
              {p.answer && <span className="answer">Answer: {p.answer}</span>}
            </div>
          ))}

        {activeTab === "theory" &&
          content.theoryQuestions?.map((t, i) => (
            <div className="block" key={i}>
              <strong>{t.question}</strong>
              <p>{t.answer}</p>
            </div>
          ))}
      </div>

      {/* COMPLETE BUTTON */}
      <div className="footer">
        <button
          className={completed ? "complete-btn done" : "complete-btn"}
          onClick={toggleCompleted}
        >
          <CheckCircle size={18} />
          {completed ? "Completed" : "Mark as Completed"}
        </button>
      </div>
    </div>
  );
}