import React, { useState } from "react";
import "./ChooseBoard.css";

import { API_BASE_URL } from "../../config/api";

export default function ChooseBoard() {
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [loading, setLoading] = useState(false);

  const boards = ["CBSE", "CHSE"];
  const classes = ["10", "11", "12"];

  async function handleClassSelect(classLevel) {
    if (!selectedBoard) {
      alert("Please select a board first");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const guestId = localStorage.getItem("guestId");

      /* ========= GUEST FLOW ========= */
      if (guestId) {
        const res = await fetch(`${API_BASE_URL}/api/guest/onboarding`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            guestId,
            board: selectedBoard,
            classLevel,
          }),
        });

        if (!res.ok) {
          const text = await res.text();
          alert(text || "Guest onboarding failed");
          return;
        }

        localStorage.setItem("board", selectedBoard);
        localStorage.setItem("classLevel", classLevel);

        window.location.href = "/home";
        return;
      }

      /* ========= LOGGED USER FLOW ========= */
      if (!token) {
        window.location.href = "/login";
        return;
      }

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

      if (!res.ok) {
        const text = await res.text();
        alert(text || "User onboarding failed");
        return;
      }

      localStorage.setItem("board", selectedBoard);
      localStorage.setItem("classLevel", classLevel);

      window.location.href = "/";
    } catch (err) {
      alert("Network Error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="choose-container">
      <div className="glass-card">
        {/* ===== BOARD SELECTION ===== */}
        {!selectedBoard && (
          <>
            <h1 className="title">Choose Your Board</h1>
            <p className="subtitle">Select your education board</p>

            <div className="board-scroll">
              {boards.map((board) => (
                <button
                  key={board}
                  className="board-card"
                  onClick={() => setSelectedBoard(board)}
                >
                  {board}
                </button>
              ))}
            </div>
          </>
        )}

        {/* ===== CLASS SELECTION ===== */}
        {selectedBoard && (
          <>
            <h1 className="title">Select Class</h1>
            <p className="subtitle">Board: {selectedBoard}</p>

            {classes.map((cls) => (
              <button
                key={cls}
                className="class-card"
                onClick={() => handleClassSelect(cls)}
                disabled={loading}
              >
                Class {cls}
              </button>
            ))}

            {loading && <div className="loader" />}
          </>
        )}
      </div>
    </div>
  );
}