import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Sparkles,
  Frown,
  TrendingUp,
  Target,
  School,
} from "lucide-react";
import "./rankPredictor.css";

/* -------- Greeting Logic Not Needed Here -------- */

export default function RankPredictor() {
  const navigate = useNavigate();

  const [physics, setPhysics] = useState("");
  const [chemistry, setChemistry] = useState("");
  const [maths, setMaths] = useState("");

  const [results, setResults] = useState(null);

  const calculateRank = () => {
    const p = parseFloat(physics) || 0;
    const c = parseFloat(chemistry) || 0;
    const m = parseFloat(maths) || 0;

    const totalScore = p + c + m;
    const totalCandidates = 1200000;

    let percentile = (totalScore / 300) * 100;
    if (percentile > 99.9) percentile = 99.99;

    const rank = Math.floor(((100 - percentile) / 100) * totalCandidates);

    let status = "Keep Pushing! 💪";
    let colleges = ["Local Engineering Colleges", "Private Universities"];

    if (rank < 5000) {
      status = "Absolutely Elite! 🏆";
      colleges = ["IIT Bombay", "IIT Delhi", "IIT Madras"];
    } else if (rank < 20000) {
      status = "You're Going Well! 🚀";
      colleges = ["NIT Trichy", "NIT Surathkal", "BITS Pilani"];
    } else if (rank < 50000) {
      status = "On the Right Track! 📈";
      colleges = ["DTU Delhi", "NIT Rourkela", "VIT Vellore"];
    }

    setResults({
      total: totalScore,
      percentile: percentile.toFixed(2),
      rank,
      status,
      colleges,
    });
  };

  return (
    <div className="rank-container">
      {/* ===== HEADER ===== */}
      <div className="rank-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ChevronLeft size={22} />
        </button>
        <h2>Rank Predictor</h2>
      </div>

      {/* ===== INPUT CARD ===== */}
      <div className="glass-card">
        <div className="card-header">
          <Target size={18} color="#6366F1" />
          <h3>Exam Scores</h3>
        </div>

        <Input
          label="Physics"
          value={physics}
          onChange={setPhysics}
        />
        <Input
          label="Chemistry"
          value={chemistry}
          onChange={setChemistry}
        />
        <Input
          label="Mathematics"
          value={maths}
          onChange={setMaths}
        />

        <button className="predict-btn" onClick={calculateRank}>
          Predict Now <Sparkles size={18} />
        </button>
      </div>

      {/* ===== RESULTS ===== */}
      {results && (
        <div className="result-section fade-in">
          <div className="status-badge">{results.status}</div>

          <div className="rank-main-card">
            <p className="rank-label">Estimated AIR</p>
            <h1 className="rank-value">
              #{results.rank.toLocaleString()}
            </h1>

            <div className="percentile-badge">
              <TrendingUp size={14} />
              <span>{results.percentile} Percentile</span>
            </div>
          </div>

          <h4 className="sub-heading">Top Probable Colleges</h4>

          <div className="college-list">
            {results.colleges.map((college, i) => (
              <div key={i} className="college-item">
                <div className="college-icon">
                  <School size={16} />
                </div>
                <span>{college}</span>
              </div>
            ))}
          </div>

          {results.rank > 100000 && (
            <div className="motivation-card">
              <Frown size={18} />
              <p>
                Don’t lose hope. Consistent effort leads to great results!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* -------- Reusable Input -------- */
function Input({ label, value, onChange }) {
  return (
    <div className="input-group">
      <label>{label}</label>
      <input
        type="number"
        placeholder="Score / 100"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}