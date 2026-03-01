import { useState, useEffect, useCallback, useRef, createContext, useContext } from "react";
import { db } from "./db.js";

const NavContext = createContext({ screen: null, goTo: null });

// ═══════════════════════════════════════════
// CONSTANTS & SHARED COMPONENTS
// ═══════════════════════════════════════════

const C = {
  teal: "#1A5C5E", gold: "#7A5A0F", cream: "#FAF7F2", white: "#FEFCF9",
  dark: "#1A1A1A", med: "#3D3D3D", line: "#E8E0D4", soft: "#F5F1EB",
  faded: "#6B6158",
};
const hf = "'Cormorant Garamond', Georgia, serif";
const bf = "Georgia, serif";

const FadeIn = ({ children, delay = 0 }) => {
  const [v, setV] = useState(false);
  useEffect(() => { const t = setTimeout(() => setV(true), delay); return () => clearTimeout(t); }, [delay]);
  return <div style={{ opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(14px)", transition: "opacity 0.6s ease, transform 0.6s ease" }}>{children}</div>;
};

const Btn = ({ children, onClick, filled = false, small = false, secondary = false, disabled = false }) => {
  const [h, setH] = useState(false);
  const bg = secondary ? (h ? C.soft : "none") : (filled || h ? C.teal : "none");
  const border = secondary ? C.line : C.teal;
  const color = secondary ? (h ? C.dark : C.med) : (filled || h ? C.white : C.teal);
  return <button onClick={onClick} disabled={disabled} onMouseOver={() => setH(true)} onMouseOut={() => setH(false)} style={{
    background: bg, border: `1px solid ${border}`, color,
    fontFamily: hf, fontSize: small ? "13px" : "15px", letterSpacing: "2px", textTransform: "uppercase",
    padding: small ? "10px 24px" : "14px 40px", cursor: disabled ? "default" : "pointer",
    transition: "all 0.3s ease", opacity: disabled ? 0.4 : 1,
  }}>{children}</button>;
};

const navSections = [
  { screen: "welcome", label: "Welcome" },
  { screen: "intro", label: "Introduction" },
  { screen: "fork", label: "Team Type" },
  { screen: "journey", label: "Journey Map" },
  { screen: "viz", label: "Visualization" },
  { screen: "reflect", label: "Reflections" },
  { screen: "summary", label: "Summary" },
  { screen: "researchIntro", label: "Research Intro" },
  { screen: "principles", label: "Research Principles" },
  { screen: "sessionOverview", label: "Session Plan" },
  { screen: "sessionBuilder", label: "Session Builder" },
  { screen: "runsheet", label: "Run Sheet" },
];

const Nav = ({ onBack, label }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { screen: currentScreen, goTo } = useContext(NavContext);
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 20 }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "16px 24px", background: `${C.white}ee`, backdropFilter: "blur(8px)", borderBottom: `1px solid ${C.line}33`,
      }}>
        {onBack ? <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: hf, fontSize: "14px", letterSpacing: "1px", color: C.faded, textTransform: "uppercase", padding: "8px 0" }}>← Back</button> : <div />}
        <p style={{ fontFamily: hf, fontSize: "13px", letterSpacing: "2px", textTransform: "uppercase", color: C.gold }}>{label}</p>
        {goTo ? (
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", cursor: "pointer", padding: "8px 0", display: "flex", flexDirection: "column", gap: "3px", alignItems: "center" }}>
            <span style={{ display: "block", width: "18px", height: "2px", background: C.dark, transition: "all 0.2s", transform: menuOpen ? "rotate(45deg) translateY(5px)" : "none" }} />
            <span style={{ display: "block", width: "18px", height: "2px", background: C.dark, transition: "all 0.2s", opacity: menuOpen ? 0 : 1 }} />
            <span style={{ display: "block", width: "18px", height: "2px", background: C.dark, transition: "all 0.2s", transform: menuOpen ? "rotate(-45deg) translateY(-5px)" : "none" }} />
          </button>
        ) : <div style={{ width: "18px" }} />}
      </div>
      {menuOpen && goTo && (
        <div style={{
          position: "absolute", top: "100%", right: 0, left: 0,
          background: C.white, borderBottom: `1px solid ${C.line}`, boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          padding: "8px 0", maxHeight: "60vh", overflowY: "auto",
        }}>
          {navSections.map(s => {
            const isCurrent = s.screen === currentScreen;
            return (
              <button key={s.screen} onClick={() => { setMenuOpen(false); if (!isCurrent) goTo(s.screen); }}
                style={{
                  display: "block", width: "100%", textAlign: "left", padding: "10px 24px",
                  background: isCurrent ? `${C.teal}08` : "none", border: "none", cursor: "pointer",
                  fontFamily: hf, fontSize: "14px", color: isCurrent ? C.teal : C.dark, fontWeight: isCurrent ? 600 : 400,
                  borderLeft: isCurrent ? `3px solid ${C.teal}` : "3px solid transparent",
                }}>
                {s.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const Video = ({ label, sub }) => (
  <div style={{ margin: "32px 0", textAlign: "center", width: "100%", alignSelf: "stretch" }}>
    <div style={{
      width: "100%",
      aspectRatio: "16/9", background: C.dark,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${C.teal}22 0%, ${C.dark} 100%)` }} />
      <div style={{
        width: "56px", height: "56px", borderRadius: "50%", border: "2px solid rgba(255,255,255,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1, marginBottom: "14px", cursor: "pointer",
      }}>
        <div style={{ width: 0, height: 0, marginLeft: "4px", borderTop: "10px solid transparent", borderBottom: "10px solid transparent", borderLeft: "16px solid rgba(255,255,255,0.8)" }} />
      </div>
      <p style={{ fontFamily: hf, fontSize: "14px", color: "rgba(255,255,255,0.65)", letterSpacing: "2px", textTransform: "uppercase", zIndex: 1, margin: 0 }}>{label}</p>
      {sub && <p style={{ fontFamily: bf, fontSize: "13px", color: "rgba(255,255,255,0.35)", zIndex: 1, margin: "4px 0 0" }}>{sub}</p>}
    </div>
  </div>
);

const YT = ({ id }) => (
  <div style={{ margin: "32px 0", width: "100%", aspectRatio: "16/9", position: "relative", overflow: "hidden", background: C.dark }}>
    <iframe src={`https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`} title="Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen
      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }} />
  </div>
);

const Dots = ({ current, total }) => (
  <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "28px" }}>
    {Array.from({ length: total }).map((_, i) => (
      <div key={i} style={{
        width: i === current ? "32px" : "8px", height: "8px", borderRadius: "4px",
        background: i === current ? C.teal : i < current ? C.gold : C.line, transition: "all 0.4s ease",
      }} />
    ))}
  </div>
);

const Field = ({ label, hint, info, id, value, onChange, color = C.teal, placeholder = "Write here..." }) => {
  const [showInfo, setShowInfo] = useState(false);
  return (
    <div style={{ marginBottom: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
        <label style={{ fontFamily: hf, fontSize: "16px", fontWeight: 600, color: C.dark }}>{label}</label>
        {info && <button onClick={() => setShowInfo(!showInfo)} style={{ background: "none", border: `1px solid ${C.line}`, borderRadius: "50%", width: "20px", height: "20px", fontSize: "13px", color: C.faded, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>i</button>}
      </div>
      {hint && <p style={{ fontFamily: bf, fontSize: "13px", fontStyle: "italic", color: C.faded, marginBottom: "6px" }}>{hint}</p>}
      {showInfo && <div style={{ background: C.soft, padding: "10px 14px", marginBottom: "8px", borderLeft: `2px solid ${color}` }}><p style={{ fontFamily: bf, fontSize: "13px", color: C.med, lineHeight: 1.5, margin: 0 }}>{info}</p><button onClick={() => setShowInfo(false)} style={{ background: "none", border: "none", fontFamily: hf, fontSize: "13px", color: C.faded, cursor: "pointer", marginTop: "4px", letterSpacing: "1px", textTransform: "uppercase" }}>Got it</button></div>}
      <textarea placeholder={placeholder} value={value || ""} onChange={e => onChange(e.target.value)}
        style={{ width: "100%", minHeight: "72px", padding: "14px", border: `1px solid ${C.line}`, background: "rgba(255,255,255,0.7)", fontFamily: bf, fontSize: "15px", lineHeight: 1.6, color: C.dark, resize: "vertical", outline: "none", boxSizing: "border-box" }}
        onFocus={e => e.target.style.borderColor = color} onBlur={e => e.target.style.borderColor = C.line} />
    </div>
  );
};

const TwoCol = ({ leftHeader, rightHeader, leftInfo, rightInfo, leftId, rightId, leftVal, rightVal, onChange, color = C.teal }) => {
  const [showLeftInfo, setShowLeftInfo] = useState(false);
  const [showRightInfo, setShowRightInfo] = useState(false);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
      {[[leftHeader, leftInfo, leftId, leftVal, showLeftInfo, setShowLeftInfo], [rightHeader, rightInfo, rightId, rightVal, showRightInfo, setShowRightInfo]].map(([h, info, id, val, showInfo, setShowInfo], i) => (
        <div key={i}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
            <p style={{ fontFamily: hf, fontSize: "15px", fontWeight: 600, color, margin: 0 }}>{h}</p>
            {info && <button onClick={() => setShowInfo(!showInfo)} style={{ background: "none", border: `1px solid ${C.line}`, borderRadius: "50%", width: "20px", height: "20px", fontSize: "13px", color: C.faded, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>i</button>}
          </div>
          {showInfo && info && <div style={{ background: C.soft, padding: "8px 12px", marginBottom: "6px", borderLeft: `2px solid ${color}` }}><p style={{ fontFamily: bf, fontSize: "13px", color: C.med, lineHeight: 1.5, margin: 0 }}>{info}</p><button onClick={() => setShowInfo(false)} style={{ background: "none", border: "none", fontFamily: hf, fontSize: "13px", color: C.faded, cursor: "pointer", marginTop: "4px", letterSpacing: "1px", textTransform: "uppercase" }}>Got it</button></div>}
          <textarea placeholder="Write here…" value={val || ""} onChange={e => onChange(id, e.target.value)}
            style={{ width: "100%", minHeight: "100px", padding: "12px", border: `1px solid ${C.line}`, background: "rgba(255,255,255,0.7)", fontFamily: bf, fontSize: "15px", lineHeight: 1.6, color: C.dark, resize: "vertical", outline: "none", boxSizing: "border-box" }}
            onFocus={e => e.target.style.borderColor = color} onBlur={e => e.target.style.borderColor = C.line} />
        </div>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════
// SCREEN 0: EMAIL LOGIN
// ═══════════════════════════════════════════

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes("@") || !trimmed.includes(".")) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const saved = await db.get(trimmed);
      if (saved) {
        const answerCount = saved.answers ? Object.keys(saved.answers).length : 0;
        console.log("Restored save:", { screen: saved.screen, answerCount });
        onLogin(trimmed, saved);
      } else {
        onLogin(trimmed, null);
      }
    } catch (e) {
      console.log("Load error:", e?.message || e);
      onLogin(trimmed, null);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: `linear-gradient(170deg, ${C.white} 0%, ${C.cream} 40%, ${C.soft} 100%)`,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "40px 24px", position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: "-200px", right: "-200px", width: "600px", height: "600px", borderRadius: "50%", border: `1px solid ${C.line}`, opacity: 0.4 }} />
      <FadeIn delay={200}><p style={{ fontFamily: hf, fontSize: "14px", letterSpacing: "3px", textTransform: "uppercase", color: C.gold, marginBottom: "28px", textAlign: "center" }}>The Unfolding: Teams Edition</p></FadeIn>
      <FadeIn delay={500}><h1 style={{ fontFamily: hf, fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 300, color: C.teal, textAlign: "center", lineHeight: 1.2, maxWidth: "500px", marginBottom: "16px" }}>Welcome.<br /><span style={{ fontWeight: 600 }}>Let's save your work.</span></h1></FadeIn>
      <FadeIn delay={800}>
        <p style={{ fontFamily: bf, fontSize: "16px", color: C.med, textAlign: "center", maxWidth: "420px", lineHeight: 1.7, marginBottom: "32px" }}>Enter your email to get started. Your reflections and progress will be saved automatically so you can pick up where you left off.</p>
      </FadeIn>
      <FadeIn delay={1000}>
        <div style={{ width: "100%", maxWidth: "380px" }}>
          <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(""); }}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            placeholder="your@email.com"
            style={{
              width: "100%", padding: "16px 18px", border: `1.5px solid ${C.line}`, background: C.white,
              fontFamily: bf, fontSize: "16px", color: C.dark, outline: "none", boxSizing: "border-box",
              marginBottom: error ? "8px" : "20px", transition: "border-color 0.3s",
            }}
            onFocus={e => e.target.style.borderColor = C.teal} onBlur={e => e.target.style.borderColor = C.line} />
          {error && <p style={{ fontFamily: bf, fontSize: "14px", color: "#B8452A", marginBottom: "16px" }}>{error}</p>}
          <div style={{ textAlign: "center" }}>
            <Btn filled onClick={handleSubmit} disabled={loading}>{loading ? "Loading..." : "Continue"}</Btn>
          </div>
          <p style={{ fontFamily: bf, fontSize: "13px", color: C.faded, textAlign: "center", marginTop: "20px", lineHeight: 1.5 }}>Your email is only used to save your progress. We won't send you anything.</p>
        </div>
      </FadeIn>
    </div>
  );
};

// ═══════════════════════════════════════════
// SCREEN 1: WELCOME
// ═══════════════════════════════════════════

const Welcome = ({ onNext }) => (
  <div style={{
    minHeight: "100vh", background: `linear-gradient(170deg, ${C.white} 0%, ${C.cream} 40%, ${C.soft} 100%)`,
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    padding: "40px 24px", position: "relative", overflow: "hidden",
  }}>
    <div style={{ position: "absolute", top: "-200px", right: "-200px", width: "600px", height: "600px", borderRadius: "50%", border: `1px solid ${C.line}`, opacity: 0.4 }} />
    <FadeIn delay={200}><p style={{ fontFamily: hf, fontSize: "14px", letterSpacing: "3px", textTransform: "uppercase", color: C.gold, marginBottom: "28px", textAlign: "center" }}>The Unfolding: Teams Edition</p></FadeIn>
    <FadeIn delay={500}><h1 style={{ fontFamily: hf, fontSize: "clamp(36px, 6vw, 60px)", fontWeight: 300, color: C.teal, textAlign: "center", lineHeight: 1.15, maxWidth: "660px", marginBottom: "24px" }}>Before the Team,<br /><span style={{ fontWeight: 600 }}>There's You</span></h1></FadeIn>
    <FadeIn delay={900}><p style={{ fontFamily: bf, fontSize: "17px", color: C.med, textAlign: "center", maxWidth: "480px", lineHeight: 1.7, marginBottom: "40px" }}>A guided experience to prepare you to facilitate a cultural transformation. This is a reflective experience. Get comfortable, light a candle, be somewhere private without interruptions. For each part, set aside 60 minutes to give yourself plenty of space to process and plan.</p></FadeIn>
    <FadeIn delay={1200}><Btn onClick={onNext}>Begin</Btn></FadeIn>
  </div>
);

// ═══════════════════════════════════════════
// SCREEN 2: INTRO
// ═══════════════════════════════════════════

const Intro = ({ onNext, onBack }) => (
  <div style={{ minHeight: "100vh", background: C.white }}>
    <Nav onBack={onBack} label="Introduction" />
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 24px 80px" }}>
      <FadeIn delay={200}>
        <h2 style={{ fontFamily: hf, fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 300, color: C.teal, lineHeight: 1.2, marginBottom: "12px" }}>Why This <span style={{ fontWeight: 600 }}>Matters</span></h2>
      </FadeIn>
      <FadeIn delay={400}><YT id="OSGnv9ItYTw" /></FadeIn>
      <FadeIn delay={600}>
        <p style={{ fontFamily: bf, fontSize: "17px", color: C.med, lineHeight: 1.8, marginBottom: "24px" }}>Most leaders who want to change their culture skip straight to the team conversation. They gather everyone, put sticky notes on a wall, and try to co-create something from scratch.</p>
        <p style={{ fontFamily: bf, fontSize: "17px", color: C.med, lineHeight: 1.8, marginBottom: "24px" }}>Sometimes it works. More often, you unconsciously dominate because you haven't examined your own assumptions, you defer to everything and end up with a framework you don't believe in, or mindsets and behaviors go unexamined and become a challenge down the line.</p>
      </FadeIn>
      <FadeIn delay={800}>
        <div style={{ borderLeft: `3px solid ${C.teal}`, padding: "20px 24px", background: C.soft, margin: "32px 0" }}>
          <p style={{ fontFamily: hf, fontSize: "19px", fontStyle: "italic", color: C.teal, lineHeight: 1.6, margin: 0 }}>This experience exists so that doesn't happen to you.</p>
        </div>
      </FadeIn>
      <FadeIn delay={1000}>
        <p style={{ fontFamily: bf, fontSize: "17px", color: C.med, lineHeight: 1.8, marginBottom: "24px" }}>You're not pre-deciding the culture. You're getting clear enough on what you believe and what the options are so that you can walk into the team process as a <em><strong>conscious participant rather than a reactive one.</strong></em></p>
      </FadeIn>
      <FadeIn delay={1200}><div style={{ textAlign: "center", padding: "32px 0" }}><Btn filled onClick={onNext}>See Your Journey →</Btn></div></FadeIn>
    </div>
  </div>
);

// ═══════════════════════════════════════════
// SCREEN 3: TEAM TYPE FORK
// ═══════════════════════════════════════════

const TeamFork = ({ onSelect, onBack }) => {
  const [hover, setHover] = useState(null);
  const opts = [
    { key: "existing", icon: "↻", label: "Transforming an existing culture", desc: "You have a team. There's a culture — spoken or not. You want to shift it." },
    { key: "new", icon: "✦", label: "Building a new team", desc: "You're starting fresh. No existing culture yet — but you'll bring patterns from your past." },
  ];
  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(180deg, ${C.white} 0%, ${C.cream} 100%)` }}>
      <Nav onBack={onBack} label="" />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 24px 80px" }}>
      <FadeIn delay={200}><h2 style={{ fontFamily: hf, fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 300, color: C.teal, textAlign: "center", marginBottom: "8px" }}>Before we start —</h2></FadeIn>
      <FadeIn delay={400}><p style={{ fontFamily: bf, fontSize: "16px", color: C.med, marginBottom: "36px" }}>Which describes your situation?</p></FadeIn>
      {opts.map((o, i) => (
        <FadeIn key={o.key} delay={600 + i * 200}>
          <button onClick={() => onSelect(o.key)} onMouseOver={() => setHover(o.key)} onMouseOut={() => setHover(null)}
            style={{ display: "block", width: "100%", maxWidth: "460px", textAlign: "left", padding: "28px 24px", marginBottom: "16px", border: `1.5px solid ${hover === o.key ? C.teal : C.line}`, background: hover === o.key ? `${C.teal}08` : C.white, cursor: "pointer", transition: "all 0.3s ease" }}>
            <p style={{ fontSize: "28px", marginBottom: "8px" }}>{o.icon}</p>
            <p style={{ fontFamily: hf, fontSize: "20px", fontWeight: 600, color: C.teal, marginBottom: "6px" }}>{o.label}</p>
            <p style={{ fontFamily: bf, fontSize: "14px", color: C.med, lineHeight: 1.5, margin: 0 }}>{o.desc}</p>
          </button>
        </FadeIn>
      ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════
// SCREEN 4: JOURNEY MAP
// ═══════════════════════════════════════════

const JourneyMap = ({ onNext, onBack }) => {
  const parts = [
    { label: "Part 1", desc: "Vision + Reflection", time: "~30 min" },
    { label: "Part 2", desc: "Curated Research", time: "~30 min" },
    { label: "Part 3", desc: "Your Session Plan", time: "~30 min" },
  ];
  const steps = [
    { n: "01", t: "Watch", s: "Guided Visualization", d: "A visualization to explore your ideal organizational experience.", time: "8 min", part: 1 },
    { n: "02", t: "Reflect", s: "Five Reflections", d: "Vision, strengths, barriers, systems, and trust.", time: "~20 min", part: 1 },
    { n: "03", t: "Your Summary", s: "What You Carry", d: "Everything you named, in one place.", time: "2 min", part: 1 },
    { n: "", isBreak: true },
    { n: "04", t: "The Research", s: "Curated for You", d: "Reflect on research principles matched to what you wrote, with space for your takeaways.", time: "20 min", part: 2 },
    { n: "", isBreak: true },
    { n: "05", t: "Your Plan", s: "Session Agendas", d: "Co-design your team's culture sessions from AI-generated draft agendas built from your reflections.", time: "30 min", part: 3 },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.white }}>
      <Nav onBack={onBack} label="Your Journey" />
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 24px 80px" }}>
        <FadeIn delay={200}>
          <h2 style={{ fontFamily: hf, fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 300, color: C.teal, lineHeight: 1.2, marginBottom: "24px" }}>The full arc</h2>
          <div style={{ display: "flex", gap: "12px", marginBottom: "36px" }}>
            {parts.map((p, i) => (
              <div key={i} style={{ flex: 1, padding: "14px 16px", border: `1px solid ${C.line}`, background: C.soft }}>
                <p style={{ fontFamily: hf, fontSize: "13px", fontWeight: 600, color: C.teal, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "2px" }}>{p.label}</p>
                <p style={{ fontFamily: bf, fontSize: "13px", color: C.med, marginBottom: "2px" }}>{p.desc}</p>
                <p style={{ fontFamily: hf, fontSize: "13px", color: C.faded }}>{p.time}</p>
              </div>
            ))}
          </div>
        </FadeIn>

        {steps.map((p, i) => (
          <FadeIn key={i} delay={500 + i * 80}>
            {p.isBreak ? (
              <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px 0" }}>
                <div style={{ flex: 1, height: "1px", background: C.line }} />
                <p style={{ fontFamily: hf, fontSize: "13px", letterSpacing: "2px", textTransform: "uppercase", color: C.faded }}>Take a break</p>
                <div style={{ flex: 1, height: "1px", background: C.line }} />
              </div>
            ) : (
              <div style={{ display: "flex", gap: "20px" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "44px", flexShrink: 0 }}>
                  <div style={{
                    width: "44px", height: "44px", borderRadius: "50%",
                    border: `2px solid ${p.part === 1 ? C.teal : C.line}`, background: p.part === 1 ? C.teal : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: hf, fontSize: "13px", fontWeight: 600, color: p.part === 1 ? C.white : C.line,
                  }}>{p.n}</div>
                  {i < steps.length - 1 && !steps[i + 1]?.isBreak && <div style={{ width: "1px", flexGrow: 1, background: C.line, minHeight: "24px" }} />}
                </div>
                <div style={{ paddingBottom: "28px", paddingTop: "2px" }}>
                  <p style={{ fontFamily: hf, fontSize: "13px", letterSpacing: "2px", textTransform: "uppercase", color: p.part === 1 ? C.gold : C.faded, marginBottom: "2px" }}>{p.time}</p>
                  <h3 style={{ fontFamily: hf, fontSize: "20px", fontWeight: 600, color: p.part === 1 ? C.teal : C.faded, marginBottom: "2px" }}>{p.t}</h3>
                  <p style={{ fontFamily: hf, fontSize: "14px", fontStyle: "italic", color: p.part === 1 ? C.gold : "#C8C0B4", marginBottom: "4px" }}>{p.s}</p>
                  <p style={{ fontFamily: bf, fontSize: "13px", color: p.part === 1 ? C.med : "#C0B8AC", lineHeight: 1.5 }}>{p.d}</p>
                </div>
              </div>
            )}
          </FadeIn>
        ))}
        <FadeIn delay={1100}><div style={{ marginLeft: "64px", marginTop: "8px" }}><Btn filled onClick={onNext}>Start →</Btn></div></FadeIn>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════
// SCREEN 5: VISUALIZATION
// ═══════════════════════════════════════════

const Visualization = ({ onNext, onBack, teamType }) => (
  <div style={{ minHeight: "100vh", background: `linear-gradient(180deg, ${C.white} 0%, ${C.cream} 100%)` }}>
    <Nav onBack={onBack} label="Step 01 · Watch" />
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 24px 80px", textAlign: "center" }}>
      <FadeIn delay={200}>
        <h2 style={{ fontFamily: hf, fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 300, color: C.teal, lineHeight: 1.2, maxWidth: "480px", margin: "0 auto 8px" }}>Close your eyes.<br /><span style={{ fontWeight: 600 }}>Let this guide you.</span></h2>
        <p style={{ fontFamily: bf, fontSize: "15px", color: C.med, maxWidth: "440px", margin: "0 auto 8px", lineHeight: 1.6 }}>
          {teamType === "new" ? "This visualization walks you through the culture you want to build." : "This visualization helps you illuminate what you want your experience and others' experiences to feel like."}
        </p>
      </FadeIn>
      <FadeIn delay={500}><Video label="Guided Visualization" sub="8 min" /></FadeIn>
      <FadeIn delay={700}>
        <p style={{ fontFamily: bf, fontSize: "15px", color: C.med, marginBottom: "28px" }}>When you're ready, capture what came up.</p>
        <Btn filled onClick={onNext}>I'm Ready to Reflect →</Btn>
      </FadeIn>
    </div>
  </div>
);

// ═══════════════════════════════════════════
// SCREEN 6: REFLECTIONS (5 sections, branched)
// ═══════════════════════════════════════════

const getReflectSections = (teamType) => {
  const isNew = teamType === "new";
  return [
    {
      title: "The Vision", subtitle: "What you want", color: C.teal, time: "3 min",
      fields: [
        { id: "vision_feel", label: isNew ? "The culture I want to build feels like…" : "The culture I want feels like…", info: '"Electric and calm at the same time." "Like everyone\'s in on the plan." "Like the Sunday of a team — rested but ready."' },
        { id: "vision_see", label: "What people do differently…", info: 'Instead of "better communication," try: "People flag problems the day they see them." Instead of "more collaboration," try: "Design and engineering meet before sprints, not after."' },
        { id: "vision_you", label: isNew ? "What kind of leader am I in this version…" : "How I'm different in this version…", info: '"I don\'t check Slack during dinner." "I say \'I don\'t know\' in front of my team." "When someone pushes back, I get curious instead of defensive."' },
      ]
    },
    isNew ? {
      title: "What You're Bringing", subtitle: "From your past experience", color: C.gold, time: "3 min",
      twoCol: true,
      leftHeader: "What I want to keep", leftInfo: "From past teams — norms, habits, rituals that worked.", leftId: "bringing_keep",
      rightHeader: "What I want to leave behind", rightInfo: "Patterns you refuse to recreate. Name them.", rightId: "bringing_leave",
    } : {
      title: "What's Already Working", subtitle: "Where you're building from", color: C.gold, time: "3 min",
      twoCol: true,
      leftHeader: "What I'm already doing", leftInfo: "A meeting you run well, a habit that builds trust, rituals that are working.", leftId: "working_me",
      rightHeader: "What the org does well", rightInfo: "Rituals, norms, moments where the culture actually works?", rightId: "working_org",
    },
    isNew ? {
      title: "The Defaults", subtitle: "What you'll recreate if you're not careful", color: C.teal, time: "4 min",
      twoCol: true,
      leftHeader: "My default patterns", leftInfo: "Under stress, what's your autopilot? Micromanage? Go silent? Over-explain?", leftId: "default_pattern",
      rightHeader: "What I want instead", rightInfo: null, rightId: "default_instead",
      extraFields: [
        { id: "default_past", label: "What did your last team's culture get wrong?" },
        { id: "default_repeat", label: "What's the pattern you're most likely to repeat?" },
      ]
    } : {
      title: "What's in the Way", subtitle: "What's true right now", color: C.teal, time: "4 min",
      twoCol: true,
      leftHeader: "What we say we value", leftInfo: null, leftId: "barrier_say",
      rightHeader: "What actually happens", rightInfo: '"We say \'people first\' but approved zero mental health days. We want balance but respond to weekend emails."', rightId: "barrier_do",
      extraFields: [
        { id: "barrier_unsaid", label: "What does everyone know but no one says?", info: "The thing discussed in DMs but never in meetings." },
        { id: "barrier_you", label: "What's your part in it? Or how is this a reflection of your patterns?" },
      ]
    },
    isNew ? {
      title: "The Systems", subtitle: "Design from scratch", color: C.gold, time: "4 min",
      fields: [
        { id: "sys_decisions", label: "How should decisions get made?", info: "Who decides what? Think about: hiring, priorities, conflicts, spending." },
        { id: "sys_communication", label: "How should the team communicate and meet?" },
        { id: "sys_accountability", label: "How will people know what's expected — and what happens when they're not met?" },
      ]
    } : {
      title: "The Systems", subtitle: "What needs to change", color: C.gold, time: "4 min",
      twoCol: true,
      leftHeader: "Working against you", leftInfo: "Meeting cadences, approvals, decisions, performance reviews, promotions.", leftId: "sys_against",
      rightHeader: "What you'd build instead", rightInfo: null, rightId: "sys_build",
      extraFields: [
        { id: "sys_fear", label: "You haven't made this change yet. What might you be afraid will happen if you do?", info: '"We\'ll lose consistency." "The wrong people will leave." "I\'ll lose control."' },
      ]
    },
    isNew ? {
      title: "Trust", subtitle: "Building from day one", color: C.teal, time: "3 min",
      fields: [
        { id: "trust_kind", label: "What kind of trust do you want from the start?", hint: "There's a difference between 'people are polite' and 'people tell me when I'm wrong.'" },
        { id: "trust_30days", label: "What will you do in the first 30 days to build it?", hint: "What will people experience — not just hear?" },
        { id: "trust_safety", label: "How will people know it's safe to push back on you?" },
      ]
    } : {
      title: "Trust", subtitle: "Where is your team right now?", color: C.teal, time: "3 min",
      fields: [
        { id: "trust_honest", label: "If you asked your team to be fully honest — would they?", hint: "Not what you hope. What's true.", info: "When was the last time someone disagreed with you publicly?" },
        { id: "trust_need", label: "What would they need from you first?", hint: "Before they'd believe trust is real." },
        { id: "trust_do", label: "What would they need to see you do — not say?" },
      ]
    },
  ];
};

const Reflect = ({ onNext, onBack, answers, setAnswers, teamType }) => {
  const sections = getReflectSections(teamType);
  const [sec, setSec] = useState(0);
  const [ak, setAk] = useState(0);
  const s = sections[sec];
  const isLast = sec === sections.length - 1;

  const advance = () => { if (isLast) { onNext(); return; } setAk(k => k + 1); setSec(i => i + 1); window.scrollTo(0, 0); };
  const goBack = () => { if (sec === 0) { onBack(); return; } setAk(k => k + 1); setSec(i => i - 1); window.scrollTo(0, 0); };
  const setA = (id, val) => setAnswers(prev => ({ ...prev, [id]: val }));

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(180deg, ${C.white} 0%, ${C.cream} 100%)` }}>
      <Nav onBack={goBack} label="Step 02 · Reflect" />
      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "28px 24px 80px" }}>
        <Dots current={sec} total={sections.length} />
        <FadeIn key={`h-${ak}`} delay={0}>
          <div style={{ textAlign: "center", marginBottom: "8px" }}>
            <p style={{ fontFamily: hf, fontSize: "26px", color: s.color, fontWeight: 600, marginBottom: "4px" }}>{s.title}</p>
            <p style={{ fontFamily: bf, fontSize: "15px", fontStyle: "italic", color: C.med, marginBottom: "4px" }}>{s.subtitle}</p>
            <p style={{ fontFamily: hf, fontSize: "13px", color: C.faded, letterSpacing: "1px" }}>{s.time}</p>
          </div>
          {sec === 0 && <div style={{ background: C.soft, padding: "12px 16px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ border: `1px solid ${C.line}`, borderRadius: "50%", width: "22px", height: "22px", fontSize: "13px", color: C.faded, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>i</span>
            <p style={{ fontFamily: bf, fontSize: "14px", color: C.med, margin: 0, lineHeight: 1.4 }}>Look for the <strong>i</strong> buttons throughout — they have examples and tips to help you go deeper.</p>
          </div>}
        </FadeIn>

        {s.twoCol && (
          <FadeIn key={`tc-${ak}`} delay={100}>
            <TwoCol leftHeader={s.leftHeader} rightHeader={s.rightHeader} leftInfo={s.leftInfo} rightInfo={s.rightInfo}
              leftId={s.leftId} rightId={s.rightId} leftVal={answers[s.leftId]} rightVal={answers[s.rightId]}
              onChange={setA} color={s.color} />
          </FadeIn>
        )}

        {s.extraFields && s.extraFields.map((f, fi) => (
          <FadeIn key={`ef-${f.id}-${ak}`} delay={200 + fi * 100}>
            <Field label={f.label} hint={f.hint} info={f.info} id={f.id} value={answers[f.id]} onChange={v => setA(f.id, v)} color={s.color} />
          </FadeIn>
        ))}

        {s.fields && s.fields.map((f, fi) => (
          <FadeIn key={`f-${f.id}-${ak}`} delay={100 + fi * 100}>
            <Field label={f.label} hint={f.hint} info={f.info} id={f.id} value={answers[f.id]} onChange={v => setA(f.id, v)} color={s.color} />
          </FadeIn>
        ))}

        <FadeIn key={`btn-${ak}`} delay={400}>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "12px" }}>
            <Btn filled onClick={advance}>{isLast ? "See Your Summary →" : "Next →"}</Btn>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════
// SCREEN 7: SUMMARY
// ═══════════════════════════════════════════

const getSummaryGroups = (teamType) => {
  const isNew = teamType === "new";
  return [
    { title: "The Vision", color: C.teal, rows: [
      { id: "vision_feel", label: "Feels like" }, { id: "vision_see", label: "People do" }, { id: "vision_you", label: isNew ? "Leader I am" : "I'm different" },
    ]},
    isNew
      ? { title: "What I'm Bringing", color: C.gold, rows: [{ id: "bringing_keep", label: "Keep" }, { id: "bringing_leave", label: "Leave behind" }] }
      : { title: "What's Working", color: C.gold, rows: [{ id: "working_me", label: "Me" }, { id: "working_org", label: "Org" }] },
    isNew
      ? { title: "The Defaults", color: C.teal, rows: [{ id: "default_pattern", label: "My defaults" }, { id: "default_instead", label: "Want instead" }, { id: "default_past", label: "Last culture" }, { id: "default_repeat", label: "Likely to repeat" }] }
      : { title: "What's in the Way", color: C.teal, rows: [{ id: "barrier_say", label: "What we say" }, { id: "barrier_do", label: "What happens" }, { id: "barrier_unsaid", label: "Unsaid" }, { id: "barrier_you", label: "My part" }] },
    isNew
      ? { title: "The Systems", color: C.gold, rows: [{ id: "sys_decisions", label: "Decisions" }, { id: "sys_communication", label: "Communication" }, { id: "sys_accountability", label: "Accountability" }] }
      : { title: "The Systems", color: C.gold, rows: [{ id: "sys_against", label: "Against me" }, { id: "sys_build", label: "I'd build" }, { id: "sys_fear", label: "Fear" }] },
    isNew
      ? { title: "Trust", color: C.teal, rows: [{ id: "trust_kind", label: "Trust I want" }, { id: "trust_30days", label: "First 30 days" }, { id: "trust_safety", label: "Safety signal" }] }
      : { title: "Trust", color: C.teal, rows: [{ id: "trust_honest", label: "Honest?" }, { id: "trust_need", label: "Need from me" }, { id: "trust_do", label: "Do first" }] },
  ];
};

const Summary = ({ onNext, onBack, answers, teamType }) => {
  const groups = getSummaryGroups(teamType);
  return (
    <div style={{ minHeight: "100vh", background: C.white }}>
      <Nav onBack={onBack} label="Step 03 · Your Summary" />
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "32px 24px 80px" }}>
        <FadeIn delay={200}>
          <h2 style={{ fontFamily: hf, fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 300, color: C.teal, lineHeight: 1.2, marginBottom: "8px" }}>What You <span style={{ fontWeight: 600 }}>Carry</span></h2>
          <p style={{ fontFamily: bf, fontSize: "15px", fontStyle: "italic", color: C.med, marginBottom: "32px" }}>Everything you just named, in one place.</p>
        </FadeIn>
        {groups.map((g, gi) => (
          <FadeIn key={gi} delay={400 + gi * 150}>
            <div style={{ marginBottom: "24px" }}>
              <div style={{ background: g.color, padding: "10px 16px" }}>
                <p style={{ fontFamily: hf, fontSize: "14px", fontWeight: 600, color: C.white, letterSpacing: "1.5px", textTransform: "uppercase", margin: 0 }}>{g.title}</p>
              </div>
              {g.rows.map(r => (
                <div key={r.id} style={{ display: "flex", borderBottom: `1px solid ${C.line}`, borderLeft: `1px solid ${C.line}`, borderRight: `1px solid ${C.line}` }}>
                  <div style={{ width: "140px", flexShrink: 0, padding: "10px 12px", background: C.soft, borderRight: `1px solid ${C.line}` }}>
                    <p style={{ fontFamily: hf, fontSize: "13px", color: C.med, margin: 0, lineHeight: 1.4 }}>{r.label}</p>
                  </div>
                  <div style={{ flex: 1, padding: "10px 12px" }}>
                    <p style={{ fontFamily: bf, fontSize: "14px", color: answers[r.id] ? C.dark : C.faded, lineHeight: 1.5, margin: 0, fontStyle: answers[r.id] ? "normal" : "italic" }}>{answers[r.id] || "—"}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        ))}
        <FadeIn delay={1000}>
          <div style={{ borderLeft: `3px solid ${C.teal}`, padding: "20px 24px", background: C.soft, marginBottom: "32px" }}>
            <p style={{ fontFamily: hf, fontSize: "18px", fontStyle: "italic", color: C.teal, lineHeight: 1.5, margin: 0 }}>The act of naming these things honestly is the first shift.</p>
          </div>
        </FadeIn>
        <FadeIn delay={1200}><div style={{ textAlign: "center" }}><Btn filled onClick={onNext}>Continue →</Btn></div></FadeIn>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════
// SCREEN 8: BREAK 1
// ═══════════════════════════════════════════

const Break1 = ({ onNext, onBack }) => (
  <div style={{ minHeight: "100vh", background: `linear-gradient(180deg, ${C.cream} 0%, ${C.soft} 100%)` }}>
    <Nav onBack={onBack} label="Break" />
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "40px 24px 80px", textAlign: "center", minHeight: "calc(100vh - 60px)",
    }}>
    <FadeIn delay={200}><p style={{ fontFamily: hf, fontSize: "14px", letterSpacing: "3px", textTransform: "uppercase", color: C.gold, marginBottom: "28px" }}>Part 1 Complete</p></FadeIn>
    <FadeIn delay={500}><h2 style={{ fontFamily: hf, fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 300, color: C.teal, lineHeight: 1.2, maxWidth: "480px", marginBottom: "20px" }}>Take a breath.<br />You've done the hardest part.</h2></FadeIn>
    <FadeIn delay={800}>
      <p style={{ fontFamily: bf, fontSize: "16px", color: C.med, lineHeight: 1.7, maxWidth: "420px", marginBottom: "40px" }}>Next: research curated to what you just wrote — with space to capture your takeaways as you go.</p>
    </FadeIn>
    <FadeIn delay={1100}><Btn filled onClick={onNext}>Continue to Part 2 →</Btn></FadeIn>
    </div>
  </div>
);

// ═══════════════════════════════════════════
// RESEARCH PRINCIPLES DATA (full 10)
// ═══════════════════════════════════════════

const allPrinciples = [
  {
    id: "psych_safety", title: "Psychological safety isn't about comfort. It's about what happens when someone takes a risk.",
    body: "Amy Edmondson studied hospital teams and found something counterintuitive: the best-performing teams reported more mistakes, not fewer. They weren't making more errors — they were more willing to talk about them. That willingness is psychological safety. It's not a feeling. It's a calculation every person makes in real time: \"If I say this out loud, what happens to me?\" Every time someone speaks up and sees the response, they update that calculation. Your reaction to dissent, to mistakes, to hard questions — those micro-moments are the actual mechanism.",
    familiar: "Create a \"safe space.\" Tell people they can speak up. Add psychological safety to the values wall.",
    emerging: "Watch what happens when someone does speak up. Notice your first physical reaction — before you respond. Meet dissent with genuine curiosity. Treat every moment of honesty as a deposit in an account you can't fake.",
    citation: "Edmondson, A. (1999). Psychological Safety and Learning Behavior in Work Teams. · Google (2015). Project Aristotle.",
    triggers: ["trust", "honest", "speak", "safe", "risk", "disagree", "push back"],
  },
  {
    id: "culture_assumptions", title: "Culture isn't what you write on the wall. It's what your organization learned works.",
    body: "Edgar Schein found culture operates on three layers. Artifacts are visible — how meetings run, what gets celebrated. Espoused values are what you say you believe. Underlying assumptions are the real driver — the unspoken beliefs about how things actually work here. The gap between your espoused values and your underlying assumptions is where every culture problem lives. You say you value open communication, but the underlying assumption is that disagreeing with leadership is career-limiting. Everyone already knows where those gaps are.",
    familiar: "Rewrite the values. Launch a culture initiative. Put new language on the wall and expect behavior to follow.",
    emerging: "Accept that your current culture was learned — built by real people solving real problems under real pressure. Map the gaps between what you say and what actually gets rewarded, tolerated, and punished.",
    citation: "Schein, E. (2010). Organizational Culture and Leadership, 4th Ed. · Schein, E. (2013). Humble Inquiry.",
    triggers: ["values", "say", "gap", "reward", "punish", "behavior", "match"],
  },
  {
    id: "nervous_system", title: "Before you say a word, your team is already reading your body.",
    body: "Stephen Porges' polyvagal theory reveals something leaders rarely consider: your nervous system is broadcasting a signal to every person in the room, and theirs are calibrating to it before conscious thought kicks in. When you're dysregulated — stressed, defended, activated — your team picks it up instantly. Not from your words. From your tone, your breathing, your micro-expressions. The most influential nervous system in any room sets the tone for all the others. In most meetings, that's yours. Your calm isn't a luxury. It's infrastructure.",
    familiar: "Push through stress. Manage emotions privately. Perform composure regardless of inner state.",
    emerging: "Regulate before you lead. Notice what your body is doing before a hard conversation. Practice genuine downregulation — not performing calm, but actually finding it.",
    citation: "Porges, S. (2011). The Polyvagal Theory. · Dana, D. (2018). The Polyvagal Theory in Therapy.",
    triggers: ["stress", "activated", "nervous", "body", "react", "calm", "pressure", "defensive"],
  },
  {
    id: "org_models", title: "There's more than one way to organize. Most leaders have only ever experienced one.",
    body: "Frederic Laloux studied organizations that abandoned traditional hierarchy — some running successfully for 30+ years — and found they weren't chaotic. They were organized differently. Richard Hackman identified a spectrum of team authority: Manager-led, Self-managing, Self-designing, and Self-governing. Most organizations operate manager-led even when they claim otherwise. The question isn't which model is best. It's: what level of authority matches your team's maturity, your context, and the complexity of your work?",
    familiar: "Clear chain of command. Fixed roles. Decisions escalate upward. The org chart is the source of truth.",
    emerging: "Match authority to context. Start moving decisions closer to where the information lives. Experiment with giving teams real ownership of how they work.",
    citation: "Laloux, F. (2014). Reinventing Organizations. · Hackman, J.R. (2002). Leading Teams.",
    triggers: ["structure", "hierarchy", "decision", "authority", "role", "organize", "team"],
  },
  {
    id: "productive_conflict", title: "The goal isn't harmony. It's the ability to disagree without it becoming personal.",
    body: "Edmondson maps teams on two axes: psychological safety and accountability. Most leaders assume these oppose each other. The data says the opposite. Teams with both high safety and high accountability outperform everyone. Research distinguishes task conflict (disagreement about the work) from relationship conflict (personal friction). Task conflict in a safe environment actually improves decision-making and innovation. The goal isn't to eliminate disagreement. It's to build a team that can fight about the work without it becoming about each other.",
    familiar: "Minimize conflict. Align quickly. Treat disagreement as dysfunction. Prioritize harmony over honesty.",
    emerging: "Distinguish task conflict from relationship conflict — and protect the former. Create explicit norms for how your team disagrees.",
    citation: "Edmondson, A. (2019). The Fearless Organization. · De Dreu, C. & Weingart, L. (2003). Task Versus Relationship Conflict.",
    triggers: ["conflict", "disagree", "harmony", "tension", "fight", "avoid"],
  },
  {
    id: "strengths", title: "You've been trained to fix weaknesses. The research says to build around strengths.",
    body: "Marcus Buckingham's research through Gallup found that people who use their strengths daily are six times more likely to be engaged. Yet most performance management systems focus on the opposite — identify what's wrong and fix it. The shift isn't about ignoring development areas. It's about designing teams where each person is primarily doing work that energizes them and leverages their natural abilities — while the team collectively covers for individual limitations through complementary strengths.",
    familiar: "Identify weaknesses. Build development plans. Standardize roles. Evaluate against a uniform competency model.",
    emerging: "Discover what each person does at their best. Design roles around strengths, not job descriptions. Evaluate based on impact in their zone of genius.",
    citation: "Buckingham, M. & Goodall, A. (2019). Nine Lies About Work. · Gallup (2023). CliftonStrengths Meta-Analysis.",
    triggers: ["strengths", "genius", "role", "best", "talent", "perform"],
  },
  {
    id: "manager_culture", title: "For most people, their manager is the organization.",
    body: "Gallup's 2025 global workplace report found engagement has fallen to 21% — a pandemic-era low — costing an estimated $438 billion in lost productivity globally. The sharpest decline was among managers themselves. 70% of the variance in team engagement traces back to the manager. Not the CEO's vision. Not the mission statement. The manager. When managers are burned out, checked out, or leading from survival mode, everything downstream reflects it.",
    familiar: "Measure engagement. Add perks and wellness programs. Treat disengagement as an employee problem.",
    emerging: "Recognize that you are the primary variable. Your energy, your presence, your behavior — that's the intervention. Invest in your own development first.",
    citation: "Gallup (2025). State of the Global Workplace Report. · Buckingham, M. (2022). Love + Work.",
    triggers: ["engagement", "burnout", "energy", "manager", "exhausted", "team morale"],
  },
  {
    id: "resist_loss", title: "People don't resist change. They resist loss. They resist being changed.",
    body: "Edgar Schein identified two competing anxieties. Learning anxiety — the fear of being incompetent at the new way. Survival anxiety — the fear that not changing will cost you something. Most change initiatives crank up survival anxiety: create urgency, build the case for why the status quo is unacceptable. What actually works is reducing learning anxiety: make it safe to be bad at the new thing. Kegan and Lahey's research on \"immunity to change\" shows that people hold genuine commitment to change and hidden competing commitments that work against it — simultaneously. Those competing commitments aren't irrational. They're protecting something the person values.",
    familiar: "Create urgency. Build the business case. Manage resistance through communication and training.",
    emerging: "Lower the cost of trying. Make it safe to struggle with the new way. Surface the hidden commitments that make the old way feel necessary. Run small experiments rather than big rollouts.",
    citation: "Schein, E. (1999). Process Consultation Revisited. · Kegan, R. & Lahey, L. (2009). Immunity to Change.",
    triggers: ["change", "resist", "fear", "stuck", "shift", "afraid", "won't"],
  },
  {
    id: "adaptive", title: "Telling people what they already believe is easy. Real change begins with productive discomfort.",
    body: "Ronald Heifetz makes a distinction that changes how you see your role. Technical problems have known solutions — apply the right expertise. Adaptive challenges require people to change their beliefs, habits, or loyalties — there's no expert who can hand you the answer. Most culture work is adaptive, but most leaders treat it as technical: define the change, build a framework, train for compliance. Adaptive work requires \"productive disequilibrium\" — enough discomfort to motivate change without so much that people shut down. Your job isn't to eliminate that discomfort. It's to regulate it.",
    familiar: "Define the change. Roll it out. Train for compliance. Measure adoption.",
    emerging: "Name the adaptive challenge — the thing that can't be solved by expertise alone. Hold the tension instead of resolving it prematurely. Protect space for experimentation.",
    citation: "Heifetz, R. (1994). Leadership Without Easy Answers. · Heifetz, R. & Linsky, M. (2002). Leadership on the Line.",
    triggers: ["complex", "no answer", "uncomfortable", "messy", "compliance", "framework"],
  },
  {
    id: "growth_container", title: "The most effective organizations aren't just producing results. They're developing people through the work itself.",
    body: "Robert Kegan and Lisa Lahey studied Deliberately Developmental Organizations — companies where the actual structure of daily work is designed to accelerate growth. Not through training programs bolted onto real work, but through practices embedded in how people collaborate, give feedback, make decisions, and navigate conflict. In a DDO, vulnerability isn't a risk — it's a norm. The result is a culture that simultaneously produces better results and develops better people — because the two aren't separate processes.",
    familiar: "Separate personal development from operational work. Offer training programs and off-site retreats. Development happens outside the real work.",
    emerging: "Design the work itself to be developmental. Build feedback, reflection, and honest conversation into daily operations — not as extras, but as how the organization runs.",
    citation: "Kegan, R. & Lahey, L. (2016). An Everyone Culture. · Petrie, N. (2014). Vertical Leadership Development.",
    triggers: ["growth", "develop", "capacity", "learning", "potential", "feedback"],
  },
];

// Curation: score each principle against reflection answers
const curatePrinciples = (answers) => {
  const text = Object.values(answers).filter(Boolean).join(" ").toLowerCase();
  if (!text || text.length < 20) return allPrinciples.slice(0, 6);
  const scored = allPrinciples.map(p => {
    const hits = p.triggers.filter(t => text.includes(t)).length;
    return { ...p, score: hits };
  });
  scored.sort((a, b) => b.score - a.score);
  // Always include psych_safety and culture_assumptions as core
  const core = scored.filter(p => p.id === "psych_safety" || p.id === "culture_assumptions");
  const rest = scored.filter(p => p.id !== "psych_safety" && p.id !== "culture_assumptions");
  const selected = [...core, ...rest].slice(0, 6);
  // Return in original order
  return allPrinciples.filter(p => selected.find(s => s.id === p.id));
};

// ═══════════════════════════════════════════
// SCREEN 9: RESEARCH INTRO
// ═══════════════════════════════════════════

const ResearchIntro = ({ onNext, onBack }) => (
  <div style={{ minHeight: "100vh", background: C.white }}>
    <Nav onBack={onBack} label="Step 04 · Research" />
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 24px 80px" }}>
      <FadeIn delay={200}>
        <h2 style={{ fontFamily: hf, fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 300, color: C.teal, lineHeight: 1.2, marginBottom: "12px" }}>There's Research to Shed Light<br />on Your <span style={{ fontWeight: 600 }}>Thinking</span></h2>
        <p style={{ fontFamily: bf, fontSize: "16px", color: C.med, lineHeight: 1.7, marginBottom: "24px" }}>Based on what you wrote, we've selected the research that's most relevant to your situation.</p>
      </FadeIn>
      <FadeIn delay={400}><YT id="w-07l2X3-Es" /></FadeIn>
      <FadeIn delay={600}>
        <div style={{ background: C.soft, padding: "18px 20px", borderLeft: `3px solid ${C.gold}`, marginBottom: "32px" }}>
          <p style={{ fontFamily: bf, fontSize: "14px", color: C.med, lineHeight: 1.6, margin: 0 }}>📓 After each principle, you'll capture your key takeaway. These feed directly into your session plan.</p>
        </div>
      </FadeIn>
      <FadeIn delay={800}><div style={{ textAlign: "center" }}><Btn filled onClick={onNext}>Start Reading →</Btn></div></FadeIn>
    </div>
  </div>
);

// ═══════════════════════════════════════════
// SCREEN 10: RESEARCH PRINCIPLES
// ═══════════════════════════════════════════

const ResearchPrinciples = ({ onNext, onBack, answers, setAnswers, teamType }) => {
  const curated = curatePrinciples(answers);
  const [idx, setIdx] = useState(0);
  const [ak, setAk] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const remaining = allPrinciples.filter(p => !curated.find(c => c.id === p.id));
  const [moreIdx, setMoreIdx] = useState(0);

  // Scroll to top when principle changes
  useEffect(() => { window.scrollTo(0, 0); }, [idx, moreIdx, showMore]);

  // If showing more principles after midpoint
  if (showMore && remaining.length > 0) {
    const p = remaining[moreIdx];
    const isLast = moreIdx === remaining.length - 1;
    return (
      <div style={{ minHeight: "100vh", background: C.white }}>
        <Nav onBack={() => { if (moreIdx === 0) { setShowMore(false); } else { setAk(k=>k+1); setMoreIdx(i=>i-1); }}} label={`Principle ${curated.length + moreIdx + 1} of ${allPrinciples.length}`} />
        <div style={{ maxWidth: "560px", margin: "0 auto", padding: "28px 24px 80px" }}>
          <PrincipleCard key={`m-${ak}`} p={p} answers={answers} setAnswers={setAnswers} />
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
            <Btn filled onClick={() => { if (isLast) { onNext(); } else { setAk(k=>k+1); setMoreIdx(i=>i+1); }}}>{isLast ? "Continue →" : "Next →"}</Btn>
          </div>
        </div>
      </div>
    );
  }

  const p = curated[idx];
  const isLast = idx === curated.length - 1;

  // Midpoint check
  if (isLast && idx > 0) {
    return (
      <div style={{ minHeight: "100vh", background: C.white }}>
        <Nav onBack={() => { setAk(k=>k+1); setIdx(i=>i-1); }} label={`Principle ${idx + 1} of ${curated.length}`} />
        <div style={{ maxWidth: "560px", margin: "0 auto", padding: "28px 24px 80px" }}>
          <PrincipleCard key={`p-${ak}`} p={p} answers={answers} setAnswers={setAnswers} />
          <FadeIn delay={200}>
            <div style={{ background: C.soft, padding: "24px", marginTop: "24px", textAlign: "center" }}>
              <p style={{ fontFamily: hf, fontSize: "13px", letterSpacing: "2px", textTransform: "uppercase", color: C.gold, marginBottom: "8px" }}>{curated.length} of {allPrinciples.length} Principles Complete</p>
              <p style={{ fontFamily: hf, fontSize: "22px", fontWeight: 300, color: C.teal, marginBottom: "8px" }}>Ready for your plan, or <span style={{ fontWeight: 600 }}>want to keep reading?</span></p>
              <p style={{ fontFamily: bf, fontSize: "14px", color: C.med, marginBottom: "20px" }}>There are {remaining.length} more research principles you can explore. Or you can go straight to your session plan.</p>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                <Btn filled onClick={onNext}>Build My Session Plan →</Btn>
                <Btn secondary onClick={() => setShowMore(true)}>Review {remaining.length} More</Btn>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: C.white }}>
      <Nav onBack={() => { if (idx === 0) { onBack(); } else { setAk(k=>k+1); setIdx(i=>i-1); }}} label={`Principle ${idx + 1} of ${curated.length}`} />
      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "28px 24px 80px" }}>
        <PrincipleCard key={`p-${ak}`} p={p} answers={answers} setAnswers={setAnswers} />
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
          <Btn filled onClick={() => { setAk(k=>k+1); setIdx(i=>i+1); }}>Next →</Btn>
        </div>
      </div>
    </div>
  );
};

const PrincipleCard = ({ p, answers, setAnswers }) => {
  // Find a connected reflection answer
  const reflectionText = Object.entries(answers).find(([k, v]) => {
    if (!v || k.startsWith("takeaway_")) return false;
    const lower = v.toLowerCase();
    return p.triggers.some(t => lower.includes(t));
  });

  return (
    <FadeIn delay={0}>
      <div style={{ marginBottom: "8px" }}>
        <h3 style={{ fontFamily: hf, fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 600, color: C.teal, lineHeight: 1.3, marginBottom: "16px" }}>{p.title}</h3>
        <p style={{ fontFamily: bf, fontSize: "16px", color: C.med, lineHeight: 1.8, marginBottom: "20px" }}>{p.body}</p>

        {reflectionText && (
          <div style={{ background: `${C.teal}08`, padding: "14px 16px", borderLeft: `3px solid ${C.teal}`, marginBottom: "20px" }}>
            <p style={{ fontFamily: hf, fontSize: "13px", letterSpacing: "1.5px", textTransform: "uppercase", color: C.gold, marginBottom: "4px" }}>Connected to what you wrote</p>
            <p style={{ fontFamily: bf, fontSize: "15px", fontStyle: "italic", color: C.dark, lineHeight: 1.5, margin: 0 }}>"{reflectionText[1]}"</p>
          </div>
        )}

        <div style={{ display: "flex", gap: "0", marginBottom: "20px" }}>
          <div style={{ flex: 1, padding: "16px", background: C.soft, borderRight: `1px solid ${C.line}` }}>
            <p style={{ fontFamily: hf, fontSize: "13px", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: C.faded, marginBottom: "8px" }}>The familiar way</p>
            <p style={{ fontFamily: bf, fontSize: "15px", color: C.med, lineHeight: 1.6, margin: 0 }}>{p.familiar}</p>
          </div>
          <div style={{ flex: 1, padding: "16px", background: `${C.teal}06` }}>
            <p style={{ fontFamily: hf, fontSize: "13px", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: C.teal, marginBottom: "8px" }}>The emerging way</p>
            <p style={{ fontFamily: bf, fontSize: "15px", color: C.dark, lineHeight: 1.6, margin: 0 }}>{p.emerging}</p>
          </div>
        </div>

        <p style={{ fontFamily: bf, fontSize: "13px", color: C.faded, fontStyle: "italic", marginBottom: "16px" }}>{p.citation}</p>

        <div style={{ marginBottom: "8px" }}>
          <label style={{ fontFamily: hf, fontSize: "16px", fontWeight: 600, color: C.dark, display: "block", marginBottom: "4px" }}>Your takeaway from this:</label>
          <p style={{ fontFamily: bf, fontSize: "14px", fontStyle: "italic", color: C.faded, marginBottom: "6px" }}>What surprised you, challenged you, or confirmed something you already felt?</p>
          <textarea placeholder="Write here…" value={answers[`takeaway_${p.id}`] || ""} onChange={e => setAnswers(prev => ({ ...prev, [`takeaway_${p.id}`]: e.target.value }))}
            style={{ width: "100%", minHeight: "80px", padding: "14px", border: `1px solid ${C.line}`, background: "rgba(255,255,255,0.7)", fontFamily: bf, fontSize: "15px", lineHeight: 1.6, color: C.dark, resize: "vertical", outline: "none", boxSizing: "border-box" }}
            onFocus={e => e.target.style.borderColor = C.teal} onBlur={e => e.target.style.borderColor = C.line} />
        </div>
      </div>
    </FadeIn>
  );
};

// ═══════════════════════════════════════════
// SCREEN 11: BREAK 2
// ═══════════════════════════════════════════

const Break2 = ({ onNext, onBack }) => (
  <div style={{ minHeight: "100vh", background: `linear-gradient(180deg, ${C.cream} 0%, ${C.soft} 100%)` }}>
    <Nav onBack={onBack} label="Break" />
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "40px 24px 80px", textAlign: "center", minHeight: "calc(100vh - 60px)",
    }}>
    <FadeIn delay={200}><p style={{ fontFamily: hf, fontSize: "14px", letterSpacing: "3px", textTransform: "uppercase", color: C.gold, marginBottom: "28px" }}>Part 2 Complete</p></FadeIn>
    <FadeIn delay={500}><h2 style={{ fontFamily: hf, fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 300, color: C.teal, lineHeight: 1.2, maxWidth: "480px", marginBottom: "20px" }}>Now let's make it <span style={{ fontWeight: 600 }}>concrete.</span></h2></FadeIn>
    <FadeIn delay={800}>
      <p style={{ fontFamily: bf, fontSize: "16px", color: C.med, lineHeight: 1.7, maxWidth: "440px", marginBottom: "40px" }}>We'll use everything you shared to design three facilitation sessions — with activities, learning objectives, and instructions personalized to your team.</p>
    </FadeIn>
    <FadeIn delay={1100}><Btn filled onClick={onNext}>Build My Plan →</Btn></FadeIn>
    </div>
  </div>
);


// ═══════════════════════════════════════════
// ACTIVITY BANK — session-specific
// ═══════════════════════════════════════════

const shared = {
  arrive: [
    { id: "music", name: "Music & Quotes Arrival", time: "5 min", desc: "Music playing as people walk in. Quotes on tables. No instructions — just arrive.", how: "Choose warm, present music (Khruangbin, Hiatus Kaiyote). Print 8–10 quotes on cardstock. Let people settle and feel the room.", transition: "Let the music fade. Stand. Make eye contact before speaking." },
  ],
  open: [
    { id: "story", name: "Facilitator Sets the Container", time: "5 min", desc: "Open with a short personal story about culture — a time you experienced it working or breaking. Name what this session is and isn't.", how: "Keep under 3 minutes. Be real, slightly vulnerable. End with: 'This isn't about fixing anything. It's about seeing what's here.' Set ground rules: speak from experience, listen to understand, what's shared stays.", transition: "'Before we get into the work, I want us to actually see each other.'" },
  ],
  close: [
    { id: "one_word", name: "One Word Round", time: "5 min", desc: "One word for how this session felt. Go around. No commentary.", how: "Start with yourself. Go in order. Don't explain. End with: 'Notice what you notice this week.'", transition: null },
    { id: "takeaway", name: "Carrying & Committing", time: "8 min", desc: "'One thing I'm carrying from today, and one thing I'll do differently this week.' Write it. Share it.", how: "Give 2 min to write, then go around. Short — one sentence each.", transition: null },
    { id: "gratitude", name: "Gratitude Snap", time: "5 min", desc: "Name one thing someone else said that stuck with you. End with a collective deep breath.", how: "Go around. 'Something someone said today that I'm still thinking about...' Close with one breath together.", transition: null },
  ],
};

const sessionActs = [
  // SESSION 1: THE DESIRE
  {
    connect: [
      { id: "who_are_you", name: "Who Are You, Really?", time: "15 min", desc: "Three rounds. 1: Name and role. 2: Something nobody here knows. 3: What you actually care about — not the work version.", how: "Go first to model depth. Round 1 fast. Round 2, give 30 sec to think. Round 3: 'Not what you care about at work — in your life.' Expect nervous laughter. Let it land.", transition: "Let the room sit 5 seconds after the last share. 'Now that we've seen each other more clearly — let's go deeper.'" },
      { id: "paired_stories", name: "Paired Story Exchange", time: "15 min", desc: "Pairs: 'Tell me about a time you felt completely yourself at work. What made that possible?' 5 min each, uninterrupted.", how: "Emphasize uninterrupted. Ring a bell to switch. After both, 2 min for natural conversation.", transition: "'You just gave someone full attention for 5 minutes. That quality of attention is what we're building.'" },
      { id: "empathy_walk", name: "Empathy Walk", time: "25 min", desc: "Pairs walk slowly. One speaks for 10 min about what brought them here. The other only listens. Switch.", how: "Go outside if possible. Walking removes face-to-face pressure. 'Your only job is to be with this person. No advice. Just receive.' Return in silence.", transition: "'Most people have never been truly listened to for 10 minutes. That's the foundation of psychological safety.'" },
    ],
    experience: [
      { id: "visualization", name: "Guided Visualization + Journal", time: "15 min", desc: "Eyes closed: 'Imagine this team one year from now, at its best. Walk through a day.' Then 5 min silent journaling.", how: "Dim lights. Speak slowly. Prompts: arriving at work, energy, a meeting, a disagreement, end of day. 'Write whatever came up. Don't edit.'", transition: "'You each visited the same team but saw something different. We're about to hear what you saw.'" },
      { id: "pride_wall", name: "Pride Wall", time: "12 min", desc: "Everyone writes: 'A moment I felt proud to work here was...' Post on wall. Gallery walk in silence.", how: "Sticky notes, 3 min to write, many as they want. Post. 'Walk and read. Don't talk.' 3–4 min silence. Sit.", transition: "'You know what this team is proud of. Next: what do we want to be proud of that we're not yet?'" },
    ],
    share: [
      { id: "triads_desire", name: "Triads: What Did You See?", time: "18 min", desc: "Groups of three. Each shares what came up. Listen for overlap. 'What did all three of you want?'", how: "Count off so people aren't with usual allies. One shares, two listen. 3 min: 'What pattern do you hear?' Each triad reports one pattern.", transition: "'Let's hear the patterns — one per group. Just the pattern, not individual stories.'" },
      { id: "fishbowl", name: "Fishbowl: What We Want", time: "20 min", desc: "3–4 people sit center, talk openly about what they want this team to become. Others listen. Rotate.", how: "4 inner chairs, one empty for tap-in. 'Not a performance — a conversation we witness.' 2–3 rounds of 5 min.", transition: "'What you just witnessed is the beginning of a shared vision — built from multiple voices.'" },
    ],
    create: [
      { id: "mural", name: "Shared Culture Mural", time: "25 min", desc: "Large paper on the wall. Everyone draws, writes, and collages the culture they want. No talking for the first 10 min.", how: "Markers, magazines, tape. 'Make it visible.' Silence first, then conversation. Step back and look together.", transition: "'This is your first shared artifact. It doesn't have to be perfect. It has to be honest.'" },
      { id: "manifesto_draft", name: "Culture Manifesto Draft", time: "25 min", desc: "'How We Want to Work.' Three prompts: 'We thrive when... We struggle when... We commit to...'", how: "Break into 3 groups, one prompt each. 10 min to draft. Come back, read aloud, edit together.", transition: "'You now have something on paper that didn't exist an hour ago. It'll change — that's the point.'" },
    ],
  },
  // SESSION 2: THE TRUTH / THE DEFAULTS
  {
    connect: [
      { id: "honest_check", name: "Honest Check-In", time: "12 min", desc: "'What's one thing on your mind about this team that you haven't said out loud?' No responses — just receiving.", how: "Set the tone: 'This round is for truth-telling. After each person speaks, we sit with it. No fixing, no reassuring.' Keep strict — no crosstalk.", transition: "'Thank you. What you just heard is the starting material for today's work.'" },
      { id: "temperature", name: "Temperature Reading", time: "10 min", desc: "Five rounds: appreciations, puzzles, complaints with recommendations, new information, hopes and wishes.", how: "From Virginia Satir. Go quickly through each category. 'Complaints — but you must pair each with a recommendation.' Keep energy up.", transition: "'You just covered the full range of what's alive in this team. Now let's go deeper into what's really in the way.'" },
    ],
    experience: [
      { id: "body_sculpture", name: "Culture Sculpture", time: "12 min", desc: "In silence, use your body to show 'how this team feels right now.' Hold it. Then: 'how I want it to feel.' Notice what moved.", how: "From Social Presencing Theater. 'No wrong way. Let your body show what words might not.' 30 sec per sculpture. 'Look around without changing.' After both: 'The movement between 1 and 2 — that's the change.'", transition: "'What your body just told you is data. A different kind than what's in your head.'" },
      { id: "unsaid_wall", name: "The Unsaid Wall", time: "15 min", desc: "Anonymous. Everyone writes what 'everyone knows but nobody says.' Fold and put in a bowl. Facilitator reads aloud.", how: "Identical paper and pens. 'Write what's true but uncomfortable. No names, no blame.' Read each slowly. Let the room absorb. Don't discuss yet.", transition: "'Now you know what's in the room. The question isn't whether these are true — it's what we do about them.'" },
      { id: "act_it_out", name: "Act Out the Culture", time: "15 min", desc: "Small groups: 60-second scene of 'a typical day here.' Then: 'how we wish it felt.' Watch both back to back.", how: "Groups of 3–4. 5 min to prepare each. No acting skill needed. After both: 'What changed between scene 1 and scene 2?'", transition: "'The gap between those two scenes — that's what we're here to close.'" },
    ],
    share: [
      { id: "triads_truth", name: "Triads: What's Real?", time: "18 min", desc: "'What confirmed something you already knew? What surprised you?' Listen for the gap between what we say and what's real.", how: "One speaks, two listen. Together: 'What's the biggest gap this team is living with?' Each triad reports.", transition: "'Naming the gap is the hardest part. You just did it. Now: what do we do about it?'" },
      { id: "silent_sort", name: "Silent Sort", time: "15 min", desc: "Post all the unsaid things on the wall. In silence, group them into themes. Then name each theme together.", how: "No talking during the sort. People move things until it feels right. Step back. Together: 'What would we call each cluster?'", transition: "'These themes are your team's actual agenda — the one underneath the calendar.'" },
    ],
    create: [
      { id: "gap_map", name: "Gap Map", time: "25 min", desc: "Two columns: 'What we say' vs. 'What we actually do.' Fill in together. Circle the 2–3 gaps that matter most.", how: "Start with low-stakes examples. Get specific — not 'we value feedback' but 'we say we want feedback but nobody speaks in all-hands.' Vote on top 3.", transition: "'You just named the work. These gaps are what Session 3 is for — designing something different.'" },
      { id: "commitment_wall", name: "Commitment Wall", time: "20 min", desc: "Each person writes 1 personal commitment and 1 team ask. Sign it. Photograph it.", how: "Personal: 'What I'll do differently starting tomorrow.' Team: 'What I need from us.' Post and read aloud.", transition: "'Take a photo. Next session, we start by looking at this and telling the truth about what happened.'" },
    ],
  },
  // SESSION 3: THE SHIFT / THE DESIGN
  {
    connect: [
      { id: "revisit", name: "Revisit Last Session", time: "12 min", desc: "Look at Session 2 commitments. Go around: 'What I actually did. What I didn't. What I noticed.'", how: "'No shame — just honesty. The point isn't perfection, it's noticing.' Go first to model accountability. 1 min each.", transition: "'Now you know what's possible and what's hard. That's exactly what we need to design for.'" },
      { id: "appreciation_round", name: "Appreciation Round", time: "10 min", desc: "Each person names one specific thing someone did since last session that made a difference.", how: "'Not general — specific. Not 'you're great' but 'when you did X in that meeting, it changed the conversation.' Direct address.", transition: "'What you just named is the culture already shifting. Let's design the systems to make it stick.'" },
    ],
    experience: [
      { id: "design_sprint", name: "Decision Rights Design", time: "20 min", desc: "Map top 5 recurring decisions. For each: who decides, who's consulted, who's informed. Redesign what doesn't match your values.", how: "List decisions on cards. Current state vs. desired state. Where do you want more voice? Less bottleneck? Simple RACI structure.", transition: "'You just redesigned how power flows. That's not a poster — that's how work actually changes.'" },
      { id: "ritual_design", name: "Ritual Design", time: "20 min", desc: "Design 3 team rituals: how you start the week, how you handle conflict, how you celebrate. Be specific.", how: "'A ritual isn't a meeting — it's a practice.' Groups of 2–3, one ritual each. Present back. Refine together.", transition: "'Rituals are how culture becomes automatic. You just built the first three.'" },
      { id: "future_meeting", name: "The Future Meeting", time: "15 min", desc: "Run an actual meeting using all the new norms. Real agenda item. Practice the culture you designed.", how: "Pick a real, low-stakes agenda item. Apply the decision rights, conflict norms, rituals. Debrief: 'What felt different? What was hard?'", transition: "'That was your first meeting in the new culture. Now you know what you're aiming for.'" },
    ],
    share: [
      { id: "triads_design", name: "Triads: What Will Stick?", time: "15 min", desc: "'Of everything we designed, what will actually stick? What needs a champion? What might die quietly?'", how: "Be honest — not everything survives. Name what needs active protection. Each triad: '1 thing that will stick, 1 that needs a champion.'", transition: "'Now you know what to protect. Let's make it concrete.'" },
      { id: "plus_delta", name: "Plus / Delta", time: "12 min", desc: "Two columns: what's working about how we're changing (plus) and what we'd adjust (delta).", how: "Post-its, 2 min to write, post, cluster. Delta means 'here's what I'd try differently' — not complaints.", transition: "'This is how the team keeps itself honest. Make Plus/Delta a regular practice.'" },
    ],
    create: [
      { id: "culture_charter", name: "Culture Charter", time: "25 min", desc: "One page. How we decide. How we disagree. How we show up. Who we want to be. Sign it.", how: "Use everything from all 3 sessions. Pairs, one section each. Come back, read aloud, wordsmith. Print. Everyone signs.", transition: "'This isn't a drawer document. Put it where you see it. Revisit in 30 days.'" },
      { id: "thirty_day_plan", name: "30-Day Action Plan", time: "20 min", desc: "Three commitments: 1 thing to start, 1 to stop, 1 to protect. Name who owns each. Set a check-in date.", how: "Full group — not individual. 'This is a team commitment.' Large paper. Photograph. Put the check-in in everyone's calendar before leaving.", transition: "'You have a plan, a date, and each other. That's enough to start.'" },
    ],
  },
];

const sessionPhases = [
  { key: "arrive", label: "Arrive", time: "5 min", desc: "Music, quotes, settling in." },
  { key: "open", label: "Open", time: "5 min", desc: "Facilitator sets the container." },
  { key: "connect", label: "Connect", time: "10–15 min", desc: "See each other. Get honest." },
  { key: "experience", label: "Experience", time: "15–20 min", desc: "Feel something together before analyzing." },
  { key: "share", label: "Share", time: "12–18 min", desc: "Surface patterns from what happened." },
  { key: "create", label: "Create", time: "20–25 min", desc: "Build something visible from what emerged." },
  { key: "close", label: "Close", time: "5–8 min", desc: "Land it. Carry something out." },
];

const getPhaseActivities = (phaseKey, sessionIdx) => {
  if (shared[phaseKey]) return shared[phaseKey];
  return sessionActs[sessionIdx]?.[phaseKey] || [];
};

// ═══════════════════════════════════════════
// SESSION PLAN GENERATION
// ═══════════════════════════════════════════

const generatePlan = (answers, teamType) => {
  const isNew = teamType === "new";
  return {
    sessions: [
      {
        title: "The Desire", subtitle: isNew ? "Who are we, and what do we want?" : "What do we want this team to become?",
        time: "~90 min · Week 1",
        objectives: [
          "Create genuine connection beyond roles and titles",
          isNew ? "Surface each person's hopes for the team they're joining" : "Name what's working and what the team actually wants",
          "Co-create a shared vision that belongs to everyone, not just the leader",
        ],
      },
      {
        title: isNew ? "The Defaults" : "The Truth",
        subtitle: isNew ? "What patterns will we repeat if we're not careful?" : "What's real vs. what we pretend?",
        time: "~90 min · Week 2",
        objectives: [
          isNew ? "Surface the habits and patterns each person brings from past teams" : "Name the gaps between what the team says and what it actually does",
          isNew ? "Identify which inherited patterns serve the new team and which don't" : "Create safety to say the things everyone knows but nobody says",
          isNew ? "Build shared awareness of what to protect against" : "Identify 2–3 specific gaps the team commits to closing",
        ],
      },
      {
        title: isNew ? "The Design" : "The Shift",
        subtitle: isNew ? "What will we build together?" : "What changes, and how?",
        time: "~90 min · Week 3",
        objectives: [
          "Review commitments from Session 2 with honesty",
          isNew ? "Design the team's operating system: how you decide, disagree, and show up" : "Redesign specific systems and practices that perpetuate the old culture",
          "Leave with a concrete 30-day plan with names and dates attached",
        ],
      },
    ],
  };
};

const generateNoticings = (answers) => {
  const text = Object.values(answers).filter(Boolean).join(" ").toLowerCase();
  const noticings = [];
  if (/trust|honest|safe|push back|disagree|risk/i.test(text))
    noticings.push("Trust came up repeatedly in your reflections. Pay attention to whether people are performing safety or actually feeling it. The difference shows up in body language more than words.");
  if (/gap|say.*do|pretend|unsaid|everyone knows/i.test(text))
    noticings.push("You named say/do gaps — places where stated values don't match lived experience. This is the hardest thing for a leader to sit with because you're part of the gap. Stay curious about your own contribution.");
  if (/afraid|fear|scared|worry|risk/i.test(text))
    noticings.push("There's fear in your reflections. That's not weakness — it's data. The things you're afraid of are likely the things most worth moving toward.");
  if (/decision|meeting|structure|process|accountability/i.test(text))
    noticings.push("You're thinking about systems — how decisions get made, how meetings run. Session 3 will help your team redesign these together.");
  if (/my part|my role|I contribute|I do/i.test(text))
    noticings.push("You showed real willingness to examine your own part. That's rare. Your team will follow the depth you model.");
  if (noticings.length === 0)
    noticings.push("Your reflections show someone thinking carefully about their team. Trust that. The sessions are designed to hold what emerges — you don't have to have it figured out before you walk in.");
  return noticings;
};

// ═══════════════════════════════════════════
// EXPANDABLE ACTIVITY CARD
// ═══════════════════════════════════════════

const ActivityCard = ({ activity, selected, onSelect, onTryDifferent, onEdit, hasAlternatives, color }) => {
  const [expanded, setExpanded] = useState(false);
  const inputStyle = { fontFamily: bf, fontSize: "14px", color: C.dark, lineHeight: 1.5, width: "100%", border: `1px solid ${C.line}`, outline: "none", background: C.white, resize: "vertical", padding: "6px 8px", boxSizing: "border-box" };
  return (
    <div style={{ marginBottom: "12px" }}>
      <div style={{ border: `1.5px solid ${selected ? color : C.line}`, background: selected ? `${color}06` : C.white, transition: "all 0.2s", position: "relative" }}>
        {/* Select bar */}
        <div onClick={onSelect} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px 0", cursor: "pointer" }}>
          <p style={{ fontFamily: hf, fontSize: "13px", color: C.faded, margin: 0 }}>{activity.time}</p>
          <span style={{ width: "22px", height: "22px", borderRadius: "50%", background: selected ? color : C.line, color: "white", fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "center" }}>{selected ? "✓" : ""}</span>
        </div>
        {/* Editable fields */}
        <div style={{ padding: "8px 16px 12px" }}>
          <input value={activity.name} onChange={e => onEdit?.({ ...activity, name: e.target.value })}
            style={{ ...inputStyle, fontFamily: hf, fontSize: "16px", fontWeight: 600, marginBottom: "8px", background: selected ? "transparent" : C.white, border: `1px solid ${C.line}` }} />
          <textarea value={activity.desc} onChange={e => onEdit?.({ ...activity, desc: e.target.value })} rows={2}
            style={{ ...inputStyle, minHeight: "44px", background: selected ? "transparent" : C.white }} />
        </div>
        <div style={{ padding: "0 16px 10px", display: "flex", gap: "12px", alignItems: "center" }}>
          <button onClick={() => setExpanded(!expanded)} style={{ background: "none", border: "none", fontFamily: hf, fontSize: "13px", color: C.teal, cursor: "pointer", padding: 0 }}>
            {expanded ? "▾ Hide facilitation notes" : "▸ How to facilitate this"}
          </button>
          {hasAlternatives && <button onClick={onTryDifferent} style={{ background: "none", border: "none", fontFamily: hf, fontSize: "13px", color: C.gold, cursor: "pointer", padding: 0 }}>↻ Try something different</button>}
        </div>
        {expanded && (
          <div style={{ padding: "0 16px 16px" }}>
            <div style={{ background: C.soft, padding: "14px" }}>
              <p style={{ fontFamily: hf, fontSize: "13px", fontWeight: 600, color: C.teal, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>Setup & Facilitation</p>
              <textarea value={activity.how || ""} onChange={e => onEdit?.({ ...activity, how: e.target.value })} rows={3}
                style={{ ...inputStyle, minHeight: "60px", background: "transparent", border: `1px solid ${C.line}` }} />
            </div>
            {activity.transition && (
              <div style={{ background: `${C.gold}08`, padding: "12px 14px", borderLeft: `2px solid ${C.gold}`, marginTop: "8px" }}>
                <p style={{ fontFamily: hf, fontSize: "13px", fontWeight: 600, color: C.gold, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "4px" }}>Transition</p>
                <textarea value={activity.transition || ""} onChange={e => onEdit?.({ ...activity, transition: e.target.value })} rows={2}
                  style={{ ...inputStyle, fontStyle: "italic", minHeight: "40px", background: "transparent", border: `1px solid ${C.line}` }} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════
// SESSION OVERVIEW
// ═══════════════════════════════════════════

const SessionOverview = ({ onNext, onBack, answers, teamType, plan, setPlan }) => {
  const isNew = teamType === "new";
  useEffect(() => { if (!plan) setPlan(generatePlan(answers, teamType)); }, []);
  if (!plan) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.white }}>
    <p style={{ fontFamily: hf, fontSize: "16px", color: C.teal, letterSpacing: "2px", textTransform: "uppercase" }}>Building your session plan…</p>
  </div>;

  const labels = ["The Desire", isNew ? "The Defaults" : "The Truth", isNew ? "The Design" : "The Shift"];
  const updateObj = (si, oi, val) => {
    setPlan({ ...plan, sessions: plan.sessions.map((s, i) => i === si ? { ...s, objectives: s.objectives.map((o, j) => j === oi ? val : o) } : s) });
  };

  return (
    <div style={{ minHeight: "100vh", background: C.white }}>
      <Nav onBack={onBack} label="Step 05 · Your Plan" />
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "32px 24px 80px" }}>
        <FadeIn delay={200}>
          <p style={{ fontFamily: hf, fontSize: "13px", letterSpacing: "2px", textTransform: "uppercase", color: C.gold, marginBottom: "8px" }}>Your Facilitation Plan</p>
          <h2 style={{ fontFamily: hf, fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 300, color: C.teal, lineHeight: 1.2, marginBottom: "8px" }}>
            Three Sessions to <span style={{ fontWeight: 600 }}>{isNew ? "Build" : "Transform"} Culture</span>
          </h2>
          <p style={{ fontFamily: bf, fontSize: "15px", color: C.med, lineHeight: 1.7, marginBottom: "28px" }}>Based on your reflections, here are learning objectives and recommended activities for each session. Everything is editable — this is your plan.</p>
        </FadeIn>

        {plan.sessions.map((s, si) => (
          <FadeIn key={si} delay={400 + si * 150}>
            <div style={{ border: `1px solid ${C.line}`, marginBottom: "20px", padding: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
                <p style={{ fontFamily: hf, fontSize: "18px", fontWeight: 600, color: si % 2 === 0 ? C.teal : C.gold, margin: 0 }}>{labels[si]}</p>
                <p style={{ fontFamily: hf, fontSize: "13px", color: C.faded, margin: 0 }}>{s.time}</p>
              </div>
              <p style={{ fontFamily: bf, fontSize: "14px", fontStyle: "italic", color: C.med, marginBottom: "12px" }}>{s.subtitle}</p>
              <p style={{ fontFamily: hf, fontSize: "13px", letterSpacing: "1.5px", textTransform: "uppercase", color: C.faded, marginBottom: "8px" }}>Learning Objectives</p>
              {s.objectives.map((obj, oi) => (
                <div key={oi} style={{ display: "flex", gap: "8px", marginBottom: "6px", alignItems: "flex-start" }}>
                  <span style={{ fontFamily: hf, fontSize: "13px", color: C.teal, marginTop: "6px", flexShrink: 0 }}>•</span>
                  <input value={obj} onChange={e => updateObj(si, oi, e.target.value)}
                    style={{ flex: 1, padding: "4px 6px", border: "1px solid transparent", fontFamily: bf, fontSize: "14px", color: C.dark, lineHeight: 1.5, outline: "none", background: "transparent", boxSizing: "border-box" }}
                    onFocus={e => e.target.style.borderColor = C.line} onBlur={e => e.target.style.borderColor = "transparent"} />
                </div>
              ))}
            </div>
          </FadeIn>
        ))}

        <FadeIn delay={900}>
          <div style={{ background: C.soft, padding: "20px", marginBottom: "28px" }}>
            <p style={{ fontFamily: hf, fontSize: "16px", fontWeight: 600, color: C.teal, marginBottom: "8px" }}>Every Session Follows the Same Arc</p>
            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "10px" }}>
              {sessionPhases.map((p, i) => (
                <span key={i} style={{ fontFamily: hf, fontSize: "14px", color: i % 2 === 0 ? C.teal : C.gold, fontWeight: 600 }}>{p.label}{i < sessionPhases.length - 1 ? <span style={{ color: C.faded, margin: "0 4px" }}>→</span> : ""}</span>
              ))}
            </div>
            <p style={{ fontFamily: bf, fontSize: "14px", color: C.med, lineHeight: 1.5, margin: 0 }}>Settle in → Set the container → Get honest → Feel something → Surface patterns → Build something → Carry it out.</p>
          </div>
        </FadeIn>

        <FadeIn delay={1000}><div style={{ textAlign: "center" }}><Btn filled onClick={onNext}>Start Building Session 1 →</Btn></div></FadeIn>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════
// SESSION BUILDER
// ═══════════════════════════════════════════

const SessionBuilder = ({ onNext, onBack, plan, setPlan, sessionIdx, teamType, answers, onNavigate }) => {
  const s = plan.sessions[sessionIdx];
  const isNew = teamType === "new";
  const labels = ["The Desire", isNew ? "The Defaults" : "The Truth", isNew ? "The Design" : "The Shift"];

  const [selections, setSelections] = useState(() => {
    if (s._selections) return s._selections;
    const init = {};
    sessionPhases.forEach(p => { init[p.key] = 0; });
    return init;
  });
  const [customActivities, setCustomActivities] = useState(s._custom || {});
  const [editedActivities, setEditedActivities] = useState(s._edits || {});

  useEffect(() => { window.scrollTo(0, 0); }, [sessionIdx]);

  const tryDifferent = (phaseKey) => {
    const opts = getPhaseActivities(phaseKey, sessionIdx);
    if (opts.length <= 1) return;
    const next = ((selections[phaseKey] || 0) + 1) % opts.length;
    setSelections({ ...selections, [phaseKey]: next });
    // Clear edits for this phase when swapping
    const e = { ...editedActivities }; delete e[phaseKey]; setEditedActivities(e);
  };

  const getDisplayActivity = (phaseKey) => {
    const opts = getPhaseActivities(phaseKey, sessionIdx);
    const base = opts[selections[phaseKey] || 0];
    if (!base) return null;
    const edits = editedActivities[phaseKey];
    return edits ? { ...base, ...edits } : base;
  };

  const updateObjective = (oi, val) => {
    const next = { ...plan, sessions: plan.sessions.map((sess, i) => i === sessionIdx ? { ...sess, objectives: sess.objectives.map((o, j) => j === oi ? val : o) } : sess) };
    setPlan(next);
  };

  const saveAndAdvance = () => {
    const next = { ...plan };
    next.sessions = next.sessions.map((sess, i) => i === sessionIdx ? { ...sess, _selections: selections, _custom: customActivities, _edits: editedActivities } : sess);
    setPlan(next);
    onNext();
  };

  return (
    <div style={{ minHeight: "100vh", background: C.white }}>
      <Nav onBack={onBack} label={`Building Session ${sessionIdx + 1}`} />
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "28px 24px 80px" }}>
        <div style={{ display: "flex", gap: "16px", marginBottom: "24px", justifyContent: "center" }}>
          {labels.map((h, i) => (
            <button key={i} onClick={() => {
              if (i === sessionIdx) return;
              // Save current session before navigating
              const next = { ...plan };
              next.sessions = next.sessions.map((sess, si) => si === sessionIdx ? { ...sess, _selections: selections, _custom: customActivities, _edits: editedActivities } : sess);
              setPlan(next);
              onNavigate(i);
            }} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: hf, fontSize: "14px", color: i === sessionIdx ? C.teal : C.faded, fontWeight: i === sessionIdx ? 600 : 400, borderBottom: i === sessionIdx ? `2px solid ${C.teal}` : "none", paddingBottom: "4px", padding: "4px 2px" }}>
              0{i + 1} · {h.split(" ").pop()}
            </button>
          ))}
        </div>

        <FadeIn delay={100}>
          <h3 style={{ fontFamily: hf, fontSize: "24px", fontWeight: 600, color: C.teal, marginBottom: "4px" }}>{labels[sessionIdx]}</h3>
          <p style={{ fontFamily: bf, fontSize: "15px", fontStyle: "italic", color: C.med, marginBottom: "16px" }}>{s.subtitle}</p>
          <div style={{ background: C.soft, padding: "14px 16px", marginBottom: "24px" }}>
            <p style={{ fontFamily: hf, fontSize: "13px", letterSpacing: "1.5px", textTransform: "uppercase", color: C.faded, marginBottom: "6px" }}>Learning Objectives</p>
            {s.objectives.map((o, i) => (
              <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "4px", alignItems: "flex-start" }}>
                <span style={{ fontFamily: hf, fontSize: "13px", color: C.teal, marginTop: "6px", flexShrink: 0 }}>•</span>
                <input value={o} onChange={e => updateObjective(i, e.target.value)}
                  style={{ flex: 1, padding: "4px 6px", border: "1px solid transparent", fontFamily: bf, fontSize: "14px", color: C.dark, lineHeight: 1.5, outline: "none", background: "transparent", boxSizing: "border-box" }}
                  onFocus={e => e.target.style.borderColor = C.line} onBlur={e => e.target.style.borderColor = "transparent"} />
              </div>
            ))}
          </div>
        </FadeIn>

        {sessionPhases.map(phase => {
          const opts = getPhaseActivities(phase.key, sessionIdx);
          if (!opts.length) return null;
          const selected = customActivities[phase.key] ? null : getDisplayActivity(phase.key);
          const isCustom = !!customActivities[phase.key];
          const pc = ["arrive", "connect", "experience", "create"].includes(phase.key) ? C.teal : C.gold;

          return (
            <FadeIn key={phase.key} delay={150}>
              <div style={{ marginBottom: "28px" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "4px" }}>
                  <p style={{ fontFamily: hf, fontSize: "18px", fontWeight: 600, color: pc, margin: 0 }}>{phase.label}</p>
                  <p style={{ fontFamily: hf, fontSize: "13px", color: C.faded, margin: 0 }}>{phase.time}</p>
                </div>
                <p style={{ fontFamily: bf, fontSize: "14px", color: C.med, marginBottom: "12px" }}>{phase.desc}</p>

                {selected && (
                  <ActivityCard activity={selected} selected={!isCustom}
                    onSelect={() => setCustomActivities({ ...customActivities, [phase.key]: null })}
                    onEdit={updated => setEditedActivities({ ...editedActivities, [phase.key]: { name: updated.name, desc: updated.desc, how: updated.how, transition: updated.transition } })}
                    onTryDifferent={() => tryDifferent(phase.key)} hasAlternatives={opts.length > 1} color={pc} />
                )}

                {isCustom && (
                  <div style={{ border: `1.5px solid ${pc}`, background: `${pc}06`, padding: "14px 16px", marginBottom: "8px", position: "relative" }}>
                    <span style={{ position: "absolute", top: "12px", right: "14px", width: "22px", height: "22px", borderRadius: "50%", background: pc, color: "white", fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "center" }}>✓</span>
                    <input value={customActivities[phase.key]?.name || ""} onChange={e => setCustomActivities({ ...customActivities, [phase.key]: { ...customActivities[phase.key], name: e.target.value } })} placeholder="Activity name"
                      style={{ width: "calc(100% - 32px)", padding: "4px 0", border: "none", borderBottom: `1px solid ${C.line}`, fontFamily: hf, fontSize: "16px", fontWeight: 600, color: C.dark, outline: "none", background: "transparent", marginBottom: "8px", boxSizing: "border-box" }} />
                    <textarea value={customActivities[phase.key]?.desc || ""} onChange={e => setCustomActivities({ ...customActivities, [phase.key]: { ...customActivities[phase.key], desc: e.target.value } })} placeholder="Brief description…"
                      style={{ width: "100%", minHeight: "48px", padding: "4px 0", border: "none", fontFamily: bf, fontSize: "14px", color: C.med, outline: "none", background: "transparent", resize: "vertical", boxSizing: "border-box" }} />
                  </div>
                )}

                <button onClick={() => {
                  if (isCustom) setCustomActivities({ ...customActivities, [phase.key]: null });
                  else setCustomActivities({ ...customActivities, [phase.key]: { name: "", desc: "" } });
                }} style={{ background: "none", border: "none", fontFamily: hf, fontSize: "13px", color: C.teal, cursor: "pointer", padding: "4px 0" }}>
                  {isCustom ? "← Use suggested activity" : "+ Create my own"}
                </button>
              </div>
            </FadeIn>
          );
        })}

        <div style={{ textAlign: "center" }}>
          <Btn filled onClick={saveAndAdvance}>
            {sessionIdx < 2 ? `Lock Session ${sessionIdx + 1} → Build Session ${sessionIdx + 2}` : "View Run Sheet →"}
          </Btn>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════
// RUN SHEET — expandable + noticings
// ═══════════════════════════════════════════

const RunSheet = ({ onNext, onBack, plan, teamType, answers }) => {
  const isNew = teamType === "new";
  const labels = ["The Desire", isNew ? "The Defaults" : "The Truth", isNew ? "The Design" : "The Shift"];
  const noticings = generateNoticings(answers);

  const getActivity = (session, phaseKey, si) => {
    if (session._custom?.[phaseKey]?.name) return session._custom[phaseKey];
    const opts = getPhaseActivities(phaseKey, si);
    const base = opts[session._selections?.[phaseKey] ?? 0] || null;
    if (!base) return null;
    const edits = session._edits?.[phaseKey];
    return edits ? { ...base, ...edits } : base;
  };

  const handlePrint = () => window.print();
  const handleEmail = () => {
    let body = "The Unfolding — Facilitation Run Sheet%0D%0A%0D%0A";
    plan.sessions.forEach((s, si) => {
      body += `Session ${si + 1}: ${labels[si]} (${s.time})%0D%0A`;
      body += `Objectives: ${s.objectives.join("; ")}%0D%0A`;
      sessionPhases.forEach(p => {
        const a = getActivity(s, p.key, si);
        if (a) body += `  ${p.label}: ${a.name} (${a.time || p.time})%0D%0A`;
      });
      body += "%0D%0A";
    });
    window.open(`mailto:?subject=The Unfolding — My Run Sheet&body=${body}`);
  };

  const RSActivity = ({ activity, phaseKey }) => {
    const [open, setOpen] = useState(false);
    const pc = ["arrive", "connect", "experience", "create"].includes(phaseKey) ? C.teal : C.gold;
    const phaseLabel = sessionPhases.find(p => p.key === phaseKey)?.label || "";
    return (
      <div style={{ marginBottom: "6px" }}>
        <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
          <p style={{ fontFamily: hf, fontSize: "13px", color: C.faded, width: "50px", flexShrink: 0, paddingTop: "2px" }}>{activity.time || "5 min"}</p>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: bf, fontSize: "14px", color: C.dark, margin: 0 }}>
              <span style={{ fontFamily: hf, fontWeight: 600, color: pc }}>{phaseLabel}</span>{" — "}{activity.name}
            </p>
            {activity.how && (
              <button onClick={() => setOpen(!open)} style={{ background: "none", border: "none", fontFamily: hf, fontSize: "12px", color: C.teal, cursor: "pointer", padding: "2px 0" }}>
                {open ? "▾ Hide details" : "▸ Facilitation notes"}
              </button>
            )}
            {open && activity.how && (
              <div style={{ background: C.soft, padding: "10px 12px", marginTop: "4px", marginBottom: "4px" }}>
                <p style={{ fontFamily: bf, fontSize: "13px", color: C.dark, lineHeight: 1.5, margin: 0 }}>{activity.how}</p>
                {activity.transition && <p style={{ fontFamily: bf, fontSize: "13px", fontStyle: "italic", color: C.gold, lineHeight: 1.5, margin: "6px 0 0" }}>Transition: {activity.transition}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ minHeight: "100vh", background: C.white }}>
      <Nav onBack={onBack} label="Your Run Sheet" />
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "32px 24px 80px" }}>
        <FadeIn delay={200}>
          <p style={{ fontFamily: hf, fontSize: "13px", letterSpacing: "2px", textTransform: "uppercase", color: C.gold, marginBottom: "8px" }}>Your Run Sheet</p>
          <h2 style={{ fontFamily: hf, fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 300, color: C.teal, lineHeight: 1.2, marginBottom: "8px" }}>Ready to <span style={{ fontWeight: 600 }}>Facilitate</span></h2>
          <p style={{ fontFamily: bf, fontSize: "15px", color: C.med, marginBottom: "28px" }}>Tap any activity to see facilitation notes. Print it or hold your phone while you lead.</p>
        </FadeIn>

        {plan.sessions.map((s, si) => (
          <FadeIn key={si} delay={400 + si * 150}>
            <div style={{ border: `1px solid ${C.line}`, marginBottom: "20px" }}>
              <div style={{ padding: "14px 16px", borderBottom: `1px solid ${C.line}` }}>
                <p style={{ fontFamily: hf, fontSize: "17px", fontWeight: 600, color: si % 2 === 0 ? C.teal : C.gold, marginBottom: "2px" }}>Session {si + 1}: {labels[si]}</p>
                <p style={{ fontFamily: hf, fontSize: "13px", color: C.faded, marginBottom: "6px" }}>{s.time}</p>
                {s.objectives.map((o, oi) => (
                  <p key={oi} style={{ fontFamily: bf, fontSize: "13px", color: C.med, lineHeight: 1.4, margin: "0 0 2px", paddingLeft: "4px" }}>• {o}</p>
                ))}
              </div>
              <div style={{ padding: "14px 16px" }}>
                {sessionPhases.map(phase => {
                  const a = getActivity(s, phase.key, si);
                  if (!a) return null;
                  return <RSActivity key={phase.key} activity={a} phaseKey={phase.key} />;
                })}
              </div>
            </div>
          </FadeIn>
        ))}

        {/* Who facilitates */}
        <FadeIn delay={900}>
          <div style={{ marginBottom: "28px" }}>
            <p style={{ fontFamily: hf, fontSize: "16px", fontWeight: 600, color: C.teal, marginBottom: "12px" }}>Who Facilitates?</p>
            {[
              { who: "You", pro: "Model vulnerability. Team sees you in it.", con: "Hard to hold space and participate." },
              { who: "Rotate", pro: "Distributes power. Builds capacity.", con: "Requires trust, skill and adequate time to plan." },
              { who: "External", pro: "You're fully in it. Someone holds space.", con: "Team may not feel comfortable. Costs money." },
            ].map((opt, i) => (
              <div key={i} style={{ display: "flex", gap: "12px", padding: "10px 0", borderBottom: i < 2 ? `1px solid ${C.line}` : "none" }}>
                <p style={{ fontFamily: hf, fontSize: "15px", fontWeight: 600, color: C.dark, width: "70px", flexShrink: 0 }}>{opt.who}</p>
                <div>
                  <p style={{ fontFamily: bf, fontSize: "14px", color: C.dark, margin: "0 0 2px" }}>+ {opt.pro}</p>
                  <p style={{ fontFamily: bf, fontSize: "14px", color: C.faded, margin: 0 }}>⚠ {opt.con}</p>
                </div>
              </div>
            ))}
            <div style={{ background: C.soft, padding: "14px 16px", marginTop: "16px" }}>
              <p style={{ fontFamily: bf, fontSize: "14px", color: C.med, margin: 0 }}>Want someone to hold the space while you participate? <span style={{ color: C.teal, fontWeight: 600 }}>The Unfolding team can help.</span></p>
            </div>
          </div>
        </FadeIn>

        {/* Noticings */}
        <FadeIn delay={1000}>
          <div style={{ background: `${C.teal}06`, padding: "20px", borderLeft: `3px solid ${C.teal}`, marginBottom: "28px" }}>
            <p style={{ fontFamily: hf, fontSize: "15px", fontWeight: 600, color: C.teal, marginBottom: "10px" }}>A Note From Your Reflections</p>
            <p style={{ fontFamily: bf, fontSize: "14px", fontStyle: "italic", color: C.faded, marginBottom: "10px" }}>Based on what you wrote, here's what we noticed:</p>
            {noticings.map((n, i) => (
              <p key={i} style={{ fontFamily: bf, fontSize: "14px", color: C.dark, lineHeight: 1.6, marginBottom: i < noticings.length - 1 ? "10px" : 0 }}>{n}</p>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={1100}>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginBottom: "16px" }}>
            <Btn onClick={handlePrint} small>Print</Btn>
            <Btn onClick={handleEmail} small>Email to Myself</Btn>
          </div>
          <div style={{ textAlign: "center" }}>
            <button onClick={onBack} style={{ background: "none", border: "none", fontFamily: hf, fontSize: "13px", color: C.faded, cursor: "pointer", letterSpacing: "1px", textTransform: "uppercase", display: "block", margin: "0 auto 24px" }}>← Edit sessions</button>
          </div>
          <div style={{ textAlign: "center" }}>
            <Btn filled onClick={onNext}>Finish →</Btn>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════
// SCREEN 15: COMPLETE
// ═══════════════════════════════════════════

const Complete = ({ onRestart }) => (
  <div style={{
    minHeight: "100vh", background: `linear-gradient(170deg, ${C.white} 0%, ${C.cream} 40%, ${C.soft} 100%)`,
    position: "relative", overflow: "hidden",
  }}>
    <div style={{ position: "absolute", top: "-200px", right: "-200px", width: "600px", height: "600px", borderRadius: "50%", border: `1px solid ${C.line}`, opacity: 0.3 }} />
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "80px 24px 60px", textAlign: "center" }}>
      <FadeIn delay={200}><p style={{ fontFamily: hf, fontSize: "14px", letterSpacing: "3px", textTransform: "uppercase", color: C.gold, marginBottom: "28px" }}>Journey Complete</p></FadeIn>
      <FadeIn delay={500}><h2 style={{ fontFamily: hf, fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 300, color: C.teal, lineHeight: 1.15, maxWidth: "560px", margin: "0 auto 24px" }}>You started this by reflecting on yourself.<br /><span style={{ fontWeight: 600 }}>Now build it together.</span></h2></FadeIn>
      <FadeIn delay={800}><p style={{ fontFamily: bf, fontSize: "16px", color: C.med, lineHeight: 1.7, maxWidth: "440px", margin: "0 auto 32px" }}>You have your reflections, the research, and a working session plan. Print it. Trust yourself in it.</p></FadeIn>
      <FadeIn delay={1000}><YT id="4NbPP93uLOo" /></FadeIn>
      <FadeIn delay={1200}>
        <p style={{ fontFamily: hf, fontSize: "13px", color: C.faded, letterSpacing: "1px", textTransform: "uppercase", marginTop: "24px", cursor: "pointer" }} onClick={onRestart}>← Return to Start</p>
      </FadeIn>
      <FadeIn delay={1200}><p style={{ fontFamily: hf, fontSize: "16px", color: C.gold, fontWeight: 600, marginTop: "40px" }}>The Unfolding</p></FadeIn>
    </div>
  </div>
);

// ═══════════════════════════════════════════
// APP
// ═══════════════════════════════════════════

export default function App() {
  const [userEmail, setUserEmail] = useState(null);
  const [screen, setScreen] = useState("login");
  const [hist, setHist] = useState([]);
  const [fade, setFade] = useState(false);
  const [answers, setAnswers] = useState({});
  const [teamType, setTeamType] = useState(null);
  const [plan, setPlan] = useState(null);
  const [buildSession, setBuildSession] = useState(0);
  const [saveStatus, setSaveStatus] = useState("");
  const saveTimeout = useRef(null);

  // Auto-save whenever state changes
  useEffect(() => {
    if (!userEmail || screen === "login") return;
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(async () => {
      try {
        const state = { screen, hist, answers, teamType, plan, buildSession };
        const answerCount = Object.keys(answers).length;
        const ok = await db.set(userEmail, state);
        if (ok) {
          setSaveStatus(`Saved (${answerCount} answers)`);
          console.log("Auto-saved:", { screen, answerCount, email: userEmail });
        } else {
          setSaveStatus("Save failed");
        }
        setTimeout(() => setSaveStatus(""), 3000);
      } catch (e) {
        console.error("Save failed:", e);
        setSaveStatus("Save failed");
        setTimeout(() => setSaveStatus(""), 3000);
      }
    }, 1500);
    return () => { if (saveTimeout.current) clearTimeout(saveTimeout.current); };
  }, [screen, answers, teamType, plan, buildSession, userEmail]);

  const handleLogin = (email, savedData) => {
    setUserEmail(email);
    if (savedData) {
      // Restore saved state
      if (savedData.answers) setAnswers(savedData.answers);
      if (savedData.teamType) setTeamType(savedData.teamType);
      if (savedData.plan) setPlan(savedData.plan);
      if (savedData.buildSession !== undefined) setBuildSession(savedData.buildSession);
      if (savedData.hist) setHist(savedData.hist);
      // Go to where they left off
      setFade(true);
      setTimeout(() => {
        setScreen(savedData.screen || "welcome");
        setFade(false);
        window.scrollTo(0, 0);
      }, 400);
    } else {
      go("welcome");
    }
  };

  const go = (next) => {
    setFade(true);
    setTimeout(() => { setHist(h => [...h, screen]); setScreen(next); setFade(false); window.scrollTo(0, 0); }, 400);
  };
  const back = () => {
    if (!hist.length) return;
    setFade(true);
    setTimeout(() => { const h = [...hist]; const l = h.pop(); setHist(h); setScreen(l); setFade(false); window.scrollTo(0, 0); }, 400);
  };

  const handleTeamSelect = (type) => {
    setTeamType(type);
    go("journey");
  };

  const advanceSession = () => {
    if (buildSession < 2) {
      setBuildSession(buildSession + 1);
      setFade(true);
      setTimeout(() => { setFade(false); window.scrollTo(0, 0); }, 400);
    } else {
      go("runsheet");
    }
  };

  const goBackFromSession = () => {
    if (buildSession > 0) {
      setBuildSession(buildSession - 1);
      setFade(true);
      setTimeout(() => { setFade(false); window.scrollTo(0, 0); }, 400);
    } else {
      back();
    }
  };

  return (
    <NavContext.Provider value={{ screen, goTo: go }}>
    <div>

      {/* Save indicator */}
      {saveStatus && screen !== "login" && (
        <div style={{
          position: "fixed", bottom: "20px", right: "20px", zIndex: 100,
          background: saveStatus.includes("failed") ? "#c44" : C.teal, color: C.white, fontFamily: hf, fontSize: "13px",
          letterSpacing: "1.5px", textTransform: "uppercase", padding: "10px 18px",
          opacity: 0.95, transition: "opacity 0.3s", borderRadius: "2px",
        }}>{saveStatus}</div>
      )}

      <div style={{ opacity: fade ? 0 : 1, transition: "opacity 0.4s ease" }}>
        {screen === "login" && <Login onLogin={handleLogin} />}
        {screen === "welcome" && <Welcome onNext={() => go("intro")} />}
        {screen === "intro" && <Intro onNext={() => go("fork")} onBack={back} />}
        {screen === "fork" && <TeamFork onSelect={handleTeamSelect} onBack={back} />}
        {screen === "journey" && <JourneyMap onNext={() => go("viz")} onBack={back} />}
        {screen === "viz" && <Visualization onNext={() => go("reflect")} onBack={back} teamType={teamType} />}
        {screen === "reflect" && <Reflect onNext={() => go("summary")} onBack={back} answers={answers} setAnswers={setAnswers} teamType={teamType} />}
        {screen === "summary" && <Summary onNext={() => go("break1")} onBack={back} answers={answers} teamType={teamType} />}
        {screen === "break1" && <Break1 onNext={() => go("researchIntro")} onBack={back} />}
        {screen === "researchIntro" && <ResearchIntro onNext={() => go("principles")} onBack={back} />}
        {screen === "principles" && <ResearchPrinciples onNext={() => go("break2")} onBack={back} answers={answers} setAnswers={setAnswers} teamType={teamType} />}
        {screen === "break2" && <Break2 onNext={() => go("sessionOverview")} onBack={back} />}
        {screen === "sessionOverview" && <SessionOverview onNext={() => { setBuildSession(0); go("sessionBuilder"); }} onBack={back} answers={answers} teamType={teamType} plan={plan} setPlan={setPlan} />}
        {screen === "sessionBuilder" && <SessionBuilder onNext={advanceSession} onBack={goBackFromSession} plan={plan} setPlan={setPlan} sessionIdx={buildSession} teamType={teamType} answers={answers} onNavigate={setBuildSession} />}
        {screen === "runsheet" && <RunSheet onNext={() => go("complete")} onBack={() => { setBuildSession(2); go("sessionBuilder"); }} plan={plan} teamType={teamType} answers={answers} />}
        {screen === "complete" && <Complete onRestart={() => { setHist([]); setScreen("welcome"); setAnswers({}); setTeamType(null); setPlan(null); setBuildSession(0); window.scrollTo(0, 0); }} />}
      </div>
    </div>
    </NavContext.Provider>
  );
}
