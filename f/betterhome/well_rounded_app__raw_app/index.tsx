import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { backend } from "./wmill";

const CORRECT_USERNAME = "niha";
const CORRECT_PIN = "05010308";

export default function App() {
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const [youtubeEnabled, setYoutubeEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleLogin = () => {
    if (username === CORRECT_USERNAME && pin === CORRECT_PIN) {
      setLoggedIn(true);
      setError("");
    } else {
      setError("❌ Incorrect username or PIN. Please try again.");
    }
  };

  const handleToggle = async () => {
    const newState = !youtubeEnabled;
    setYoutubeEnabled(newState);
    setStatusMessage("");

    if (newState) {
      setLoading(true);
      try {
        await backend.enableYoutubeAccess();
        setStatusMessage("✅ YouTube access has been enabled successfully!");
      } catch (e) {
        setStatusMessage("⚠️ Failed to enable YouTube access. Please try again.");
        setYoutubeEnabled(false);
      } finally {
        setLoading(false);
      }
    } else {
      setStatusMessage("🔴 YouTube access is disabled.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Logo / Icon */}
        <div style={styles.iconWrapper}>
          <span style={styles.icon}>🏠</span>
        </div>
        <h1 style={styles.title}>BetterHome</h1>


        {!loggedIn ? (
          /* ── LOGIN FORM ── */
          <div style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Username</label>
              <input
                style={styles.input}
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                autoComplete="off"
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>PIN</label>
              <input
                style={styles.input}
                type="password"
                placeholder="Enter PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                autoComplete="off"
                inputMode="numeric"
              />
            </div>

            {error && <p style={styles.error}>{error}</p>}

            <button style={styles.loginBtn} onClick={handleLogin}>
              Unlock
            </button>
          </div>
        ) : (
          /* ── CONTROL PANEL ── */
          <div style={styles.panel}>
            <p style={styles.welcome}>Welcome, <strong>{CORRECT_USERNAME}</strong> 👋</p>

            <div style={styles.toggleCard}>
              <div style={styles.toggleInfo}>
                <span style={styles.ytIcon}>▶️</span>
                <div>
                  <p style={styles.toggleTitle}>YouTube Access</p>
                  <p style={styles.toggleDesc}>
                    {youtubeEnabled ? "Access is currently ON" : "Access is currently OFF"}
                  </p>
                </div>
              </div>

              <div style={styles.checkboxRow}>
                <input
                  type="checkbox"
                  id="youtubeCheckbox"
                  checked={youtubeEnabled}
                  onChange={(e) => setYoutubeEnabled(e.target.checked)}
                  style={styles.checkbox}
                  disabled={loading}
                />
                <button
                  style={styles.enableBtn}
                  onClick={async () => {
                    setStatusMessage("");
                    setLoading(true);
                    try {
                      await backend.enableYoutubeAccess();
                      setYoutubeEnabled(true);
                      setStatusMessage("✅ YouTube access has been enabled successfully!");
                    } catch (e) {
                      setStatusMessage("⚠️ Failed to enable YouTube access. Please try again.");
                    } finally {
                      setLoading(false);
                    }
                  }}
                  disabled={loading}
                >
                  {loading ? "⏳ Enabling…" : "Enable Access"}
                </button>
              </div>
            </div>

            {!loading && statusMessage && (
              <p style={styles.statusMsg}>{statusMessage}</p>
            )}

            <button
              style={styles.logoutBtn}
              onClick={() => {
                setLoggedIn(false);
                setUsername("");
                setPin("");
                setYoutubeEnabled(false);
                setStatusMessage("");
              }}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<App />);
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    padding: "16px",
  },
  card: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "40px 36px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 25px 60px rgba(0,0,0,0.4)",
    textAlign: "center",
  },
  iconWrapper: {
    marginBottom: "8px",
  },
  icon: {
    fontSize: "48px",
  },
  title: {
    margin: "0 0 4px",
    fontSize: "26px",
    fontWeight: 700,
    color: "#0f172a",
  },
  subtitle: {
    margin: "0 0 28px",
    fontSize: "14px",
    color: "#64748b",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  inputGroup: {
    textAlign: "left",
  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontSize: "13px",
    fontWeight: 600,
    color: "#374151",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1.5px solid #e2e8f0",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
    color: "#0f172a",
  },
  error: {
    color: "#ef4444",
    fontSize: "13px",
    margin: "0",
    textAlign: "left",
  },
  loginBtn: {
    marginTop: "8px",
    padding: "13px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    color: "#fff",
    fontSize: "16px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "opacity 0.2s",
  },
  panel: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    alignItems: "center",
  },
  welcome: {
    fontSize: "16px",
    color: "#374151",
    margin: 0,
  },
  toggleCard: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#f8fafc",
    borderRadius: "14px",
    padding: "16px 18px",
    border: "1.5px solid #e2e8f0",
    boxSizing: "border-box",
  },
  toggleInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  ytIcon: {
    fontSize: "28px",
  },
  toggleTitle: {
    margin: 0,
    fontWeight: 600,
    fontSize: "15px",
    color: "#0f172a",
    textAlign: "left",
  },
  toggleDesc: {
    margin: 0,
    fontSize: "12px",
    color: "#64748b",
    textAlign: "left",
  },
  checkboxRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexShrink: 0,
  },
  checkbox: {
    width: "18px",
    height: "18px",
    cursor: "pointer",
    accentColor: "#3b82f6",
  },
  enableBtn: {
    padding: "8px 16px",
    borderRadius: "8px",
    border: "none",
    background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    color: "#fff",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    whiteSpace: "nowrap" as const,
  },
  statusMsg: {
    fontSize: "14px",
    color: "#374151",
    margin: 0,
  },
  logoutBtn: {
    marginTop: "8px",
    padding: "10px 24px",
    borderRadius: "10px",
    border: "1.5px solid #e2e8f0",
    background: "#f1f5f9",
    color: "#475569",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  },
};
