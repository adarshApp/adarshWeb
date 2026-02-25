import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ArrowRight,
  Search,
  Trophy,
  Rocket,
  School,
  Compass,
  Globe,
  Gem,
  Microscope,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import "./examList.css";

const examCards = [
  {
    id: "1",
    exam: "JEE Main",
    desc: "NTA National Exam",
    tags: ["B.Tech", "Govt"],
    route: "/exam/jee-main",
    icon: <Trophy size={18} color="#4F46E5" />,
  },
  {
    id: "2",
    exam: "JEE Advanced",
    desc: "IIT Entrance",
    tags: ["IIT", "Premium"],
    route: "/exam/jee-advanced",
    icon: <Rocket size={18} color="#0EA5E9" />,
  },
  {
    id: "3",
    exam: "Board Exam",
    desc: "CBSE & State Boards",
    tags: ["Academic"],
    route: "/exam/boards",
    icon: <School size={18} color="#8B5CF6" />,
  },
  {
    id: "4",
    exam: "WBJEE",
    desc: "West Bengal Engg",
    tags: ["Regional"],
    route: "/exam/wbjee",
    icon: <Compass size={18} color="#EC4899" />,
  },
  {
    id: "5",
    exam: "OJEE",
    desc: "Odisha Entrance",
    tags: ["State"],
    route: "/exam/ojee",
    icon: <Globe size={18} color="#F59E0B" />,
  },
  {
    id: "6",
    exam: "IISER",
    desc: "Research Institutes",
    tags: ["Govt"],
    route: "/exam/iiser",
    icon: <Gem size={18} color="#10B981" />,
  },
  {
    id: "7",
    exam: "NISER",
    desc: "Research Science",
    tags: ["Science"],
    route: "/exam/niser",
    icon: <Microscope size={18} color="#6366F1" />,
  },
  {
    id: "8",
    exam: "NDA",
    desc: "Defence Academy",
    tags: ["Defence"],
    route: "/exam/nda",
    icon: <ShieldCheck size={18} color="#1E293B" />,
  },
  {
    id: "9",
    exam: "NEET",
    desc: "Medical Entrance",
    tags: ["MBBS"],
    route: "/exam/neet",
    icon: <Stethoscope size={18} color="#F43F5E" />,
  },
];

export default function ExamIndex() {
  const navigate = useNavigate();

  return (
    <div className="exam-container">
      {/* Header */}
      <div className="exam-header">
        <div className="top-bar">
          <button className="icon-btn" onClick={() => navigate(-1)}>
            <ChevronLeft size={22} />
          </button>
          <button className="icon-btn">
            <Search size={20} />
          </button>
        </div>

        <h1>Curated Exams</h1>
        <p>Select your primary academic target</p>
      </div>

      {/* Grid */}
      <div className="exam-grid">
        {examCards.map((item) => (
          <div
            key={item.id}
            className="exam-card"
            onClick={() => navigate(item.route)}
          >
            <div className="card-header">
              <div className="icon-circle">{item.icon}</div>
              <span className="active-dot" />
            </div>

            <h3>{item.exam}</h3>
            <p className="desc">{item.desc}</p>

            <div className="tags">
              {item.tags.map((tag, i) => (
                <span key={i} className="tag">
                  {tag}
                </span>
              ))}
            </div>

            <div className="card-footer">
              <span>Explore</span>
              <ArrowRight size={14} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}