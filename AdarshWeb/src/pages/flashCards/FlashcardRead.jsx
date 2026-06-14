import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldAlert, Clock, HelpCircle, BookOpen } from "lucide-react";
import "./flashcardRead.css"; // Using a dedicated clean style sheet

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

  useEffect(() => {
    loadTopicCards();
  }, [topicSlug]);

  async function loadTopicCards() {
    try {
      setLoading(true);
      setCurrentIndex(0);

      const cleanClass = classLevel ? classLevel.toLowerCase() : "class-12";
      const cleanBoard = board ? board.toUpperCase() : "CBSE"; 
      const cleanSubject = subject ? subject.toLowerCase() : "physics";

      const url = `${API_BASE_URL}/api/content/${cleanClass}/${cleanBoard}/${cleanSubject}/flashcard/${topicSlug}`;
      const res = await fetch(url);
      
      if (!res.ok) throw new Error(`HTTP Error Status: ${res.status}`);
      
      const data = await res.json();

      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        const rawPayload = data.data;
        
        setDeckMeta({
          title: rawPayload.title || cleanTitle(topicSlug),
          icon: rawPayload.icon || "🧪",
          difficulty: rawPayload.difficulty || "Medium",
          weightage: rawPayload.weightage || "High Volume",
          estTime: rawPayload.estTime || "25 mins",
          description: rawPayload.description || ""
        });

        if (Array.isArray(rawPayload.theory)) {
          setCurrentCards(chunkTheoryIntoCards(rawPayload.theory));
        } else {
          throw new Error("Theory missing from data payload.");
        }
      } else {
        throw new Error("Payload mismatched configuration.");
      }
    } catch (err) {
      console.error("Render Bridge Connection Error:", err);
      // Fallback matching your exact text payload fields
      setDeckMeta({
        title: "Acids & Acidity – Master Flashcards",
        icon: "🧪",
        difficulty: "Medium–Hard",
        estTime: "35 mins",
        description: "Complete JEE flashcard deck on acids and acidity covering pKa, structural effects, solvent effects, relative acid strengths, and exam-favorite rules."
      });
      
      setCurrentCards([
        {
          title: "Acids & Acidity – Core Idea",
          headerColor: "#F59E0B",
          question: "What is a Brønsted–Lowry Acid and what determines its fundamental strength?",
          answerBlocks: [
            { type: "theory", text: "Brønsted–Lowry Acid: A species that donates H⁺. Acid strength depends on stability of its conjugate base." },
            { type: "theory", text: "Stronger acid ⇢ more stable conjugate base." }
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  function chunkTheoryIntoCards(theoryArray) {
    const flashcardsList = [];
    let currentChunk = null;

    theoryArray.forEach((item) => {
      const isHeader = item.type === "highlight" && 
        (item.text.startsWith("Flashcard") || item.text.startsWith("Card") || item.text.startsWith("Topic") || item.text.includes("Flash Card"));

      if (isHeader) {
        if (currentChunk) flashcardsList.push(currentChunk);
        currentChunk = { title: item.text, headerColor: item.color || "#F59E0B", question: "", answerBlocks: [] };
      } else {
        if (!currentChunk) {
          currentChunk = { title: "Foundational Insight Node", headerColor: "#0EA5E9", question: "", answerBlocks: [] };
        }
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
      question: card.question || `Analyze the conceptual principles detailed inside ${card.title}`,
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
      <div className="readview-center-loader"><div className="readview-spinner" /></div>
    );
  }

  const activeCard = currentCards[currentIndex];

  return (
    <div className="flat-readview-layout">
      <main className="flat-readview-viewport">
        
        {/* HEADER BAR ROW */}
        <header className="readview-nav-row">
          <button className="readview-back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} strokeWidth={3} />
            <span>TOPIC INDEX</span>
          </button>
          <div className="readview-info-pill">
            <span>READ NODE: {topicSlug.toUpperCase()}</span>
          </div>
        </header>

        {/* METADATA MODULE PARAMETERS BANNER */}
        {deckMeta && (
          <div className="readview-welcome-block">
            <h1 className="readview-main-heading">
              {deckMeta.icon} {deckMeta.title}
            </h1>
            
            <div className="readview-badge-row">
              <div className="readview-meta-badge">
                <ShieldAlert size={14} />
                <span>DIFFICULTY: {deckMeta.difficulty.toUpperCase()}</span>
              </div>
              <div className="readview-meta-badge">
                <Clock size={14} />
                <span>TIME VALUE: {deckMeta.estTime.toUpperCase()}</span>
              </div>
            </div>
            <p className="readview-subtext">{deckMeta.description}</p>
          </div>
        )}

        {/* CARD SYSTEM CORE HUB */}
        <div className="readview-card-workspace">
          
          {/* PROGRESS TIMELINE SEGMENT ROW */}
          <div className="readview-progress-strip">
            <div className="readview-progress-numbers">
              <span style={{ color: activeCard?.headerColor || "#000", fontWeight: 900 }}>
                {activeCard?.title || "CORE INSIGHT NODE"}
              </span>
              <strong>{currentIndex + 1} / {currentCards.length}</strong>
            </div>
            <div className="readview-progress-track">
              <div 
                className="readview-progress-fill" 
                style={{ width: `${currentCards.length ? ((currentIndex + 1) / currentCards.length) * 100 : 0}%`, backgroundColor: activeCard?.headerColor || "#000" }}
              />
            </div>
          </div>

          {/* FLAT SCROLLABLE STUDY DECK SURFACE (Matches Image Structure Blueprint) */}
          <div className="flat-brutalist-deck-card">
            
            {/* Top Frame Heading Label */}
            <div className="flat-card-header-label">
              <span className="flat-card-micro-badge">COMPILED MECHANICAL INSIGHTS</span>
              <BookOpen size={18} color="#000" />
            </div>

            {/* Main Scrollable Data Box Area */}
            <div className="flat-card-scroll-body">
              
              {/* Question Statement Header Section */}
              <div className="flat-card-question-box" style={{ borderLeftColor: activeCard?.headerColor || "#000" }}>
                <div className="question-icon-tag"><HelpCircle size={16} /><span>PROMPT</span></div>
                <h3>{activeCard?.question}</h3>
              </div>

              <div className="flat-card-divider-line" />

              {/* Sequential Theory Blocks Rendering Frame */}
              <div className="flat-card-payload-stack">
                {activeCard?.answerBlocks?.map((block, bIdx) => {
                  if (block.type === "highlight") {
                    return (
                      <div key={bIdx} className="flat-payload-highlight" style={{ borderLeftColor: block.color || "#F59E0B" }}>
                        <h4>{block.text}</h4>
                      </div>
                    );
                  }
                  if (block.type === "formula") {
                    return (
                      <div key={bIdx} className="flat-payload-formula" style={{ color: block.color || "#4F46E5" }}>
                        <code>{block.text}</code>
                      </div>
                    );
                  }
                  return (
                    <p key={bIdx} className="flat-payload-theory">
                      &bull; {block.text}
                    </p>
                  );
                })}
              </div>

            </div>

            {/* Static Bottom Deck Footer Branding Line */}
            <div className="flat-card-footer-branding">
              <span>Abstractive.ai Vault Engine</span>
              <span>SCROLL TO EXPLORE ALL INSIGHTS</span>
            </div>
          </div>

          {/* SYSTEM STEPPER EXECUTION CONTROLS */}
          <div className="readview-controls-row">
            <button 
              className="readview-nav-btn"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(p => p - 1)}
            >
              &larr; PREVIOUS CARD
            </button>
            
            {currentIndex < currentCards.length - 1 ? (
              <button 
                className="readview-nav-btn readview-primary-action"
                onClick={() => setCurrentIndex(p => p + 1)}
              >
                NEXT DATA CARD &rarr;
              </button>
            ) : (
              <button 
                className="readview-nav-btn readview-finish-action"
                onClick={() => navigate(-1)}
              >
                FINISH MODULE DECK ✓
              </button>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}