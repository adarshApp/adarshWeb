import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./greetingPage.css";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.95,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function GreetingPage2() {
  const navigate = useNavigate(); // ✅ hook INSIDE component

  return (
    <div className="greeting-wrapper">
      {/* BOARD */}
      <motion.div
        className="greeting-board"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* CARD 1 */}
        <motion.div className="pin-card blue" variants={cardVariants}>
          <span className="pin blue-pin"></span>
          <h4>01</h4>
          <h3>Understand Basics</h3>
          <p>Clear your concepts before moving forward.</p>
        </motion.div>

        {/* CARD 2 */}
        <motion.div className="pin-card red" variants={cardVariants}>
          <span className="pin red-pin"></span>
          <h4>02</h4>
          <h3>Practice Daily</h3>
          <p>Small daily practice builds confidence.</p>
        </motion.div>

        {/* CARD 3 */}
        <motion.div className="pin-card green" variants={cardVariants}>
          <span className="pin green-pin"></span>
          <h4>03</h4>
          <h3>Track Progress</h3>
          <p>Know where you stand before exams.</p>
        </motion.div>

        {/* CARD 4 */}
        <motion.div className="pin-card pink" variants={cardVariants}>
          <span className="pin pink-pin"></span>
          <h4>04</h4>
          <h3>Revise Smartly</h3>
          <p>Revision is more powerful than learning.</p>
        </motion.div>

        {/* CARD 5 */}
        <motion.div className="pin-card mint" variants={cardVariants}>
          <span className="pin mint-pin"></span>
          <h4>05</h4>
          <h3>Take Tests</h3>
          <p>Tests reveal your real preparation level.</p>
        </motion.div>
      </motion.div>

      {/* TEXT BELOW */}
      <motion.p
        className="greeting-text"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <strong>Padhai mushkil nahi hota</strong>{" "}
        <span>approach galat hota hai</span>
      </motion.p>

      {/* CONTINUE BUTTON */}
      <motion.button
        className="greeting-continue-btn"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.4 }}
        onClick={() => navigate("/login")}
      >
        Get Started
      </motion.button>
    </div>
  );
}