import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, LogOut, Settings, Bell, Award } from "lucide-react";
import "./ProfilePage.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const avatarList = [
  "/avatars/avatar1.png",
  "/avatars/avatar2.png",
  "/avatars/avatar3.png",
  "/avatars/avatar4.png",
  "/avatars/avatar5.png",
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const isLoggingOut = useRef(false);

  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState({
    streak: 0,
    completed: 0,
    total: 100, 
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadProfile() {
      try {
        const token = localStorage.getItem("token");
        const guestId = localStorage.getItem("guestId");

        if (guestId && !token) {
          if (!mounted) return;
          setUser({
            name: "Guest User",
            email: "Guest Mode",
            avatarIndex: 0,
            isGuest: true,
          });
          setLoading(false);
          return;
        }

        if (!token) {
          navigate("/login", { replace: true });
          return;
        }

        const profileRes = await fetch(`${API_BASE_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!profileRes.ok) throw new Error("Profile failed");
        const profileData = await profileRes.json();
        if (!mounted) return;
        setUser(profileData);

        try {
          const progressRes = await fetch(`${API_BASE_URL}/api/progress`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (progressRes.ok) {
            const p = await progressRes.json();
            setProgress({
              streak: p.streak || 0,
              completed: p.completedChapters?.length || 0,
              total: p.totalChapters || 100, 
            });
          }
        } catch {}
      } catch {
        console.error("Profile load failed");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadProfile();
    return () => (mounted = false);
  }, [navigate]);

  async function changeAvatar() {
    const token = localStorage.getItem("token");
    const newIndex = Math.floor(Math.random() * avatarList.length);
    setUser((prev) => ({ ...prev, avatarIndex: newIndex }));
    if (token) {
      fetch(`${API_BASE_URL}/api/user/set-avatar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ avatarIndex: newIndex }),
      }).catch(() => {});
    }
  }

  function logout() {
    if (isLoggingOut.current) return;
    isLoggingOut.current = true;
    localStorage.clear();
    navigate("/login", { replace: true });
    setTimeout(() => (isLoggingOut.current = false), 500);
  }

  if (loading) return (
    <div className="loader-overlay">
      <div className="custom-spinner" />
    </div>
  );
  if (!user) return null;

  const safeAvatar = user.avatarIndex >= 0 && user.avatarIndex < avatarList.length ? user.avatarIndex : 0;
  const progressPercent = (progress.completed / (progress.total || 1)) * 100;

  return (
    <div className="advanced-profile-container">
      {/* 1. BACKGROUND LAYERS */}
      <div className="background-grid-layer" />
      
      {/* Floating 3D Voxel Elements - Renamed Class to avoid errors */}
      <div className="voxel-floating atom" aria-hidden="true">⚛️</div>
      <div className="voxel-floating books" aria-hidden="true">📚</div>
      <div className="voxel-floating brain" aria-hidden="true">🧠</div>
      <div className="voxel-floating rocket" aria-hidden="true">🚀</div>

      {/* 2. NAVIGATION BAR */}
      <nav className="glass-navbar">
        <button className="back-arrow-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} strokeWidth={2.5} />
        </button>
        <h3>User Profile</h3>
        <div style={{ width: 44 }} /> 
      </nav>

      {/* 3. MAIN CONTENT */}
      <main className="profile-wrapper">
        <section className="profile-hero-card">
          <div className="avatar-wrapper" onClick={changeAvatar}>
            <img src={avatarList[safeAvatar]} alt="avatar" className="main-avatar-img" />
            <div className="shuffle-icon-badge">
              <RefreshCw size={14} />
            </div>
          </div>
          <h2 className="user-name-title">{user.name}</h2>
          <p className="user-email-subtitle">{user.email}</p>
        </section>

        <section className="stats-glass-row">
          <div className="stat-card">
            <Award className="stat-icon" size={24} color="#3b82f6" />
            <div className="stat-text">
              <h4>{progress.streak}</h4>
              <span>DAY STREAK</span>
            </div>
          </div>
          <div className="stat-card progress-card">
            <div className="stat-text">
              <h4>{progress.completed}/{progress.total}</h4>
              <span>CHAPTERS</span>
            </div>
            <div className="mini-progress-bar">
              <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </section>

        <section className="settings-glass-card">
          <div className="setting-action-item">
            <Settings size={20} />
            <span>General Settings</span>
          </div>
          <div className="setting-action-item">
            <Bell size={20} />
            <span>Notification Preferences</span>
          </div>
          <div className="setting-action-item danger-item" onClick={logout}>
            <LogOut size={20} />
            <span>Logout Account</span>
          </div>
        </section>

        <footer className="advanced-footer">
          <div className="footer-line" />
          <p>Adarsh Learning Workspace v1.2</p>
          <p>Powered by Nanotech Labs — Burla</p>
        </footer>
      </main>
    </div>
  );
}