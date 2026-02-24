import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import GreetingPage from "./pages/greeting/GreetingPage";
import LoginPage from "./pages/loginpage/LoginPage";
import HomePage from "./pages/homePage/HomePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/greet" replace />} />
        <Route path="/greet" element={<GreetingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;