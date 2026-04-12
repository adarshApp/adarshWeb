import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft,
  Folder,
  Atom,
  FlaskConical,
  Sigma,
  Dna,
} from "lucide-react";
import "./materials.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function Materials() {
  const { examName } = useParams();
  const navigate = useNavigate();

  const [materials, setMaterials] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/pdfs/${examName}`)
      .then((res) => res.json())
      .then((json) => {
        const normalized = {};
        Object.keys(json.subjects || {}).forEach((s) => {
          normalized[s.toLowerCase()] = json.subjects[s];
        });
        setMaterials(normalized);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [examName]);

  if (loading) {
    return <div className="center">Loading materials…</div>;
  }

  const SUBJECTS = [
    { key: "physics", label: "Physics", icon: <Atom />, color: "blue" },
    { key: "chemistry", label: "Chemistry", icon: <FlaskConical />, color: "green" },
    { key: "math", label: "Mathematics", icon: <Sigma />, color: "purple" },
    { key: "maths", label: "Mathematics", icon: <Sigma />, color: "purple" },
    { key: "mathematics", label: "Mathematics", icon: <Sigma />, color: "purple" },
    { key: "biology", label: "Biology", icon: <Dna />, color: "red" },
  ];

  const available = SUBJECTS.filter((s) => materials?.[s.key]);

  return (
    <div className="materials-page">
      {/* Header */}
      <div className="materials-header">
        <button className="icon-btn" onClick={() => navigate(-1)}>
          <ChevronLeft />
        </button>
        <h2>Study Materials</h2>
      </div>

      {available.length === 0 ? (
        <div className="empty-state">
          <Folder size={64} />
          <h3>No Study Materials</h3>
          <p>Materials for this exam will be added soon.</p>
        </div>
      ) : (
        <div className="materials-list">
          {available.map((subject) => (
            <div
              key={subject.key}
              className={`subject-card ${subject.color}`}
              onClick={() =>
                navigate(`/exam/${examName}/folder`, {
                  state: {
                    title: subject.label,
                    data: materials[subject.key],
                  },
                })
              }
            >
              <div className="folder-icon">
                <Folder />
              </div>

              <div className="subject-info">
                <h3>{subject.label}</h3>
                <span>View contents</span>
              </div>

              <div className="subject-icon">{subject.icon}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}