import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight } from "lucide-react";
import "./flashCards.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://abarsh-backend.onrender.com";

export default function FlashcardPage() {
  const navigate = useNavigate();

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedBoard, setSelectedBoard] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("physics");

  const loadUserData = () => {
    const userData = localStorage.getItem("user");

    if (!userData) {
      setSelectedClass("class-12");
      setSelectedBoard("CBSE");
      return;
    }

    const user = JSON.parse(userData);

    setSelectedBoard(user.board || "CBSE");

    setSelectedClass(
      user.className
        ? user.className.toLowerCase().replace(" ", "-")
        : "class-12",
    );
  };

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (selectedClass && selectedBoard) {
      fetchTopicDecks();
    }
  }, [selectedClass, selectedBoard, selectedSubject]);
  const loadUserData = () => {
    const userData = localStorage.getItem("user");

    if (!userData) {
      setSelectedClass("class-12");
      setSelectedBoard("CBSE");
      return;
    }

    const user = JSON.parse(userData);

    setSelectedBoard(user.board);

    setSelectedClass(user.className.toLowerCase().replace(" ", "-"));
  };

  // 1. Fetch main topics list from your explicit route
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
      setError("Failed to stream flashcard data from backend cluster.");
      // Brutalist fallback if deployment is resting/offline
      setTopics([
        "circuit-solving",
        "combination-of-resistors",
        "krichhoff-s-laws",
        "rotationalMotion",
        "semiconductor1",
      ]);
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

  if (loading) {
    return (
      <div className="dashboard-center">
        <div className="loader" />
      </div>
    );
  }

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

        {error && (
          <div className="error-brutalist-banner">
            <span>
              ⚠️ API NOTE: Using offline dynamic local parameters. ({error})
            </span>
          </div>
        )}

        {/* ROADMAP.SH STYLE STUDY DECKS SELECTOR GRID */}
        <div className="roadmap-deck-grid">
          {topics.map((topic, idx) => (
            <div
              key={idx}
              className="roadmap-topic-card"
              onClick={() => handleTopicClick(topic)}
            >
              <div className="card-left-design">
                <div className="index-square">{idx + 1}</div>
                <div className="topic-title-meta">
                  <h3>{cleanTitle(topic)}</h3>
                  <p>MODULE FILE NODE</p>
                </div>
              </div>
              <div className="card-right-arrow">
                <span>STUDY</span>
                <ChevronRight size={18} strokeWidth={3} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
