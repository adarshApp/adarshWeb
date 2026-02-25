import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Trophy,
  Rocket,
  School,
  Compass,
  ShieldCheck,
  Stethoscope,
  Gem,
  CalendarDays,
  X,
  Trash2,
} from "lucide-react";
import "./trackExam.css";

export default function TrackExam() {
  const navigate = useNavigate();

  const [examData, setExamData] = useState([
    { id: "1", exam: "JEE Main", date: "April 2", website: "https://jeemain.nta.nic.in/", icon: <Trophy />, isPreparing: false, daysLeft: 0 },
    { id: "2", exam: "JEE Advanced", date: "May 18", website: "https://jeeadv.ac.in/", icon: <Rocket />, isPreparing: false, daysLeft: 0 },
    { id: "3", exam: "Board Exam", date: "February 15", website: "https://cbse.gov.in/", icon: <School />, isPreparing: false, daysLeft: 0 },
    { id: "4", exam: "WBJEE", date: "April 28", website: "https://wbjeeb.nic.in/", icon: <Compass />, isPreparing: false, daysLeft: 0 },
    { id: "5", exam: "NDA", date: "April 12", website: "https://upsc.gov.in/", icon: <ShieldCheck />, isPreparing: false, daysLeft: 0 },
    { id: "6", exam: "NEET", date: "May 5", website: "https://neet.nta.nic.in/", icon: <Stethoscope />, isPreparing: false, daysLeft: 0 },
    { id: "7", exam: "BITSAT", date: "May 22", website: "https://www.bitsadmission.com/", icon: <Gem />, isPreparing: false, daysLeft: 0 },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [inputDate, setInputDate] = useState("");
  const [inputYear, setInputYear] = useState("2026");

  const calculateDaysLeft = (date, year) => {
    const examDate = new Date(`${date} ${year}`);
    const today = new Date();
    const diff = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const openModal = (exam) => {
    setSelectedExam(exam);
    setInputDate(exam.date);
    setModalOpen(true);
  };

  const handleTrack = () => {
    if (!selectedExam) return;

    const days = calculateDaysLeft(inputDate, inputYear);

    setExamData((prev) =>
      prev.map((e) =>
        e.id === selectedExam.id
          ? { ...e, isPreparing: true, daysLeft: days, date: inputDate }
          : e
      )
    );

    setModalOpen(false);
  };

  const handleUntrack = () => {
    setExamData((prev) =>
      prev.map((e) =>
        e.id === selectedExam.id
          ? { ...e, isPreparing: false, daysLeft: 0 }
          : e
      )
    );
    setModalOpen(false);
    alert(`Stopped tracking ${selectedExam.exam}`);
  };

  return (
    <div className="track-container">
      {/* HEADER */}
      <div className="track-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ChevronLeft size={18} />
        </button>
        <h1>🎓 Exam Portal</h1>
      </div>

      {/* ACTIVE COUNTDOWNS */}
      <h3 className="section-label">Active Countdowns</h3>
      <div className="horizontal-scroll">
        {examData.filter((e) => e.isPreparing).length === 0 ? (
          <div className="empty-card">No exams being tracked yet.</div>
        ) : (
          examData
            .filter((e) => e.isPreparing)
            .map((item) => (
              <div
                key={item.id}
                className="countdown-card"
                onClick={() => openModal(item)}
              >
                <div className="countdown-header">
                  <CalendarDays size={14} />
                  <span>Days Left</span>
                </div>
                <div className="days-count">{item.daysLeft}</div>
                <div className="exam-name">{item.exam}</div>
                <div className="exam-date">
                  {item.date}, {inputYear}
                </div>
              </div>
            ))
        )}
      </div>

      {/* ALL EXAMS */}
      <h3 className="section-label">Browse All Exams</h3>
      {examData.map((item) => (
        <div key={item.id} className="exam-row">
          <div className="exam-icon">{item.icon}</div>

          <div className="exam-info">
            <h4>{item.exam}</h4>
            <a href={item.website} target="_blank" rel="noreferrer">
              Official Website
            </a>
          </div>

          <button
            className={`track-btn ${item.isPreparing ? "active" : ""}`}
            onClick={() => openModal(item)}
          >
            {item.isPreparing ? "Edit" : "Track"}
          </button>
        </div>
      ))}

      {/* MODAL */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>Tracking Details</h2>
                <p>{selectedExam?.exam}</p>
              </div>
              <button onClick={() => setModalOpen(false)}>
                <X />
              </button>
            </div>

            <label>Exam Date</label>
            <input
              value={inputDate}
              onChange={(e) => setInputDate(e.target.value)}
              placeholder="April 15"
            />

            <label>Exam Year</label>
            <input
              value={inputYear}
              onChange={(e) => setInputYear(e.target.value)}
              placeholder="YYYY"
            />

            <div className="modal-actions">
              {selectedExam?.isPreparing && (
                <button className="untrack-btn" onClick={handleUntrack}>
                  <Trash2 size={16} /> Untrack
                </button>
              )}

              <button className="confirm-btn" onClick={handleTrack}>
                {selectedExam?.isPreparing
                  ? "Update Tracking"
                  : "Start Tracking"}
              </button>
            </div>

            <button className="cancel-btn" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}