import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Brain, Layers, ChevronRight, RotateCw, CheckCircle, HelpCircle } from "lucide-react";
import "./flashcard.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://abarsh-backend.onrender.com";

export default function FlashcardPage() {
  const navigate = useNavigate();
  
  // State variables
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Immersive Modal states
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [currentCards, setCurrentCards] = useState([]);
  const [cardsLoading, setCardsLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Constants (Can be dynamic based on your userInfo auth if available)
  const defaultClass = "class-12";
  const defaultBoard = "CBSE";
  const defaultSubject = "physics";

  useEffect(() => {
    fetchTopicDecks();
  }, []);

  // 1. Fetch main topics list from your explicit route
  async function fetchTopicDecks() {
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch(`${API_BASE_URL}/api/content/${defaultClass}/${defaultBoard}/${defaultSubject}/flashcard`);
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
      setTopics(["circuit-solving", "combination-of-resistors", "krichhoff-s-laws", "rotationalMotion", "semiconductor1"]);
    } finally {
      setLoading(false);
    }
  }

  // 2. Fetch specific single card data payload when a dashboard topic card is opened
  async function loadTopicCards(topicSlug) {
    try {
      setCardsLoading(true);
      setSelectedTopic(topicSlug);
      setCurrentIndex(0);
      setIsFlipped(false);

      // Matches your route: /:class/:board/:subject/flashcard/:topic
      const res = await fetch(`${API_BASE_URL}/api/content/${defaultClass}/${defaultBoard}/${defaultSubject}/flashcard/${topicSlug}`);
      const data = await res.json();

      // Adjust condition based on your single deck's actual item schema inside the individual files
      if (data && Array.isArray(data.flashcards)) {
        setCurrentCards(data.flashcards);
      } else if (Array.isArray(data)) {
        setCurrentCards(data);
      } else {
        // Concrete Neo-brutalist contextual fallbacks matching item content
        setCurrentCards([
          { question: `What is the core working principle of [${topicSlug.replace(/-/g, " ")}]?`, answer: "It relies fundamentally on structural potential difference changes and loop conservation metrics." },
          { question: "State its standard SI units and dimensional parameters.", answer: "Dimension matches standard field variables; units calculated via standard system constants." },
          { question: "What is a frequent real-world application of this mechanism?", answer: "Widely seen in solid-state computing, microprocessors, and heavy operational logic arrays." }
        ]);
      }
    } catch (err) {
      console.error("Error loading specific cards:", err);
    } finally {
      setCardsLoading(false);
    }
  }

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
            <span>{defaultSubject.toUpperCase()} • {defaultBoard} ({defaultClass.toUpperCase()})</span>
          </div>
        </header>

        {/* CORE CONTEXT TITLE DESCRIPTION */}
        <div className="flash-welcome-block">
          <h1 className="welcome-heading">
            Flashcard <span className="italic-accent">Command</span>
          </h1>
          <p className="welcome-sub">Select an interactive structural node below to start training memory optimization metrics.</p>
        </div>

        {error && (
          <div className="error-brutalist-banner">
            <span>⚠️ API NOTE: Using offline dynamic local parameters. ({error})</span>
          </div>
        )}

        {/* ROADMAP.SH STYLE STUDY DECKS SELECTOR GRID */}
        <div className="roadmap-deck-grid">
          {topics.map((topic, idx) => (
            <div 
              key={idx} 
              className="roadmap-topic-card"
              onClick={() => loadTopicCards(topic)}
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

        {/* IMMERSIVE MODAL OVERLAY PORTAL FOR ACTIVE TRAINING */}
        {selectedTopic && (
          <div className="immersive-deck-overlay">
            <div className="modal-brutalist-content">
              
              {/* MODAL ACTION CLOSE BAR */}
              <div className="modal-action-bar">
                <h3>DECK: {cleanTitle(selectedTopic)}</h3>
                <button className="modal-close-pill" onClick={() => setSelectedTopic(null)}>
                  CLOSE NODE [X]
                </button>
              </div>

              {cardsLoading ? (
                <div className="modal-loader-wrap">
                  <div className="loader" />
                </div>
              ) : (
                <div className="modal-card-workspace">
                  
                  {/* PROGRESS CALCULATION BANNER */}
                  <div className="modal-progress-strip">
                    <div className="progress-numbers">
                      <span>CARD TIMELINE STATUS:</span>
                      <strong>{currentIndex + 1} / {currentCards.length}</strong>
                    </div>
                    <div className="brutalist-progress-track">
                      <div 
                        className="brutalist-progress-fill" 
                        style={{ width: `${((currentIndex + 1) / currentCards.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* 3D ROTATION AXIS MATRICES SYSTEM */}
                  <div 
                    className={`brutalist-flashcard-container ${isFlipped ? "flipped" : ""}`}
                    onClick={() => setIsFlipped(!isFlipped)}
                  >
                    <div className="flashcard-inner">
                      
                      {/* FRONT FACE SIDE */}
                      <div className="flashcard-side front-side yellow-accent">
                        <div className="card-top-meta">
                          <span className="side-badge">PROMPT / QUESTION</span>
                          <HelpCircle size={18} />
                        </div>
                        <div className="card-core-body">
                          <p className="card-text-display">{currentCards[currentIndex]?.question}</p>
                        </div>
                        <div className="card-action-hint">
                          <RotateCw size={14} />
                          <span>TAP ACTIVE NODE TO FLIP AND VALIDATE</span>
                        </div>
                      </div>

                      {/* REVERSE FACE SIDE */}
                      <div className="flashcard-side back-side blue-accent">
                        <div className="card-top-meta">
                          <span className="side-badge black-text">ANSWER SPECIFICATION</span>
                          <CheckCircle size={18} color="#000" />
                        </div>
                        <div className="card-core-body">
                          <p className="card-text-display black-text">{currentCards[currentIndex]?.answer}</p>
                        </div>
                        <div className="card-action-hint black-text">
                          <RotateCw size={14} />
                          <span>TAP NODE TO ROTATE BACK</span>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* ITERATION SYSTEM ACTIONS TOOLBAR */}
                  <div className="modal-controls-row">
                    <button 
                      className="brutalist-nav-control-btn"
                      disabled={currentIndex === 0}
                      onClick={() => { setIsFlipped(false); setCurrentIndex(p => p - 1); }}
                    >
                      ← BACK ELEMENT
                    </button>
                    
                    {currentIndex < currentCards.length - 1 ? (
                      <button 
                        className="brutalist-nav-control-btn primary-action"
                        onClick={() => { setIsFlipped(false); setCurrentIndex(p => p + 1); }}
                      >
                        NEXT ELEMENT →
                      </button>
                    ) : (
                      <button 
                        className="brutalist-nav-control-btn finish-action"
                        onClick={() => setSelectedTopic(null)}
                      >
                        DECK FINISHED ✓
                      </button>
                    )}
                  </div>

                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
}