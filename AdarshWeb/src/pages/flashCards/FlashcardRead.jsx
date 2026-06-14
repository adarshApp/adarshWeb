import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, RotateCw, CheckCircle, HelpCircle } from "lucide-react";
import "./flashcard.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://abarsh-backend.onrender.com";

export default function FlashcardRead() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract state tracking route variables safely, fallback onto constants if navigated directly
  const { topicSlug, classLevel, board, subject } = location.state || {
    topicSlug: "circuit-solving",
    classLevel: "class-12",
    board: "CBSE",
    subject: "physics"
  };

  const [currentCards, setCurrentCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    loadTopicCards();
  }, [topicSlug]);

  async function loadTopicCards() {
    try {
      setLoading(true);
      setIsFlipped(false);
      setCurrentIndex(0);

      const res = await fetch(`${API_BASE_URL}/api/content/${classLevel}/${board}/${subject}/flashcard/${topicSlug}`);
      const data = await res.json();

      // If backend uses the structural payload version with the multi-token data array:
      if (data.success && Array.isArray(data.data) && data.data?.theory) {
        setCurrentCards(chunkTheoryIntoCards(data.data.theory));
      } else if (data && Array.isArray(data.flashcards)) {
        setCurrentCards(data.flashcards);
      } else if (Array.isArray(data)) {
        setCurrentCards(data);
      } else {
        throw new Error("No readable flashcard arrays standard format found.");
      }
    } catch (err) {
      console.error("Error reading single card file data:", err);
      // Brutalist recovery placeholder schema
      setCurrentCards([
        { question: `Review the essential mechanics of [${cleanTitle(topicSlug)}]`, answer: "Verify formula metrics and loop rules corresponding to this specific physics chapter node." }
      ]);
    } finally {
      setLoading(false);
    }
  }

  function chunkTheoryIntoCards(theoryArray) {
    const flashcardsList = [];
    let currentChunk = null;

    theoryArray.forEach((item) => {
      if (item.type === "highlight" && item.text.startsWith("Flashcard")) {
        if (currentChunk) flashcardsList.push(currentChunk);
        currentChunk = { title: item.text, question: "", answerBlocks: [] };
      } else {
        if (!currentChunk) currentChunk = { title: "Overview Module Core", question: "", answerBlocks: [] };
        if (item.type === "theory" && !currentChunk.question) {
          currentChunk.question = `Explain the concept: ${item.text}`;
        }
        currentChunk.answerBlocks.push(item);
      }
    });
    if (currentChunk) flashcardsList.push(currentChunk);

    return flashcardsList.map(card => ({
      ...card,
      question: card.question || `Analyze the mathematical layout rules of ${card.title}`,
      isStructuredPayload: true
    }));
  }

  function cleanTitle(slug) {
    return slug.replace(/-/g, " ").replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());
  }

  if (loading) {
    return (
      <div className="dashboard-center"><div className="loader" /></div>
    );
  }

  const activeCard = currentCards[currentIndex];

  return (
    <div className="bold-flashcard-layout">
      <main className="flashcard-viewport">
        
        <header className="flashcard-nav-row">
          <button className="bold-back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} strokeWidth={3} />
            <span>TOPIC INDEX</span>
          </button>
          <div className="deck-info-pill">
            <span>READ NODE: {topicSlug.toUpperCase()}</span>
          </div>
        </header>

        <div className="modal-card-workspace">
          
          {/* TIMELINE TRACK PROGRESS STRIP */}
          <div className="modal-progress-strip">
            <div className="progress-numbers">
              <span>{activeCard?.title || "ACTIVE STUDY ELEMENT"}</span>
              <strong>{currentIndex + 1} / {currentCards.length}</strong>
            </div>
            <div className="brutalist-progress-track">
              <div 
                className="brutalist-progress-fill" 
                style={{ width: `${((currentIndex + 1) / currentCards.length) * 100}%` }}
              />
            </div>
          </div>

          {/* 3D BRUTALIST FLIP ELEMENT TRACKER */}
          <div 
            className={`brutalist-flashcard-container adaptive-height ${isFlipped ? "flipped" : ""}`}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className="flashcard-inner">
              
              {/* FRONT FACE SIDE */}
              <div className="flashcard-side front-side yellow-accent">
                <div className="card-top-meta">
                  <span className="side-badge">PROMPT INTERROGATION</span>
                  <HelpCircle size={18} />
                </div>
                <div className="card-core-body alignment-top">
                  <p className="card-text-display dynamic-fontSize">{activeCard?.question}</p>
                </div>
                <div className="card-action-hint">
                  <RotateCw size={14} />
                  <span>TAP CARD TO EXECUTE DEEP ANALYSIS ROTATION</span>
                </div>
              </div>

              {/* REVERSE FACE SIDE */}
              <div className={`flashcard-side back-side ${activeCard?.isStructuredPayload ? "white-bg-brutalist" : "blue-accent"}`}>
                <div className="card-top-meta">
                  <span className="side-badge black-text bg-yellow">COMPILED THEOREM INSIGHTS</span>
                  <CheckCircle size={18} color="#000" />
                </div>
                
                <div className="card-scrollable-payload-area">
                  {activeCard?.isStructuredPayload ? (
                    activeCard?.answerBlocks?.map((block, bIdx) => {
                      if (block.type === "highlight") {
                        return (
                          <div key={bIdx} className="brutalist-payload-highlight" style={{ borderLeftColor: block.color || "#000" }}>
                            <h4>{block.text}</h4>
                          </div>
                        );
                      }
                      if (block.type === "formula") {
                        return (
                          <div key={bIdx} className="brutalist-payload-formula">
                            <code>{block.text}</code>
                          </div>
                        );
                      }
                      return (
                        <p key={bIdx} className="brutalist-payload-theory">• {block.text}</p>
                      );
                    })
                  ) : (
                    <div className="card-core-body">
                      <p className="card-text-display black-text">{activeCard?.answer}</p>
                    </div>
                  )}
                </div>

                <div className="card-action-hint black-text border-top-line">
                  <RotateCw size={14} />
                  <span>TAP TO RETURN TO CORE PROMPT</span>
                </div>
              </div>

            </div>
          </div>

          {/* USER SELECTION SYSTEM STEPPER CONTROLS */}
          <div className="modal-controls-row">
            <button 
              className="brutalist-nav-control-btn"
              disabled={currentIndex === 0}
              onClick={() => { setIsFlipped(false); setCurrentIndex(p => p - 1); }}
            >
              &larr; PREVIOUS CARD
            </button>
            
            {currentIndex < currentCards.length - 1 ? (
              <button 
                className="brutalist-nav-control-btn primary-action"
                onClick={() => { setIsFlipped(false); setCurrentIndex(p => p + 1); }}
              >
                NEXT DATA CARD &rarr;
              </button>
            ) : (
              <button 
                className="brutalist-nav-control-btn finish-action"
                onClick={() => navigate(-1)}
              >
                FINISH DECK ✓
              </button>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}