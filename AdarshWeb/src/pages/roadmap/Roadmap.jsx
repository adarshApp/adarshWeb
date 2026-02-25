import React, { useEffect, useState } from "react";
import "./roadmap.css";

const SUBJECTS = [
  { label: "Math", value: "mathematics" },
  { label: "Physics", value: "physics" },
  { label: "Chemistry", value: "chemistry" },
  { label: "Biology", value: "Biology" },
];

import { API_BASE_URL } from "../../config/api";

export default function Roadmap() {
  const [data, setData] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("mathematics");
  const [selectedModule, setSelectedModule] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoadmap();
  }, [selectedSubject]);

  const fetchRoadmap = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/roadmap/class12/${selectedSubject}`
      );
      const json = await res.json();
      setData(json.data || json);
    } catch (e) {
      console.error("Roadmap error", e);
    } finally {
      setLoading(false);
    }
  };

  const toggleChapter = (moduleId, chapterId) => {
    setData((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              chapters: m.chapters.map((c) =>
                c.id === chapterId
                  ? { ...c, completed: !c.completed }
                  : c
              ),
            }
          : m
      )
    );
  };

  const progress = (chapters) =>
    Math.round(
      (chapters.filter((c) => c.completed).length / chapters.length) * 100
    ) || 0;

  return (
    <div className="roadmap">
      {/* HEADER */}
      <div className="roadmap-header">
        <h1>Learning Path</h1>
        <p>Class 12 • {selectedSubject.toUpperCase()}</p>
      </div>

      {/* SUBJECT SWITCH */}
      <div className="subject-bar">
        {SUBJECTS.map((s) => (
          <button
            key={s.value}
            className={
              selectedSubject === s.value ? "subject active" : "subject"
            }
            onClick={() => {
              setSelectedSubject(s.value);
              setSelectedModule(null);
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loader">Loading roadmap...</div>
      ) : (
        <div className="timeline">
          {data.map((m) => (
            <div
              key={m.id}
              className="module-card"
              style={{ borderLeftColor: m.color }}
              onClick={() => setSelectedModule(m)}
            >
              <div className="module-top">
                <span className="tag" style={{ color: m.color }}>
                  {m.tag}
                </span>
                <span className="percent">{progress(m.chapters)}%</span>
              </div>

              <h3>{m.title}</h3>
              <p>{m.chapters.length} Lessons</p>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {selectedModule && (
        <div className="modal-overlay" onClick={() => setSelectedModule(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedModule.title}</h2>
            <p>Mark chapters as completed</p>

            {selectedModule.chapters.map((c) => (
              <div
                key={c.id}
                className={c.completed ? "chapter done" : "chapter"}
                onClick={() => toggleChapter(selectedModule.id, c.id)}
              >
                <input type="checkbox" checked={c.completed} readOnly />
                {c.title}
              </div>
            ))}

            <button className="save-btn" onClick={() => setSelectedModule(null)}>
              Save Progress
            </button>
          </div>
        </div>
      )}
    </div>
  );
}