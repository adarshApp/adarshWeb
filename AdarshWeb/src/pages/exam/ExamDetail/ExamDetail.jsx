import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft,
  BookOpen,
  ClipboardList,
  Target,
  FileText,
} from "lucide-react";
import "./examDetail.css";

export default function ExamDetail() {
  const navigate = useNavigate();
  const { examName } = useParams();

  // Convert URL param to readable title
  const title =
    examName
      ?.split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ") || "Exam";

  return (
    <div className="exam-detail-container">
      {/* Header */}
      <div className="exam-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ChevronLeft size={22} />
        </button>
        <h2 className="exam-title">{title}</h2>
      </div>

      {/* Body */}
      <div className="exam-body">
        {/* Hero Card */}
        <div className="hero-card">
          <h3>{title} Preparation</h3>
          <p>Track syllabus, tests, and daily practice here.</p>
        </div>

        {/* Syllabus */}
        <div
          className="feature-card"
          onClick={() => navigate(`/exam/${examName}/syllabus`)}
        >
          <BookOpen size={20} className="icon blue" />
          <div>
            <h4>Syllabus</h4>
            <p>View full syllabus roadmap</p>
          </div>
        </div>

        {/* Practice Tests */}
        <div
          className="feature-card"
          onClick={() => navigate(`/exam/${examName}/chapter-tests`)}
        >
          <ClipboardList size={20} className="icon green" />
          <div>
            <h4>Practice Tests</h4>
            <p>Attempt chapter wise tests</p>
          </div>
        </div>

        {/* Daily Target */}
        <div
          className="feature-card"
          onClick={() => navigate(`/exam/${examName}/pyqs`)}
        >
          <Target size={20} className="icon yellow" />
          <div>
            <h4>Daily Target</h4>
            <p>Set your study goal</p>
          </div>
        </div>

        {/* Study Materials */}
        <div
          className="feature-card"
          onClick={() => navigate(`/exam/${examName}/materials`)}
        >
          <FileText size={20} className="icon red" />
          <div>
            <h4>Study Materials</h4>
            <p>Physics, Chemistry, Maths PDFs</p>
          </div>
        </div>
      </div>
    </div>
  );
}