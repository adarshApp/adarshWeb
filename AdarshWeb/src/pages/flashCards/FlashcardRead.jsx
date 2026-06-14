import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldAlert, Clock, BookOpen } from "lucide-react";
import "./FlashcardRead.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://abarsh-backend.onrender.com";

export default function FlashcardRead() {
  const navigate = useNavigate();
  const location = useLocation();

  // Safe routing parameters interception with dynamic fallbacks
  const { topicSlug, classLevel, board, subject } = location.state || {
    topicSlug: "human-eye-and-colorful-world",
    classLevel: "class-10",
    board: "BSE", // Support for Board of Secondary Education Odisha
    subject: "physics",
  };

  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (topicSlug) {
      loadFlashcard();
    } else {
      setLoading(false);
    }
  }, [topicSlug]);

  async function loadFlashcard() {
    try {
      setLoading(true);

      const cleanClass = classLevel ? classLevel.toLowerCase() : "class-10";
      const cleanBoard = board ? board.toUpperCase() : "CBSE";
      const cleanSubject = subject ? subject.toLowerCase() : "physics";

      const url = `${API_BASE_URL}/api/content/${cleanClass}/${cleanBoard}/${cleanSubject}/flashcard/${topicSlug}`;
      console.log("Vault Engine Sync Streaming from URL:", url);

      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();

      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        setChapter(data.data[0]);
      } else if (data && data.theory) {
        setChapter(data);
      } else {
        throw new Error("No flashcard data found");
      }


    } catch (err) {
      console.error("Backend content stream link refused:", err);
      setChapter(null);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="read-loader">
        <div className="loader" />
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="read-loader">
        <h2 className="error-title-banner">No Flashcard Content Found</h2>
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flashcard-read-layout">
      <div className="flashcard-read-container">
        {/* INTERACTION LINK BACK BUTTON ROW */}
        <header className="flashcard-read-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} strokeWidth={3} />
            <span>GO BACK</span>
          </button>
          <div className="read-info-pill">
            <span>STUDY VAULT ACTIVE</span>
          </div>
        </header>

        {/* INTEGRATED CARD CONTAINER */}
        <div className="tactics-brutalist-card">
          <div className="card-scroll-body">
            {/* Title Section */}
            <h1 className="flashcard-title">
              <span className="card-icon">{chapter.icon || "👁️"}</span>{" "}
              {chapter.title}
            </h1>

            {/* Meta Parameters Row */}
            <div className="meta-row">
              <div className="meta-pill">
                <ShieldAlert size={14} />
                <span>
                  {String(chapter.difficulty || "MEDIUM").toUpperCase()}
                </span>
              </div>
              <div className="meta-pill">
                <Clock size={14} />
                <span>
                  {String(chapter.estTime || "20 MINS").toUpperCase()}
                </span>
              </div>
            </div>

            {/* General Description Context */}
            <p className="flashcard-description">{chapter.description}</p>
            <div className="flat-card-divider" />

            {/* Dynamic Theory Sequential Layout Token Processor */}
            <div className="theory-container">
              {chapter.theory?.map((item, index) => {
                if (item.type === "highlight") {
                  return (
                    <div
                      key={index}
                      className="highlight-card"
                      style={{
                        borderLeft: `6px solid ${item.color || "#f59e0b"}`,
                      }}
                    >
                      <h4>{item.text}</h4>
                    </div>
                  );
                }

                if (item.type === "formula") {
                  return (
                    <div
                      key={index}
                      className="formula-card"
                      style={{ color: item.color || "#2563eb" }}
                    >
                      <BookOpen size={14} />
                      <code>{item.text}</code>
                    </div>
                  );
                }

                return (
                  <div key={index} className="theory-card">
                    <span className="bullet-point">&bull;</span>
                    <p className="theory-text">{item.text}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Static Bottom Deck Footer Info Brand */}
          <div className="flat-card-footer-branding">
            <span>Abstractive.ai Vault Node</span>
            <span>SCROLL TO VIEW COMPLETE MODULE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
