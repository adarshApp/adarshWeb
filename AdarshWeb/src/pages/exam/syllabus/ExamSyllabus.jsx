import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { API_BASE_URL } from "../../../config/api";
import "./examSyllabus.css";

/* SUBJECT → ROUTE MAP */
const SUBJECT_ROUTE_MAP = {
  physics: "physics",
  Physics: "physics",
  maths: "maths",
  Maths: "maths",
  mathematics: "maths",
  Mathematics: "maths",
  chemistry: "chemistry",
  Chemistry: "chemistry",
  Biology: "biology",
  biology: "biology",
};

export default function ExamSyllabus() {
  const { examName } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (examName) loadSyllabus();
  }, [examName]);

  async function loadSyllabus() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/exam-syllabus/${examName}`);
      if (!res.ok) throw new Error();
      const json = await res.json();
      setData(json);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="center">Loading syllabus…</div>;
  }

  const currentSubject = data?.subjects?.[activeIndex];
  const subjectId =
    SUBJECT_ROUTE_MAP[currentSubject?.id] ||
    SUBJECT_ROUTE_MAP[currentSubject?.title];

  if (!currentSubject || !subjectId) {
    return <div className="center">Invalid subject route</div>;
  }

  return (
    <div className="exam-page">
      {/* Header */}
      <div className="exam-header-bar">
        <button className="icon-btn" onClick={() => navigate(-1)}>
          <ChevronLeft />
        </button>
        <h2>{examName.toUpperCase()}</h2>
        <div style={{ width: 40 }} />
      </div>

      {/* Subject Tabs */}
      <div className="subject-tabs">
        {data.subjects.map((sub, index) => (
          <button
            key={index}
            className={`subject-tab ${index === activeIndex ? "active" : ""}`}
            onClick={() => setActiveIndex(index)}
          >
            {sub.title}
          </button>
        ))}
      </div>

      {/* Chapters */}
      <div className="chapter-list">
        {currentSubject.chapters.map((item, index) => {
          const chapterId =
            typeof item === "string"
              ? item.toLowerCase().replace(/\s+/g, "-")
              : item.id;

          const title = typeof item === "string" ? item : item.title;

          return (
            <div
              key={index}
              className="chapter-card"
              onClick={() =>
                navigate(
                  `/exam/${examName}/chapter/${chapterId}?subject=${subjectId}`,
                )
              }
            >
              <div className="chapter-number">{index + 1}</div>
              <span className="chapter-title">{title}</span>
              <ChevronRight size={18} />
            </div>
          );
        })}
      </div>
    </div>
  );
}