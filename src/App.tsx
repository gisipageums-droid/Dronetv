function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#ffffff",
        textAlign: "center",
        padding: "20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background animated gradient overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.08) 0%, transparent 50%)",
          pointerEvents: "none",
        }}
      />

      {/* Logo */}
      <img
        src="/images/Drone tv .in.png"
        alt="Drone TV Logo"
        style={{
          width: "140px",
          height: "140px",
          objectFit: "contain",
          marginBottom: "32px",
          filter: "drop-shadow(0 0 30px rgba(59, 130, 246, 0.3))",
          position: "relative",
          zIndex: 1,
        }}
      />

      {/* Coming Soon */}
      <h1
        style={{
          fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
          fontWeight: 800,
          margin: "0 0 16px 0",
          letterSpacing: "-1px",
          background: "linear-gradient(90deg, #ffffff, #93c5fd, #c4b5fd)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          position: "relative",
          zIndex: 1,
        }}
      >
        Coming Soon
      </h1>

      {/* Tagline */}
      <p
        style={{
          fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
          color: "#94a3b8",
          maxWidth: "500px",
          lineHeight: 1.6,
          margin: "0 0 48px 0",
          position: "relative",
          zIndex: 1,
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
          boxShadow: "0 4px 24px rgba(255, 0, 0, 0.3)",
          position: "relative",
          zIndex: 1,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 8px 32px rgba(255, 0, 0, 0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 24px rgba(255, 0, 0, 0.3)";
        }}
      >
        {/* YouTube Icon */}
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
        Watch on YouTube
      </a>

      {/* Footer */}
      <p
        style={{
          position: "absolute",
          bottom: "24px",
          color: "#475569",
          fontSize: "0.85rem",
          zIndex: 1,
        }}
      >
        Drone TV &copy; {new Date().getFullYear()}
      </p>
    </div>
  );
}

export default App;
