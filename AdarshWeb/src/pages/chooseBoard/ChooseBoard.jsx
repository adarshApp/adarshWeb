import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import "./chooseBoard.css";
import { API_BASE_URL } from "../../config/api";

export default function ChooseBoard() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const [selectedBoard, setSelectedBoard] = useState(null);
  const [loading, setLoading] = useState(false);

  const boards = [
    "CBSE", "ICSE", "CHSE", "State", "CGBSE", "COHSEM", "DHSE", "DPUE",
    "GBSHE", "GSEB", "HBSE", "HPBOSE", "HSE", "JAC", "MBOSE", "MBSE",
    "MPBSE", "MSBSHSE", "NBSE", "PSEB", "RBSE", "SBSE", "TBSE",
    "TSBIE", "UBSE", "UPMSP", "WBCHSE",
  ];

  const classes = ["10", "11", "12"];

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -260 : 260,
      behavior: "smooth",
    });
  };

  const handleClassSelect = async (classLevel) => {
    if (!selectedBoard) {
      alert("Please select a board first");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/api/user/onboarding`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          board: selectedBoard,
          classLevel,
        }),
      });

      if (!res.ok) throw new Error("Failed to save onboarding");

      localStorage.setItem("board", selectedBoard);
      localStorage.setItem("classLevel", classLevel);

      navigate("/home", { replace: true });
    } catch (err) {
      alert(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="board-wrapper">
      <div className="board-glass">
        {!selectedBoard && (
          <>
            <h1>Choose Your Board</h1>
            <p className="subtitle">
              Select your education board to personalize your study experience.
            </p>

            <div className="scroll-wrapper">
              <button className="scroll-btn left" onClick={() => scroll("left")}>
                ‹
              </button>

              <div className="board-options" ref={scrollRef}>
                {boards.map((board) => (
                  <div
                    key={board}
                    className={`board-card ${
                      selectedBoard === board ? "selected" : ""
                    }`}
                    onClick={() => setSelectedBoard(board)}
                  >
                    <h3>{board}</h3>
                    <p>State-specific curriculum</p>
                  </div>
                ))}
              </div>

              <button className="scroll-btn right" onClick={() => scroll("right")}>
                ›
              </button>
            </div>
          </>
        )}

        {selectedBoard && (
          <>
            <button
              className="back-btn"
              onClick={() => setSelectedBoard(null)}
              disabled={loading}
            >
              ← Change Board
            </button>

            <h1>Select Class</h1>
            <p className="subtitle">
              You selected <b>{selectedBoard}</b>. Now choose your class.
            </p>

            <div className="board-options class-grid">
              {classes.map((cls) => (
                <div
                  key={cls}
                  className={`board-card selected ${
                    loading ? "disabled" : ""
                  }`}
                  onClick={() => !loading && handleClassSelect(cls)}
                >
                  <h3>Class {cls}</h3>
                  <p>
                    {cls === "10"
                      ? "Secondary Level"
                      : cls === "11"
                      ? "Higher Secondary"
                      : "Board Examination Year"}
                  </p>
                </div>
              ))}
            </div>

            {loading && <p className="loading-text">Saving your preferences…</p>}
          </>
        )}
      </div>
    </div>
  );
}