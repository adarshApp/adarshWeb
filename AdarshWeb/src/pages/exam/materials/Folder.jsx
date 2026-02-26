import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ChevronLeft, Folder, FileText, Search, MoreVertical } from "lucide-react";
import "./folder.css";

export default function FolderPage() {
  const navigate = useNavigate();
  const { examName } = useParams();
  const { state } = useLocation();

  const title = state?.title || "Study Materials";
  const data = state?.data || {};
  const entries = Object.entries(data);

  return (
    <div className="folder-layout">
      {/* iOS Style Glass Header */}
      <header className="folder-header">
        <div className="header-top">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ChevronLeft size={24} />
          </button>
          <button className="menu-btn">
            <MoreVertical size={20} />
          </button>
        </div>
        <div className="header-content">
          <span className="breadcrumb">{examName?.toUpperCase()}</span>
          <h1 className="folder-title">{title}</h1>
        </div>
      </header>

      {/* Grid List */}
      <main className="folder-container">
        <div className="grid-grid">
          {entries.map(([key, value]) => {
            const isPdf = typeof value === "string";

            return (
              <div
                key={key}
                className={`content-card ${isPdf ? "pdf-card" : "dir-card"}`}
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
                <div className="icon-wrapper">
                  {isPdf ? (
                    <FileText size={32} className="pdf-icon" />
                  ) : (
                    <Folder size={32} className="folder-icon" />
                  )}
                </div>
                <div className="card-info">
                  <span className="item-name">{key}</span>
                  <span className="item-subtext">
                    {isPdf ? "PDF Document" : "Folder"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}