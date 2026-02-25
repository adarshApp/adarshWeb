import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import "./dailyQuiz.css";
import { API_BASE_URL } from "../../config/api";

export default function DailyQuiz() {
  const navigate = useNavigate();

  const [quizQuestions, setQuizQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    fetchQuiz();
  }, []);

  const fetchQuiz = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/daily-quiz`);
      const data = await res.json();
      setQuizQuestions(data);
    } catch (err) {
      console.error("Quiz load error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="quiz-loader">
        <div className="spinner" />
      </div>
    );
  }

  if (!quizQuestions.length) {
    return (
      <div className="quiz-loader">
        <p>No Questions Available</p>
      </div>
    );
  }

  const currentQuestion = quizQuestions[currentIndex];

  const handleOptionPress = (option) => {
    if (!showAnswer) {
      setSelectedOption(option);
      setShowAnswer(true);
    }
  };

  const handleNext = () => {
    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowAnswer(false);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="quiz-container">
      <div className="quiz-card-wrapper">
        <div className="quiz-shadow" />

        <div className="quiz-card">
          {/* HEADER */}
          <div className="quiz-header">
            <span className="question-id">
              QUESTION {currentIndex + 1}
            </span>

            <button className="close-btn" onClick={() => navigate(-1)}>
              <X size={18} />
            </button>
          </div>

          {/* CONTENT */}
          <div key={currentQuestion.id} className="quiz-content fade-slide">
            <h2 className="question-text">
              {currentQuestion.question}
            </h2>

            {currentQuestion.options.map((option) => (
              <div
                key={option}
                className="option-row"
                onClick={() => handleOptionPress(option)}
              >
                <div className="radio-outer">
                  {selectedOption === option && (
                    <div className="radio-inner" />
                  )}
                </div>
                <span className="option-text">{option}</span>
              </div>
            ))}

            {showAnswer && (
              <p className="answer-text">
                Correct Answer: {currentQuestion.answer}
              </p>
            )}
          </div>

          {/* FOOTER */}
          <div className="quiz-footer">
            <button
              className={`next-btn ${
                !showAnswer ? "disabled" : ""
              }`}
              onClick={handleNext}
              disabled={!showAnswer}
            >
              {currentIndex === quizQuestions.length - 1
                ? "Finish"
                : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}