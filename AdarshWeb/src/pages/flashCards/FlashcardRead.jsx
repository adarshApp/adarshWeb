import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, RotateCw, CheckCircle, HelpCircle, ShieldAlert, Clock } from "lucide-react";
import "./flashCards.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://abarsh-backend.onrender.com";

export default function FlashcardRead() {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Safe Routing State Interception with dynamic fallbacks
  const { topicSlug, classLevel, board, subject } = location.state || {
    topicSlug: "circuit-solving",
    classLevel: "class-12",
    board: "CBSE",
    subject: "physics"
  };

  // Content Hooks
  const [deckMeta, setDeckMeta] = useState(null);
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

      // Fetching from the specified backend endpoint layout mapping
      const res = await fetch(`${API_BASE_URL}/api/content/${classLevel}/${board}/${subject}/flashcard/${topicSlug}`);
      const data = await res.json();

      if (data.success && data.data) {
        // Resolve whether backend wraps the data node in an array package or directly exposes the target object
        const rawPayload = Array.isArray(data.data) ? data.data : data.data;

        if (!rawPayload) {
          throw new Error("Payload matrix evaluation resolved to empty or null.");
        }

        // Save metadata fields matching React Native fields (icon, difficulty, weightage, estTime, description)
        setDeckMeta({
          title: rawPayload.title || cleanTitle(topicSlug),
          icon: rawPayload.icon || "📘",
          difficulty: rawPayload.difficulty || "Medium",
          weightage: rawPayload.weightage || "High",
          estTime: rawPayload.estTime || "15 mins",
          description: rawPayload.description || "Conceptual structural unit study block profile view."
        });

        if (Array.isArray(rawPayload.theory)) {
          const processedCards = chunkTheoryIntoCards(rawPayload.theory);
          setCurrentCards(processedCards);
        } else {
          throw new Error("Theory blocks missing or improperly structured from node database cluster.");
        }
      } else {
        throw new Error("No payload tracked inside backend cluster data block hierarchy");
      }
    } catch (err) {
      console.error("Error reading single card file data:", err);
      // Clean structural layout recovery placeholder fallback
      setDeckMeta({
        title: cleanTitle(topicSlug),
        icon: "⚡",
        difficulty: "MEDIUM–HARD",
        estTime: "25 MINS",
        description: "Error communicating with Render cloud infrastructure clusters. Running static backup layout parameters."
      });
      setCurrentCards([
        {
          title: "Flashcard Error Recovery Node",
          question: "Failed to securely parse runtime tokens from API endpoint matrix layers.",
          answerBlocks: [
            { type: "highlight", text: "Troubleshooting Action Required" },
            { type: "theory", text: "Verify your server instance is live and CORS permissions accept traffic from local origins." }
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  // 2. Chunks raw theory lists into flashcards based on "Flashcard X:" headers or block splits
  function chunkTheoryIntoCards(theoryArray) {
    const flashcardsList = [];
    let currentChunk = null;

    theoryArray.forEach((item) => {
      // Catch layout strings that declare a new card split segment block boundary
      const isHeader = item.type === "highlight" && 
        (item.text.startsWith("Flashcard") || item.text.startsWith("Card") || item.text.startsWith("Topic"));

      if (isHeader) {
        if (currentChunk) flashcardsList.push(currentChunk);
        currentChunk = { title: item.text, question: "", answerBlocks: [] };
      } else {
        if (!currentChunk) {
          currentChunk = { title: "Foundational Insight Node", question: "", answerBlocks: [] };
        }
        // Use the first standard theory block description string encounter as the Front Prompt Question display
        if (item.type === "theory" && !currentChunk.question) {
          currentChunk.question = item.text;
        } else {
          currentChunk.answerBlocks.push(item);
        }
      }
    });
    if (currentChunk) flashcardsList.push(currentChunk);

    return flashcardsList.map((card) => ({
      ...card,
      question: card.question || `Analyze the conceptual layout formulas and statements inside ${card.title}`,
      // Fallback architecture checks: make sure theory details don't go missing if blocks array evaluates empty
      answerBlocks: card.answerBlocks.length === 0 && card.question 
        ? [{ type: "theory", text: card.question }] 
        : card.answerBlocks
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
        
        {/* TOP VIEWPORT NAVIGATION ACTIONS HEADER */}
        <header className="flashcard-nav-row">
          <button className="bold-back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} strokeWidth={3} />
            <span>TOPIC INDEX</span>
          </button>
          <div className="deck-info-pill">
            <span>READ NODE: {topicSlug.toUpperCase()}</span>
          </div>
        </header>

        {/* CORE TITLE SUMMARY DISPLAY AREA */}
        {deckMeta && (
          <div className="flash-welcome-block">
            <h1 className="welcome-heading">
              {deckMeta.icon} {deckMeta.title}
            </h1>
            
            <div className="meta-badge-row">
              <div className="brutalist-meta-badge">
                <ShieldAlert size={14} />
                <span>DIFFICULTY: {deckMeta.difficulty.toUpperCase()}</span>
              </div>
              <div className="brutalist-meta-badge">
                <Clock size={14} />
                <span>TIME VALUE: {deckMeta.estTime.toUpperCase()}</span>
              </div>
            </div>

            <p className="welcome-sub" style={{ marginTop: "14px" }}>{deckMeta.description}</p>
          </div>
        )}

        {/* DATA COMPONENT HUB */}
        <div className="modal-card-workspace">
          
          {/* PROGRESS PERCENTAGE STATUS BAR */}
          <div className="modal-progress-strip">
            <div className="progress-numbers">
              <span>{activeCard?.title || "CORE STUDY ELEMENT"}</span>
              <strong>{currentIndex + 1} / {currentCards.length}</strong>
            </div>
            <div className="brutalist-progress-track">
              <div 
                className="brutalist-progress-fill" 
                style={{ width: `${currentCards.length ? ((currentIndex + 1) / currentCards.length) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* 3D INTERACTIVE FLIPPER ELEMENT */}
          <div 
            className={`brutalist-flashcard-container adaptive-height ${isFlipped ? "flipped" : ""}`}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className="flashcard-inner">
              
              {/* FRONT CARD FACE (Question context prompt side) */}
              <div className="flashcard-side front-side yellow-accent">
                <div className="card-top-meta">
                  <span className="side-badge">PROMPT / CHALLENGE</span>
                  <HelpCircle size={18} />
                </div>
                <div className="card-core-body">
                  <p className="card-text-display dynamic-fontSize">{activeCard?.question}</p>
                </div>
                <div className="card-action-hint">
                  <RotateCw size={14} />
                  <span>TAP CARD AREA TO TRIGGER DATA DECODE INVERSION</span>
                </div>
              </div>

              {/* REVERSE CARD FACE (Dynamic payload parsing template matches React Native design styles) */}
              <div className="flashcard-side back-side white-bg-brutalist">
                <div className="card-top-meta">
                  <span className="side-badge black-text bg-yellow">COMPILED MECHANICAL INSIGHTS</span>
                  <CheckCircle size={18} color="#000" />
                </div>
                
                {/* stopping propagation ensures scrolling or tapping fields won't flip the card closed unexpectedly */}
                <div className="card-scrollable-payload-area" onClick={(e) => e.stopPropagation()}>
                  {activeCard?.answerBlocks?.map((block, bIdx) => {
                    if (block.type === "highlight") {
                      return (
                        <div key={bIdx} className="brutalist-payload-highlight" style={{ borderLeftColor: block.color || "#F59E0B" }}>
                          <h4>{block.text}</h4>
                        </div>
                      );
                    }
                    if (block.type === "formula") {
                      return (
                        <div key={bIdx} className="brutalist-payload-formula" style={{ color: block.color || "#4F46E5" }}>
                          <code>{block.text}</code>
                        </div>
                      );
                    }
                    return (
                      <p key={bIdx} className="brutalist-payload-theory">
                        &bull; {block.text}
                      </p>
                    );
                  })}
                </div>

                <div className="card-action-hint black-text border-top-line">
                  <RotateCw size={14} />
                  <span>TAP CARD TO RETURN TO CORE PROMPT</span>
                </div>
              </div>

            </div>
          </div>

          {/* STEPPER EXECUTION CONTROLS TOOLBAR */}
          <div className="modal-controls-row" onClick={(e) => e.stopPropagation()}>
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
                FINISH CONFIG NODE ✓
              </button>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}