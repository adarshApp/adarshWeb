import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight } from "lucide-react";
import "./flashCards.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://abarsh-backend.onrender.com";

export default function FlashcardPage() {
  const navigate = useNavigate();

  // State variables
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedBoard, setSelectedBoard] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("physics");
  
  /* ---------- NEW: Track user stream goals to filter biology ---------- */
  const [userStream, setUserStream] = useState("");

  const loadUserData = () => {
    try {
      const userData = localStorage.getItem("user");

      if (!userData) {
        setSelectedClass("class-12");
        setSelectedBoard("CBSE");
        setUserStream("JEE"); // Default fallback
        return;
      }

      const user = JSON.parse(userData);
      setSelectedBoard(user.board || "CBSE");
      
      // Capturing target exam goals (e.g., JEE, NEET, GENERAL)
      setUserStream(user.stream || user.goal || "JEE");

      setSelectedClass(
        user.className
          ? user.className.toLowerCase().replace(/\s+/g, "-")
          : "class-12"
      );
    } catch (err) {
      console.error("Failed to parse local user payload data:", err);
      setSelectedClass("class-12");
      setSelectedBoard("CBSE");
      setUserStream("JEE");
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (selectedClass && selectedBoard) {
      fetchTopicDecks();
    }
  }, [selectedClass, selectedBoard, selectedSubject]);

  // Fetch main topics list from explicit route
  async function fetchTopicDecks() {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `${API_BASE_URL}/api/content/${selectedClass}/${selectedBoard}/${selectedSubject}/flashcard`,
      );
      const data = await res.json();

      if (data.success && Array.isArray(data.files)) {
        setTopics(data.files);
      } else {
        throw new Error("Invalid format returned from API");
      }
    } catch (err) {
      console.error("Error loading flashcard topics:", err);
      setError(`Failed to stream ${selectedSubject} data from backend cluster.`);
      
      // Fallback arrays updated to adaptively match selected subjects if API errors out
      const localFallbacks = {
        physics: ["circuit-solving", "combination-of-resistors", "krichhoff-s-laws", "rotationalMotion"],
        mathematics: ["calculus-limits", "matrices-determinants", "vectors-3d"],
        chemistry: ["organic-mechanisms", "electrochemistry", "chemical-bonding"],
        biology: ["cell-division", "genetics-inheritance", "plant-physiology"]
      };
      setTopics(localFallbacks[selectedSubject] || localFallbacks.physics);
    } finally {
      setLoading(false);
    }
  }

  const handleTopicClick = (topicSlug) => {
    navigate("/flashcardRead", {
      state: {
        topicSlug,
        classLevel: selectedClass,
        board: selectedBoard,
        subject: selectedSubject,
      },
    });
  };

  const cleanTitle = (slug) => {
    return slug
      .replace(/-/g, " ")
      .replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());
  };

  /* ---------- NEW: Conditional Subject List Array Generation ---------- */
  const baseSubjects = [
    { id: "mathematics", label: "MATH" },
    { id: "physics", label: "PHYSICS" },
    { id: "chemistry", label: "CHEMISTRY" },
    { id: "biology", label: "BIOLOGY" }
  ];

  // Strictly filter out biology if string markers mention JEE anywhere
  const availableSubjects = userStream.toUpperCase().includes("JEE")
    ? baseSubjects.filter(sub => sub.id !== "biology")
    : baseSubjects;

  return (
    <div className="bold-flashcard-layout">
      {/* BACKGROUND DECORATIVE ITEMS */}
      <span className="voxel-item v-atom">⚛️</span>
      <span className="voxel-item v-book">⚡</span>

      <div className="flashcard-viewport">
        {/* INTERACTION LINK NAV HEADER */}
        <header className="flashcard-nav-row">
          <button className="bold-back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} strokeWidth={3} />
            <span>DASHBOARD</span>
          </button>

          <div className="deck-info-pill">
            <span>
              {selectedSubject.toUpperCase()} • {selectedBoard} (
              {selectedClass.toUpperCase()})
            </span>
          </div>
        </header>

        {/* CORE CONTEXT TITLE DESCRIPTION */}
        <div className="flash-welcome-block">
          <h1 className="welcome-heading">
            Flashcard <span className="italic-accent">Command</span>
          </h1>
          <p className="welcome-sub">
            Select an interactive structural node below to open your dedicated
            reading viewport.
          </p>
        </div>

        {/* ---------- NEW: DYNAMIC BRUTALIST SUBJECT TOP BAR ---------- */}
        <div className="brutalist-subject-tabs">
          {availableSubjects.map((sub) => (
            <button
              key={sub.id}
              className={`subject-tab-btn ${selectedSubject === sub.id ? "active" : ""}`}
              onClick={() => setSelectedSubject(sub.id)}
            >
              {sub.label}
            </button>
          ))}
        </div>

        {/* LOADING & DATA DISPLAY PORTS */}
        {loading ? (
          <div className="tab-loader-container">
            <div className="loader" />
          </div>
        ) : (
          <>
            {error && (
              <div className="error-brutalist-banner">
                <span>⚠️ API NOTE: Using local fallback parameters. ({error})</span>
              </div>
            )}

            {/* ROADMAP.SH STYLE STUDY DECKS SELECTOR GRID */}
            <div className="roadmap-deck-grid">
              {topics.length === 0 ? (
                <div className="empty-state-card">
                  <p>No active data modules uploaded for this subject segment yet.</p>
                </div>
              ) : (
                topics.map((topic, idx) => (
                  <div
                    key={idx}
                    className="roadmap-topic-card"
                    onClick={() => handleTopicClick(topic)}
                  >
                    <div className="card-left-design">
                      <div className="index-square">{idx + 1}</div>
                      <div className="topic-title-meta">
                        <h3>{cleanTitle(topic)}</h3>
                        <p>{selectedSubject.toUpperCase()} MODULE NODE</p>
                      </div>
                    </div>
                    <div className="card-right-arrow">
                      <span>STUDY</span>
                      <ChevronRight size={18} strokeWidth={3} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}