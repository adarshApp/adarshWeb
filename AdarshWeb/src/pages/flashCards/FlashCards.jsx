import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./flashCards.css";
import { API_BASE_URL } from "../../config/api";

const SUBJECTS = ["physics", "chemistry", "mathematics", "biology"];

export default function FlashCards() {
  const navigate = useNavigate();

  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSubject, setActiveSubject] = useState("physics");

  /* -------- Load List -------- */
  useEffect(() => {
    loadCards();
  }, [activeSubject]);

  async function loadCards() {
    try {
      setLoading(true);
      const res = await fetch(
        `${API_BASE_URL}/api/flashcards?subject=${activeSubject}`
      );
      const data = await res.json();
      setCards(data);
    } catch (e) {
      console.error("Error loading cards", e);
    } finally {
      setLoading(false);
    }
  }

  /* -------- Load Detail -------- */
  async function openCard(card) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/flashcards/${card.id}`);
      const details = await res.json();
      setSelectedCard({ ...card, ...details });
    } catch {
      console.error("Detail load failed");
    }
  }

  if (loading) {
    return (
      <div className="flash-loader">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="flash-container">
      {/* ===== HEADER ===== */}
      <div className="flash-header">
        <button className="back-circle" onClick={() => navigate(-1)}>
          ←
        </button>
        <h1>Study Vault</h1>
        <p>Master high-yield concepts</p>
      </div>

      {/* ===== SUBJECT BAR ===== */}
      <div className="subject-bar">
        {SUBJECTS.map((sub) => (
          <button
            key={sub}
            className={`subject-chip ${
              activeSubject === sub ? "active" : ""
            }`}
            onClick={() => setActiveSubject(sub)}
          >
            {sub.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ===== CARD LIST ===== */}
      <div className="card-grid">
        {cards.map((card) => (
          <div
            key={card.id}
            className="list-card"
            onClick={() => openCard(card)}
          >
            <div className="icon-box">{card.icon}</div>

            <div className="list-content">
              <h3>{card.title}</h3>
              <p>
                {card.difficulty.toUpperCase()} • {card.weightage}
              </p>
            </div>

            <span className="arrow">→</span>
          </div>
        ))}
      </div>

      {/* ===== MODAL ===== */}
      {selectedCard && (
        <div className="modal-overlay" onClick={() => setSelectedCard(null)}>
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-btn"
              onClick={() => setSelectedCard(null)}
            >
              ✕
            </button>

            <h2>{selectedCard.title}</h2>
            <p className="modal-desc">{selectedCard.description}</p>

            <div className="divider" />

            {selectedCard.theory?.map((item, i) => {
              if (item.type === "formula") {
                return (
                  <div key={i} className="formula-box">
                    <span
                      style={{ color: item.color || "#4F46E5" }}
                    >
                      {item.text}
                    </span>
                  </div>
                );
              }

              if (item.type === "highlight") {
                return (
                  <div
                    key={i}
                    className="highlight-box"
                    style={{
                      borderLeftColor: item.color || "#F59E0B",
                    }}
                  >
                    {item.text}
                  </div>
                );
              }

              return (
                <div key={i} className="bullet-row">
                  <span className="dot" />
                  <p>{item.text}</p>
                </div>
              );
            })}

            <div className="modal-footer">
              <span className="brand">Abstractive.ai</span>
              <button className="action-btn">Initialize Session</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}