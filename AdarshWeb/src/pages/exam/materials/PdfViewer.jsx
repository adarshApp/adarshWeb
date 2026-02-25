import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import "./pdfViewer.css";

export default function PdfViewer() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const pdfUrl = state?.pdfUrl;

  if (!pdfUrl) {
    return (
      <div className="pdf-error">
        <p>PDF not found.</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  const googleViewerUrl = `https://drive.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(
    pdfUrl
  )}`;

  return (
    <div className="pdf-page">
      {/* Header */}
      <div className="pdf-header">
        <button className="icon-btn" onClick={() => navigate(-1)}>
          <ChevronLeft size={22} />
        </button>
        <h2>PDF Viewer</h2>
      </div>

      {/* PDF */}
      <iframe
        src={googleViewerUrl}
        title="PDF Viewer"
        className="pdf-frame"
        allow="autoplay"
      />
    </div>
  );
}