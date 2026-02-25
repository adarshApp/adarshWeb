import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ChevronLeft, Folder, FileText } from "lucide-react";
import "./folder.css";

export default function FolderPage() {
  const navigate = useNavigate();
  const { examName } = useParams();
  const { state } = useLocation();

  const title = state?.title || "Contents";
  const data = state?.data || {};

  const entries = Object.entries(data);

  return (
    <div className="folder-page">
      {/* Header */}
      <div className="folder-header">
        <button className="icon-btn" onClick={() => navigate(-1)}>
          <ChevronLeft />
        </button>
        <h2>{title}</h2>
      </div>

      {/* List */}
      <div className="folder-list">
        {entries.map(([key, value]) => {
          const isPdf = typeof value === "string";

          return (
            <div
              key={key}
              className="folder-card"
              onClick={() => {
                if (isPdf) {
                  navigate(`/exam/${examName}/pdf`, {
                    state: { pdfUrl: value, title: key },
                  });
                } else {
                  navigate(`/exam/${examName}/folder`, {
                    state: { title: key, data: value },
                  });
                }
              }}
            >
              {isPdf ? (
                <FileText size={22} color="#2563EB" />
              ) : (
                <Folder size={22} color="#64748B" />
              )}

              <span className="folder-text">{key}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}