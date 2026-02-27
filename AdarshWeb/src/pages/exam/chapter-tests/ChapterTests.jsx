import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  PlayCircle,
  BarChart3,
  Clock,
  BookOpen,
} from "lucide-react";
import { API_BASE_URL } from "../../../config/api";
import "./chapterTests.css";

/* ================= HELPERS ================= */

function splitByType(tests = []) {
  return {
    medium: tests.filter((t) => t.type !== "full-mock"),
    fullMock: tests.filter((t) => t.type === "full-mock"),
  };
}

/* ================= COMPONENT ================= */

export default function ChapterTests() {
  const navigate = useNavigate();

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastResult, setLastResult] = useState(null);

  useEffect(() => {
    loadTests();
    loadLastResult();
  }, []);

  /* -------- LOAD TESTS -------- */
  async function loadTests() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/tests/all/all`);
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setGroups(json.groups || []);
    } catch {
      setGroups([]);
    } finally {
      setLoading(false);
    }
  }

  /* -------- LOAD LAST RESULT -------- */
  async function loadLastResult() {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/api/results/last`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const json = await res.json();
        setLastResult(json);
      }
    } catch {}
  }

  /* -------- START TEST -------- */
  function startTest(test) {
    navigate(
      `/exam/${test.exam}/test/${test.subject}/${test.id}`,
    );
  }

  if (loading) {
    return <div className="center">Preparing your tests…</div>;
  }

  return (
    <div className="chapter-tests-page">
      {/* HEADER */}
      <div className="page-header">
        <button className="icon-btn" onClick={() => navigate(-1)}>
          <ChevronLeft />
        </button>
        <div>
          <h2>Practice Portal</h2>
          <p>Select a test to begin</p>
        </div>
      </div>

      {/* PERFORMANCE */}
      <div className="performance-card">
        <div className="icon-circle">
          <BarChart3 size={20} />
        </div>
        <div>
          <span>Recent Performance</span>
          <p>
            Score:{" "}
            <b>
              {lastResult
                ? `${lastResult.score}/${lastResult.totalMarks}`
                : "--"}
            </b>{" "}
            • Accuracy:{" "}
            <b>{lastResult ? `${lastResult.accuracy}%` : "--"}</b>
          </p>
        </div>
      </div>

      {/* TEST GROUPS */}
      {groups.map((group) => {
        const { medium, fullMock } = splitByType(group.tests);

        return (
          <div key={group.exam} className="test-group">
            <h3>{group.title}</h3>

            {medium.length > 0 && (
              <>
                <span className="group-label">CHAPTER PRACTICE</span>
                {medium.map((test) => (
                  <TestCard
                    key={test.id}
                    test={test}
                    onStart={startTest}
                  />
                ))}
              </>
            )}

            {fullMock.length > 0 && (
              <>
                <span className="group-label">FULL MOCKS</span>
                {fullMock.map((test) => (
                  <TestCard
                    key={test.id}
                    test={test}
                    onStart={startTest}
                  />
                ))}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ================= TEST CARD ================= */

function TestCard({ test, onStart }) {
  return (
    <div className="test-card" onClick={() => onStart(test)}>
      <div className="test-info">
        <h4>{test.title}</h4>
        <div className="meta">
          <span>
            <BookOpen size={12} /> {test.questions ?? 0} Qs
          </span>
          <span>
            <Clock size={12} /> {test.duration ?? 30} mins
          </span>
        </div>
      </div>
      <PlayCircle size={20} />
    </div>
  );
}