import { useEffect, useState } from "react";

function App() {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = "https://www.youtube.com/@indiadronetv";
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#1a1a2e",
        textAlign: "center",
        padding: "20px",
      }}
    >
      {/* Logo */}
      <img
        src="/images/Drone tv .in.png"
        alt="Drone TV Logo"
        style={{
          width: "220px",
          height: "220px",
          objectFit: "contain",
          marginBottom: "36px",
        }}
      />

      {/* Coming Soon */}
      <h1
        style={{
          fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
          fontWeight: 800,
          margin: "0 0 16px 0",
          letterSpacing: "-1px",
          color: "#1a1a2e",
        }}
      >
        Coming Soon
      </h1>

      {/* Tagline */}
      <p
        style={{
          fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
          color: "#64748b",
          maxWidth: "500px",
          lineHeight: 1.6,
          margin: "0 0 40px 0",
        }}
      >
        We're working on something exciting. Stay tuned for the all-new Drone TV
        experience.
      </p>

      {/* YouTube Button */}
      <a
        href="https://www.youtube.com/@indiadronetv"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "12px",
          padding: "16px 36px",
          background: "#FF0000",
          color: "#ffffff",
          fontSize: "1.1rem",
          fontWeight: 600,
          borderRadius: "50px",
          textDecoration: "none",
          transition: "all 0.3s ease",
          boxShadow: "0 4px 24px rgba(255, 0, 0, 0.25)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 8px 32px rgba(255, 0, 0, 0.35)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 24px rgba(255, 0, 0, 0.25)";
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
        Watch on YouTube
      </a>

      {/* Redirect countdown */}
      <p
        style={{
          marginTop: "24px",
          color: "#94a3b8",
          fontSize: "0.9rem",
        }}
      >
        Redirecting to YouTube in {countdown}s...
      </p>

      {/* Footer */}
      <p
        style={{
          position: "absolute",
          bottom: "24px",
          color: "#cbd5e1",
          fontSize: "0.85rem",
        }}
      >
        Drone TV &copy; {new Date().getFullYear()}
      </p>
    </div>
  );
}

export default App;
