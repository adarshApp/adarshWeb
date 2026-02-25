import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ClipboardList, BookOpen } from "lucide-react";
import { API_BASE_URL } from "../../../config/api";
import "./chapterDetail.css";

export default function ChapterDetail() {
  const navigate = useNavigate();
  const { examName, chapterId } = useParams();
  const [searchParams] = useSearchParams();

  const subject = searchParams.get("subject");

  const [chapterData, setChapterData] = useState(null);
  const [loading, setLoading] = useState(true);

  /* -------- Fetch chapter -------- */
  useEffect(() => {
    if (!examName || !chapterId || !subject) return;
    loadChapter();
  }, [examName, chapterId, subject]);

  async function loadChapter() {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/exam-content/${examName}/${subject}/${chapterId}`,
      );
      if (!res.ok) throw new Error("Not found");
      const json = await res.json();
      setChapterData(json);
    } catch {
      setChapterData(null);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="center">Loading chapter…</div>;
  }

  if (!chapterData) {
    return <div className="center error">Chapter not found.</div>;
  }

  return (
    <div className="chapter-page">
      {/* Header */}
      <div className="chapter-header">
        <button className="icon-btn" onClick={() => navigate(-1)}>
          <ChevronLeft />
        </button>
        <h2 className="chapter-header-title">{chapterData.title}</h2>
      </div>

      {/* Content */}
      <div className="chapter-content">
        {/* Intro */}
        <div className="chapter-card">
          <h3>{chapterData.title}</h3>
          <p>
            {chapterData.description ||
              "Chapter overview and practice section"}
          </p>
        </div>

        {/* Chapter Test */}
        <div
          className="action-card"
          onClick={() =>
            navigate(
              `/exam/${examName}/chapter-tests?chapter=${chapterId}`,
            )
          }
        >
          <ClipboardList size={22} color="#10B981" />
          <div>
            <h4>Start Chapter Test</h4>
            <span>Attempt practice questions</span>
          </div>
        </div>

        {/* PYQs */}
        <div
          className="action-card"
          onClick={() =>
            navigate(
              `/exam/${examName}/pyqs?subject=${subject}&chapter=${chapterId}`,
            )
          }
        >
          <BookOpen size={22} color="#4F46E5" />
          <div>
            <h4>View PYQs</h4>
            <span>Previous year questions</span>
          </div>
        </div>
      </div>
    </div>
  );
}