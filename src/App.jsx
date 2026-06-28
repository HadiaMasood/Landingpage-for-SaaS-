import { useState, useEffect, useRef } from "react";

// =====================================================================
// DATA
// =====================================================================

const HERO_PHRASES = ["actually loves", "can't live without", "brags about", "ships faster with"];

const FEATURES = [
  { icon: "🎯", title: "Smart task boards", desc: "AI-assisted prioritization keeps your team focused on what moves the needle, not just what's urgent.", color: "#FFF0EB" },
  { icon: "📊", title: "Live analytics", desc: "Real-time dashboards that surface blockers, trends, and wins before your weekly standup.", color: "#FFF8E0" },
  { icon: "💬", title: "Threaded collaboration", desc: "Keep context alive with discussions that live right next to the work — no more lost Slack threads.", color: "#FFF0F5" },
  { icon: "⚡", title: "Automation flows", desc: "Build no-code automations in minutes. Recurring tasks, reminders, and handoffs handled for you.", color: "#FFF0EB" },
  { icon: "🔗", title: "100+ integrations", desc: "Connect Slack, GitHub, Figma, Notion, and more. Flowly sits where your team already works.", color: "#FFF8E0" },
  { icon: "🔒", title: "Enterprise security", desc: "SOC 2 Type II, SSO, and granular permissions. Security that scales with your org chart.", color: "#FFF0F5" },
];

const TESTIMONIALS = [
  { name: "Sara R.", role: "Engineering Lead, Nexora", initials: "SR", bg: "#FFF0EB", color: "#E8452A", quote: "Flowly cut our sprint planning time in half. The AI suggestions are actually useful — not just noise.", stars: 5 },
  { name: "James M.", role: "Head of Product, Lumix", initials: "JM", bg: "#FFF8E0", color: "#C07A00", quote: "We replaced 4 tools with Flowly. Our team actually uses it — that says everything.", stars: 5 },
  { name: "Aisha P.", role: "CTO, Driftwork", initials: "AP", bg: "#FFF0F5", color: "#C0306A", quote: "The dashboard alone is worth switching. I finally know what my team is shipping without asking.", stars: 5 },
];

const PLANS = [
  { name: "Starter", price: "$0", period: "/month", popular: false, desc: "Perfect for freelancers and solo builders.", features: ["3 active projects", "Up to 5 members", "Basic analytics", "5GB storage"], cta: "Get started free", variant: "outline" },
  { name: "Pro", price: "$29", period: "/month", popular: true, desc: "For growing teams that need more power.", features: ["Unlimited projects", "Up to 50 members", "AI insights + automation", "100GB storage", "Priority support"], cta: "Start 14-day trial", variant: "solid" },
  { name: "Enterprise", price: "Custom", period: "", popular: false, desc: "Dedicated support and custom contracts.", features: ["Unlimited everything", "SSO + SAML", "SOC 2 compliance", "Dedicated manager"], cta: "Talk to sales", variant: "outline" },
];

const FAQS = [
  { q: "Is there a free trial?", a: "Yes! The Pro plan comes with a 14-day free trial. No credit card required to start." },
  { q: "Can I import from other tools?", a: "Absolutely. Flowly supports one-click import from Trello, Asana, Jira, and Notion." },
  { q: "How does billing work?", a: "You're billed monthly or annually. Annual saves you 25%. Cancel anytime, no questions asked." },
  { q: "Is my data secure?", a: "We're SOC 2 Type II certified, with end-to-end encryption and regular third-party audits." },
];

const LIVE_EVENTS = [
  { icon: "✅", text: "Aisha completed 'Q2 Roadmap Review'", time: "just now" },
  { icon: "⚡", text: "Sprint #22 auto-created by Flowly AI", time: "2s ago" },
  { icon: "💬", text: "James commented on 'Design Handoff'", time: "5s ago" },
  { icon: "🎯", text: "14 tasks moved to Done in Engineering", time: "12s ago" },
  { icon: "🔗", text: "Figma sync updated 3 components", time: "18s ago" },
  { icon: "📊", text: "Weekly report sent to 8 members", time: "30s ago" },
  { icon: "🚀", text: "Deployment triggered by automation", time: "1m ago" },
  { icon: "💡", text: "AI surfaced 2 blockers in Marketing", time: "2m ago" },
];

const SOCIAL_PROOFS = [
  { name: "Marco T.", location: "Milan", action: "just signed up" },
  { name: "Priya S.", location: "Bangalore", action: "started a free trial" },
  { name: "Chen W.", location: "Singapore", action: "upgraded to Pro" },
  { name: "Layla K.", location: "Dubai", action: "invited 5 teammates" },
  { name: "Tom B.", location: "London", action: "just signed up" },
  { name: "Ana R.", location: "São Paulo", action: "started a free trial" },
];

const COMPANIES = ["Nexora", "Lumix", "Driftwork", "Acmify", "Stackly", "Buildco", "Prismix", "Vortex", "Clario", "Zenflow"];

// =====================================================================
// HOOKS
// =====================================================================

/** Typewriter that cycles through an array of words */
function useTypewriter(words, speed = 75, pause = 2200) {
  const [display, setDisplay] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx];
    let timer;
    if (!deleting && charIdx < current.length) {
      timer = setTimeout(() => setCharIdx(c => c + 1), speed);
    } else if (!deleting && charIdx === current.length) {
      timer = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      timer = setTimeout(() => setCharIdx(c => c - 1), speed / 2);
    } else {
      setDeleting(false);
      setWordIdx(i => (i + 1) % words.length);
      setCharIdx(0);
    }
    setDisplay(current.slice(0, charIdx));
    return () => clearTimeout(timer);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return display;
}

/** Animates a number from 0 → target */
function useCountUp(target, duration = 1800, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return value;
}

/** Fires inView=true once element scrolls into viewport (never resets) */
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/** Page scroll progress 0–1 */
function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const total = scrollHeight - clientHeight;
      setProgress(total > 0 ? scrollTop / total : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return progress;
}

/** Mouse parallax — returns {x, y} in the range -1 to 1 */
function useMouseParallax() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e) => {
      setPos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return pos;
}

// =====================================================================
// SHARED COMPONENTS
// =====================================================================

/** Gradient scroll-progress bar pinned at very top */
function ScrollProgressBar({ progress }) {
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 3, zIndex: 200 }}>
      <div style={{
        height: "100%",
        width: `${progress * 100}%`,
        background: "linear-gradient(90deg, #E8452A, #FF6B4A, #FFB347)",
        transition: "width 0.1s linear",
        boxShadow: "0 0 10px rgba(232,69,42,0.55)",
      }} />
    </div>
  );
}

/** Wraps children with a fade-up-on-scroll reveal */
function AnimatedSection({ children, delay = 0, style = {} }) {
  const [ref, inView] = useInView(0.1);
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(28px)",
      transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      ...style,
    }}>
      {children}
    </div>
  );
}

/** Stat card that counts up then keeps slowly incrementing (live feel) */
function LiveStatCard({ label, target, suffix = "", start }) {
  const baseVal = useCountUp(target, 1600, start);
  const [extra, setExtra] = useState(0);

  useEffect(() => {
    if (!start) return;
    const delay = setTimeout(() => {
      const id = setInterval(() => {
        setExtra(e => e + Math.floor(Math.random() * 4) + 1);
      }, 2800 + Math.random() * 1500);
      return () => clearInterval(id);
    }, 1900);
    return () => clearTimeout(delay);
  }, [start]);

  const total = baseVal + extra;
  return (
    <div style={{ background: "linear-gradient(135deg,#FFF3EE,#FFF8F5)", border: "1px solid #FFD6CA", borderRadius: 12, padding: "0.9rem", textAlign: "left" }}>
      <div style={{ fontSize: "0.7rem", color: "#B07060", fontWeight: 500, marginBottom: 2 }}>{label}</div>
      <div style={{ fontFamily: "'Sora',sans-serif", fontSize: "1.4rem", fontWeight: 700, color: "#1E0E08" }}>
        {total.toLocaleString()}{suffix}
      </div>
      <div style={{ fontSize: "0.58rem", color: "#E8452A", fontWeight: 700, marginTop: 3, display: "flex", alignItems: "center", gap: 3 }}>
        <span style={{ animation: "pulse 1.5s infinite", display: "inline-block" }}>●</span> LIVE
      </div>
    </div>
  );
}

/** Animated horizontal bar */
function BarRow({ label, pct, color, animate }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (animate) { const t = setTimeout(() => setWidth(pct), 120); return () => clearTimeout(t); }
    else setWidth(0);
  }, [animate, pct]);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: 8 }}>
      <span style={{ fontSize: "0.72rem", color: "#7A4030", width: 60, flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: 8, background: "#FFE8E0", borderRadius: 50, overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 50, background: color, width: `${width}%`, transition: "width 1.2s cubic-bezier(.4,0,.2,1)" }} />
      </div>
      <span style={{ fontSize: "0.7rem", color: "#B07060", width: 30, textAlign: "right" }}>{pct}%</span>
    </div>
  );
}

/** Live activity feed that cycles through events */
function LiveFeed({ events, visible }) {
  const [idx, setIdx] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (!visible) return;
    const id = setInterval(() => {
      setShow(false);
      const t = setTimeout(() => {
        setIdx(i => (i + 1) % events.length);
        setShow(true);
      }, 350);
      return () => clearTimeout(t);
    }, 2600);
    return () => clearInterval(id);
  }, [visible, events.length]);

  const ev = events[idx];
  return (
    <div style={{
      marginTop: 12,
      padding: "0.6rem 0.8rem",
      background: "#FFF8F5",
      borderRadius: 8,
      border: "1px solid #FFD6CA",
      display: "flex",
      alignItems: "center",
      gap: 8,
      opacity: show ? 1 : 0,
      transform: show ? "translateY(0)" : "translateY(-5px)",
      transition: "opacity 0.35s, transform 0.35s",
    }}>
      <span style={{ fontSize: "0.85rem", flexShrink: 0 }}>{ev.icon}</span>
      <span style={{ fontSize: "0.72rem", color: "#4A2418", flex: 1 }}>{ev.text}</span>
      <span style={{ fontSize: "0.65rem", color: "#B07060", whiteSpace: "nowrap" }}>{ev.time}</span>
    </div>
  );
}

/** Feature card — staggered fade-up + icon wiggle on hover */
function FeatureCard({ f, delay = 0 }) {
  const [ref, inView] = useInView(0.08);
  const [hovered, setHovered] = useState(false);
  return (
    <div ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff",
        border: "1px solid #FFD6CA",
        borderRadius: 18,
        padding: "1.6rem",
        opacity: inView ? 1 : 0,
        transform: inView
          ? (hovered ? "translateY(-6px)" : "translateY(0)")
          : "translateY(24px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms, box-shadow 0.25s`,
        boxShadow: hovered ? "0 10px 32px rgba(232,69,42,0.12)" : "none",
        cursor: "default",
      }}>
      <div style={{
        width: 46, height: 46, borderRadius: 12, background: f.color,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.3rem", marginBottom: "1rem",
        transition: "transform 0.35s cubic-bezier(.4,0,.2,1)",
        transform: hovered ? "scale(1.14) rotate(-8deg)" : "scale(1) rotate(0deg)",
      }}>{f.icon}</div>
      <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: "1rem", fontWeight: 700, color: "#1E0E08", marginBottom: "0.4rem" }}>{f.title}</h3>
      <p style={{ fontSize: "0.87rem", color: "#7A4030", lineHeight: 1.6 }}>{f.desc}</p>
    </div>
  );
}

/** Auto-rotating testimonial carousel — click card or dot to select; hover pauses */
function TestimonialCarousel({ testimonials }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setActiveIdx(i => (i + 1) % testimonials.length), 4000);
    return () => clearInterval(id);
  }, [paused, testimonials.length]);

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "1.4rem", maxWidth: 900, margin: "0 auto 1.5rem" }}>
        {testimonials.map((t, i) => (
          <div key={i}
            onClick={() => { setActiveIdx(i); setPaused(true); }}
            style={{
              background: "#fff",
              border: activeIdx === i ? "2px solid #E8452A" : "1px solid #FFD6CA",
              borderRadius: 18,
              padding: "1.5rem",
              transition: "all 0.45s cubic-bezier(.4,0,.2,1)",
              transform: activeIdx === i ? "translateY(-6px) scale(1.02)" : "translateY(0) scale(1)",
              boxShadow: activeIdx === i ? "0 14px 40px rgba(232,69,42,0.18)" : "none",
              cursor: "pointer",
              opacity: activeIdx === i ? 1 : 0.68,
            }}>
            <div style={{ color: "#FFAA00", fontSize: "0.9rem", letterSpacing: 2, marginBottom: 10 }}>{"★".repeat(t.stars)}</div>
            <p style={{ fontSize: "0.9rem", color: "#4A2418", lineHeight: 1.65, marginBottom: "1.2rem", fontStyle: "italic" }}>"{t.quote}"</p>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: "50%", background: t.bg, color: t.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700 }}>{t.initials}</div>
              <div>
                <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#1E0E08" }}>{t.name}</div>
                <div style={{ fontSize: "0.75rem", color: "#B07060" }}>{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Indicator dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 8 }}>
        {testimonials.map((_, i) => (
          <button key={i}
            onClick={() => { setActiveIdx(i); setPaused(true); }}
            style={{
              width: activeIdx === i ? 28 : 8,
              height: 8, borderRadius: 50, padding: 0,
              background: activeIdx === i ? "#E8452A" : "#FFD6CA",
              border: "none", cursor: "pointer",
              transition: "all 0.35s",
            }} />
        ))}
      </div>
    </div>
  );
}

/** Pricing card */
function PricingCard({ plan, billingAnnual, showToast }) {
  const [hov, setHov] = useState(false);
  const displayPrice = billingAnnual && plan.price !== "$0" && plan.price !== "Custom"
    ? "$" + Math.round(parseInt(plan.price.replace("$", "")) * 0.75)
    : plan.price;
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: "#fff",
        border: plan.popular ? "2px solid #E8452A" : "1.5px solid #FFD6CA",
        borderRadius: 20, padding: "2rem",
        position: "relative",
        transition: "all 0.25s",
        transform: hov ? "translateY(-5px)" : "translateY(0)",
        boxShadow: hov ? "0 10px 30px rgba(232,69,42,0.12)" : plan.popular ? "0 4px 20px rgba(232,69,42,0.15)" : "none",
      }}>
      {plan.popular && (
        <div style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", background: "#E8452A", color: "#fff", fontSize: "0.72rem", fontWeight: 700, padding: "0.25rem 0.9rem", borderRadius: 50, whiteSpace: "nowrap" }}>
          Most popular
        </div>
      )}
      <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#B07060", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{plan.name}</div>
      <div style={{ fontFamily: "'Sora',sans-serif", fontSize: "2.6rem", fontWeight: 800, color: "#1E0E08", lineHeight: 1 }}>
        {displayPrice}<span style={{ fontSize: "1rem", fontWeight: 500, color: "#B07060" }}>{plan.period}</span>
      </div>
      <div style={{ fontSize: "0.85rem", color: "#7A4030", margin: "0.8rem 0 1.4rem", lineHeight: 1.5 }}>{plan.desc}</div>
      <ul style={{ listStyle: "none", padding: 0, marginBottom: "1.8rem" }}>
        {plan.features.map((f, j) => (
          <li key={j} style={{ fontSize: "0.85rem", color: "#4A2418", padding: "0.4rem 0", display: "flex", alignItems: "center", gap: 8, borderBottom: j < plan.features.length - 1 ? "1px solid #FFE8E0" : "none" }}>
            <span style={{ color: "#E8452A", fontWeight: 700 }}>✓</span>{f}
          </li>
        ))}
      </ul>
      <button onClick={() => showToast(`Starting ${plan.name} plan…`)}
        style={{ width: "100%", padding: "0.7rem", borderRadius: 50, fontSize: "0.92rem", fontWeight: 600, cursor: "pointer", transition: "all 0.2s", fontFamily: "Inter,sans-serif", border: "1.5px solid #E8452A", background: plan.variant === "solid" ? "#E8452A" : "transparent", color: plan.variant === "solid" ? "#fff" : "#E8452A" }}
        onMouseEnter={e => { e.currentTarget.style.background = plan.variant === "solid" ? "#C93820" : "#FFF0EB"; }}
        onMouseLeave={e => { e.currentTarget.style.background = plan.variant === "solid" ? "#E8452A" : "transparent"; }}>
        {plan.cta}
      </button>
    </div>
  );
}

/** Sliding-in social proof notification (bottom-left) */
function SocialProofToast({ proofs }) {
  const [visible, setVisible] = useState(false);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timeouts = [];
    function cycle(i) {
      setIdx(i);
      setVisible(true);
      const t1 = setTimeout(() => {
        setVisible(false);
        const t2 = setTimeout(() => cycle((i + 1) % proofs.length), 5000);
        timeouts.push(t2);
      }, 4000);
      timeouts.push(t1);
    }
    const t0 = setTimeout(() => cycle(0), 7000);
    timeouts.push(t0);
    return () => timeouts.forEach(clearTimeout);
  }, [proofs.length]);

  const proof = proofs[idx];
  return (
    <div style={{
      position: "fixed", bottom: 90, left: 20, zIndex: 9997,
      background: "#fff",
      border: "1px solid #FFD6CA",
      borderRadius: 14, padding: "0.75rem 1rem",
      boxShadow: "0 8px 32px rgba(232,69,42,0.14)",
      maxWidth: 255,
      display: "flex", alignItems: "center", gap: 10,
      opacity: visible ? 1 : 0,
      transform: visible ? "translateX(0) scale(1)" : "translateX(-130%) scale(0.95)",
      transition: "all 0.5s cubic-bezier(.4,0,.2,1)",
      pointerEvents: "none",
    }}>
      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#FFF0EB,#FFD6CA)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", flexShrink: 0 }}>👤</div>
      <div>
        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#1E0E08" }}>{proof.name} · {proof.location}</div>
        <div style={{ fontSize: "0.7rem", color: "#7A4030", marginTop: 2 }}>{proof.action} 🎉</div>
      </div>
    </div>
  );
}

/** Infinite scrolling company name ticker */
function CompanyTicker({ companies }) {
  // Triple the list so there's always content during the loop
  const items = [...companies, ...companies, ...companies];
  return (
    <div style={{ overflow: "hidden", padding: "1.1rem 0", background: "#FFF3EE", borderTop: "1px solid #FFE0D6", borderBottom: "1px solid #FFE0D6" }}>
      <div style={{ display: "flex", animation: "ticker 24s linear infinite", width: "max-content", alignItems: "center" }}>
        {items.map((c, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.7rem", padding: "0 1.8rem", flexShrink: 0 }}>
            <span style={{ color: "#E8452A", fontSize: "0.8rem" }}>✦</span>
            <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: "0.86rem", color: "#B07060", letterSpacing: "0.04em" }}>{c}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// =====================================================================
// MAIN PAGE
// =====================================================================

export default function FlowlyLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("tasks");
  const [openFaq, setOpenFaq] = useState(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const [barsAnimate, setBarsAnimate] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [billingAnnual, setBillingAnnual] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const statsRef = useRef(null);

  const heroPhrase = useTypewriter(HERO_PHRASES, 72, 2300);
  const scrollProgress = useScrollProgress();
  const parallax = useMouseParallax();

  // Scroll listener for navbar style
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Responsive breakpoint listener
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Hero dashboard intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStatsVisible(true); setBarsAnimate(true); } },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const handleEmailSubmit = () => {
    if (!emailInput.includes("@")) { showToast("Please enter a valid email!"); return; }
    setSubmitted(true);
    showToast("🎉 You're on the list!");
  };

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const navStyle = {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "1rem 2.5rem",
    background: scrollY > 20 ? "rgba(255,248,246,0.97)" : "transparent",
    backdropFilter: scrollY > 20 ? "blur(12px)" : "none",
    borderBottom: scrollY > 20 ? "1px solid #FFD6CA" : "1px solid transparent",
    position: "fixed", top: 3, left: 0, right: 0, zIndex: 100,
    transition: "all 0.3s",
  };

  const tabContent = {
    tasks: { emoji: "🗂️", title: "Drag-and-drop task boards", body: "Organize sprints, backlogs, and to-dos with smart AI suggestions that auto-prioritize based on deadlines and team capacity." },
    analytics: { emoji: "📈", title: "Real-time team analytics", body: "See velocity, blockers, and burndown charts live. Get weekly digest emails so leadership stays informed without extra meetings." },
    automations: { emoji: "⚙️", title: "No-code automation builder", body: "Set triggers and actions visually — auto-assign tasks, send Slack pings, move cards when conditions are met." },
  };

  return (
    <div style={{ fontFamily: "'Inter',sans-serif", background: "#FFF8F6", color: "#2D1A14", minHeight: "100vh", overflowX: "hidden" }}>

      {/* ── Scroll progress bar ─────────────────── */}
      <ScrollProgressBar progress={scrollProgress} />

      {/* ── Social proof toast ──────────────────── */}
      <SocialProofToast proofs={SOCIAL_PROOFS} />

      {/* ── Toast notification ──────────────────── */}
      {toastMsg && (
        <div style={{
          position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
          background: "#1E0E08", color: "#fff", padding: "0.75rem 1.5rem",
          borderRadius: 50, fontSize: "0.9rem", fontWeight: 600, zIndex: 9999,
          boxShadow: "0 4px 20px rgba(0,0,0,0.25)", animation: "fadeIn 0.3s",
        }}>{toastMsg}</div>
      )}

      {/* ── NAVBAR ──────────────────────────────── */}
      <nav style={navStyle}>
        <div style={{ fontFamily: "'Sora',sans-serif", fontSize: "1.4rem", fontWeight: 800, color: "#E8452A" }}>✦ Flowly</div>

        {/* Desktop links */}
        {!isMobile && (
          <ul style={{ display: "flex", gap: "2rem", listStyle: "none", margin: 0, padding: 0 }}>
            {[["Features", "features"], ["Pricing", "pricing"], ["FAQ", "faq"], ["Blog", ""]].map(([label, id]) => (
              <li key={label}>
                <a href={id ? `#${id}` : "#"}
                  onClick={e => { if (id) { e.preventDefault(); scrollTo(id); } }}
                  style={{ textDecoration: "none", color: "#7A4030", fontSize: "0.92rem", fontWeight: 500, transition: "color 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#E8452A"}
                  onMouseLeave={e => e.currentTarget.style.color = "#7A4030"}>{label}</a>
              </li>
            ))}
          </ul>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {!isMobile && (
            <button
              style={{ background: "#E8452A", color: "#fff", border: "none", padding: "0.55rem 1.4rem", borderRadius: 50, fontSize: "0.9rem", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#C93820"; e.currentTarget.style.transform = "scale(1.04)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#E8452A"; e.currentTarget.style.transform = "scale(1)"; }}
              onClick={() => showToast("🚀 Redirecting to signup…")}>
              Get started free
            </button>
          )}

          {/* Hamburger (mobile) */}
          {isMobile && (
            <button onClick={() => setMobileMenuOpen(o => !o)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", flexDirection: "column", gap: 5, zIndex: 110 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 22, height: 2, background: "#E8452A", borderRadius: 2,
                  transition: "all 0.3s",
                  transform: mobileMenuOpen
                    ? i === 0 ? "rotate(45deg) translate(5px, 5px)"
                    : i === 1 ? "scaleX(0)"
                    : "rotate(-45deg) translate(5px, -5px)"
                    : "none",
                }} />
              ))}
            </button>
          )}
        </div>
      </nav>

      {/* ── Mobile slide-down menu ─────────────── */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 99,
        background: "rgba(255,248,246,0.98)", backdropFilter: "blur(14px)",
        padding: "5rem 2rem 2.5rem",
        transform: mobileMenuOpen ? "translateY(0)" : "translateY(-105%)",
        transition: "transform 0.42s cubic-bezier(.4,0,.2,1)",
        display: "flex", flexDirection: "column", gap: "1.6rem",
        boxShadow: "0 12px 40px rgba(232,69,42,0.12)",
      }}>
        {[["Features", "features"], ["Pricing", "pricing"], ["FAQ", "faq"], ["Blog", ""]].map(([label, id]) => (
          <a key={label} href={id ? `#${id}` : "#"}
            onClick={e => { if (id) { e.preventDefault(); scrollTo(id); } }}
            style={{ fontFamily: "'Sora',sans-serif", fontSize: "1.4rem", fontWeight: 700, color: "#1E0E08", textDecoration: "none" }}>{label}</a>
        ))}
        <button onClick={() => { showToast("🚀 Redirecting to signup…"); setMobileMenuOpen(false); }}
          style={{ background: "#E8452A", color: "#fff", border: "none", padding: "0.85rem 2rem", borderRadius: 50, fontSize: "1rem", fontWeight: 600, cursor: "pointer", alignSelf: "flex-start" }}>
          Get started free
        </button>
      </div>

      {/* ── HERO ────────────────────────────────── */}
      <section style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "8rem 2rem 5rem", background: "linear-gradient(160deg,#FFF3EE 0%,#FFF8F0 50%,#FFF0F5 100%)", position: "relative", overflow: "hidden" }}>
        {/* Parallax orbs */}
        <div style={{ position: "absolute", width: 420, height: 420, background: "#FFB3A0", borderRadius: "50%", filter: "blur(70px)", opacity: 0.3, top: -80, left: -100, transform: `translate(${parallax.x * 18}px,${parallax.y * 18}px)`, transition: "transform 0.15s linear" }} />
        <div style={{ position: "absolute", width: 350, height: 350, background: "#FFD580", borderRadius: "50%", filter: "blur(70px)", opacity: 0.3, top: 60, right: -80, transform: `translate(${parallax.x * -12}px,${parallax.y * -12}px)`, transition: "transform 0.15s linear" }} />
        <div style={{ position: "absolute", width: 300, height: 300, background: "#FFB6CC", borderRadius: "50%", filter: "blur(70px)", opacity: 0.3, bottom: -60, left: "40%", transform: `translate(${parallax.x * 8}px,${parallax.y * 8}px)`, transition: "transform 0.15s linear" }} />

        {/* Announcement pill */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#FFF0EB", border: "1px solid #FFB59C", color: "#C43C1E", fontSize: "0.8rem", fontWeight: 600, padding: "0.3rem 0.9rem", borderRadius: 50, marginBottom: "1.5rem", position: "relative" }}>
          <span style={{ width: 7, height: 7, background: "#E8452A", borderRadius: "50%", display: "inline-block", animation: "pulse 1.8s infinite" }} />
          New — AI-powered workflows just launched
        </div>

        {/* Headline with typewriter */}
        <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(2.2rem,5vw,3.6rem)", fontWeight: 800, lineHeight: 1.12, color: "#1E0E08", maxWidth: 780, letterSpacing: -1.5, marginBottom: "1.2rem", position: "relative" }}>
          The workspace your team{" "}
          <span style={{ color: "#E8452A", display: "inline-block" }}>
            {heroPhrase}
            <span style={{ borderRight: "3px solid #E8452A", marginLeft: 1, animation: "blink 0.9s step-end infinite", display: "inline-block", verticalAlign: "baseline" }} />
          </span>
        </h1>

        <p style={{ fontSize: "1.05rem", color: "#7A4030", maxWidth: 520, lineHeight: 1.7, marginBottom: "2rem", position: "relative" }}>
          Flowly brings tasks, analytics, and collaboration into one warm, intuitive space.
        </p>

        {/* Email capture */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center", marginBottom: "2.5rem", position: "relative" }}>
          {!submitted ? (
            <>
              <input type="email" placeholder="you@company.com" value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleEmailSubmit()}
                style={{ padding: "0.8rem 1.2rem", borderRadius: 50, border: "1.5px solid #FFB59C", fontSize: "0.95rem", outline: "none", width: 240, background: "#fff", color: "#1E0E08", fontFamily: "Inter,sans-serif" }} />
              <button onClick={handleEmailSubmit}
                style={{ background: "#E8452A", color: "#fff", border: "none", padding: "0.8rem 1.8rem", borderRadius: 50, fontSize: "0.95rem", fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 18px rgba(232,69,42,0.35)", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#C93820"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#E8452A"; e.currentTarget.style.transform = "translateY(0)"; }}>
                Start free →
              </button>
            </>
          ) : (
            <div style={{ background: "#FFF0EB", border: "1.5px solid #E8452A", color: "#E8452A", padding: "0.8rem 2rem", borderRadius: 50, fontWeight: 600 }}>
              🎉 You're in! Check your inbox.
            </div>
          )}
        </div>

        {/* Live dashboard card */}
        <div ref={statsRef} style={{ background: "#fff", borderRadius: 20, border: "1px solid #FFD6CA", boxShadow: "0 12px 48px rgba(232,69,42,0.1)", padding: "1.4rem", maxWidth: 660, width: "100%", position: "relative", animation: "float 4s ease-in-out infinite" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "1rem" }}>
            {["#FF5F57", "#FEBC2E", "#28C840"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
            <span style={{ fontSize: "0.75rem", color: "#B07060", marginLeft: "auto", fontWeight: 500 }}>Flowly Dashboard · Q2 2025</span>
            <span style={{ display: "flex", alignItems: "center", gap: 3, background: "#FFF0EB", border: "1px solid #FFB59C", borderRadius: 50, padding: "2px 8px", fontSize: "0.6rem", color: "#E8452A", fontWeight: 700 }}>
              <span style={{ animation: "pulse 1.5s infinite", display: "inline-block" }}>●</span> LIVE
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.75rem", marginBottom: "1rem" }}>
            <LiveStatCard label="Revenue" target={84} suffix="k" start={statsVisible} />
            <LiveStatCard label="Active users" target={3481} start={statsVisible} />
            <LiveStatCard label="Tasks done" target={1204} start={statsVisible} />
          </div>
          <BarRow label="Design" pct={82} color="linear-gradient(90deg,#E8452A,#FF6B4A)" animate={barsAnimate} />
          <BarRow label="Engineering" pct={67} color="linear-gradient(90deg,#FFB347,#FFD580)" animate={barsAnimate} />
          <BarRow label="Marketing" pct={91} color="linear-gradient(90deg,#FF6B9D,#FFB6CC)" animate={barsAnimate} />
          {/* Live activity feed */}
          <LiveFeed events={LIVE_EVENTS} visible={statsVisible} />
        </div>
      </section>

      {/* ── Company ticker ───────────────────────── */}
      <CompanyTicker companies={COMPANIES} />

      {/* ── FEATURES TABS ───────────────────────── */}
      <section id="features" style={{ padding: "5rem 2rem", background: "#FFF8F6" }}>
        <AnimatedSection>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "#E8452A", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Explore features</div>
            <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(1.7rem,3.5vw,2.4rem)", fontWeight: 800, color: "#1E0E08", letterSpacing: -1 }}>See what Flowly can do</h2>
          </div>
        </AnimatedSection>
        <AnimatedSection delay={100}>
          <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginBottom: "2rem", flexWrap: "wrap" }}>
            {[["tasks", "Tasks"], ["analytics", "Analytics"], ["automations", "Automations"]].map(([key, label]) => (
              <button key={key} onClick={() => setActiveTab(key)}
                style={{ padding: "0.55rem 1.3rem", borderRadius: 50, fontSize: "0.88rem", fontWeight: 600, cursor: "pointer", transition: "all 0.2s", background: activeTab === key ? "#E8452A" : "#fff", color: activeTab === key ? "#fff" : "#7A4030", border: `1.5px solid ${activeTab === key ? "#E8452A" : "#FFD6CA"}` }}>
                {label}
              </button>
            ))}
          </div>
        </AnimatedSection>
        {/* Tab content — key prop re-mounts for animation */}
        <AnimatedSection delay={200}>
          <div key={activeTab} style={{ maxWidth: 600, margin: "0 auto", background: "#fff", border: "1px solid #FFD6CA", borderRadius: 20, padding: "2rem", textAlign: "center", animation: "fadeInUp 0.4s ease" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{tabContent[activeTab].emoji}</div>
            <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: "1.3rem", fontWeight: 700, color: "#1E0E08", marginBottom: "0.8rem" }}>{tabContent[activeTab].title}</h3>
            <p style={{ color: "#7A4030", lineHeight: 1.7 }}>{tabContent[activeTab].body}</p>
          </div>
        </AnimatedSection>
      </section>

      {/* ── FEATURE CARDS (staggered) ────────────── */}
      <section style={{ padding: "3rem 2rem 5rem", background: "#FFF8F6" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "1.4rem", maxWidth: 900, margin: "0 auto" }}>
          {FEATURES.map((f, i) => <FeatureCard key={i} f={f} delay={i * 90} />)}
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────── */}
      <section style={{ padding: "5rem 2rem", background: "linear-gradient(160deg,#FFF0EC,#FFF8EE,#FFF3F7)" }}>
        <AnimatedSection>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "#E8452A", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Testimonials</div>
            <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(1.7rem,3.5vw,2.4rem)", fontWeight: 800, color: "#1E0E08", letterSpacing: -1 }}>Teams love it</h2>
          </div>
        </AnimatedSection>
        <TestimonialCarousel testimonials={TESTIMONIALS} />
      </section>

      {/* ── PRICING ─────────────────────────────── */}
      <section id="pricing" style={{ padding: "5rem 2rem", background: "#FFF8F6" }}>
        <AnimatedSection>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "#E8452A", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Pricing</div>
            <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(1.7rem,3.5vw,2.4rem)", fontWeight: 800, color: "#1E0E08", letterSpacing: -1, marginBottom: "1.5rem" }}>Simple, honest pricing</h2>
            {/* Billing toggle */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 12, background: "#FFF0EB", border: "1px solid #FFD6CA", borderRadius: 50, padding: "0.4rem 0.8rem" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 600, color: billingAnnual ? "#B07060" : "#E8452A" }}>Monthly</span>
              <div onClick={() => setBillingAnnual(!billingAnnual)}
                style={{ width: 44, height: 24, background: billingAnnual ? "#E8452A" : "#FFB59C", borderRadius: 50, cursor: "pointer", position: "relative", transition: "background 0.3s" }}>
                <div style={{ width: 18, height: 18, background: "#fff", borderRadius: "50%", position: "absolute", top: 3, left: billingAnnual ? 23 : 3, transition: "left 0.3s" }} />
              </div>
              <span style={{ fontSize: "0.85rem", fontWeight: 600, color: billingAnnual ? "#E8452A" : "#B07060" }}>Annual <span style={{ background: "#FFF0EB", color: "#E8452A", border: "1px solid #FFB59C", borderRadius: 50, padding: "1px 7px", fontSize: "0.72rem" }}>−25%</span></span>
            </div>
          </div>
        </AnimatedSection>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "1.5rem", maxWidth: 840, margin: "0 auto" }}>
          {PLANS.map((plan, i) => (
            <AnimatedSection key={i} delay={i * 100}>
              <PricingCard plan={plan} billingAnnual={billingAnnual} showToast={showToast} />
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────── */}
      <section id="faq" style={{ padding: "5rem 2rem", background: "linear-gradient(160deg,#FFF0EC,#FFF8EE)" }}>
        <AnimatedSection>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "#E8452A", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>FAQ</div>
            <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(1.7rem,3.5vw,2.4rem)", fontWeight: 800, color: "#1E0E08", letterSpacing: -1 }}>Common questions</h2>
          </div>
        </AnimatedSection>
        <div style={{ maxWidth: 640, margin: "0 auto", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {FAQS.map((faq, i) => (
            <AnimatedSection key={i} delay={i * 80}>
              <div style={{ background: "#fff", border: "1px solid #FFD6CA", borderRadius: 14, overflow: "hidden" }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 1.25rem", background: "none", border: "none", cursor: "pointer", fontFamily: "Inter,sans-serif", fontSize: "0.95rem", fontWeight: 600, color: "#1E0E08", textAlign: "left" }}>
                  {faq.q}
                  <span style={{ color: "#E8452A", fontSize: "1.2rem", display: "inline-block", transition: "transform 0.3s", transform: openFaq === i ? "rotate(45deg)" : "rotate(0)" }}>+</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: "0 1.25rem 1rem", fontSize: "0.88rem", color: "#7A4030", lineHeight: 1.7, borderTop: "1px solid #FFE8E0", animation: "fadeInUp 0.3s ease" }}>
                    {faq.a}
                  </div>
                )}
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* ── CTA BAND ────────────────────────────── */}
      <section style={{ background: "linear-gradient(135deg,#E8452A,#FF6B4A,#FF9A7A)", padding: "4.5rem 2rem", textAlign: "center" }}>
        <AnimatedSection>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(1.6rem,3.5vw,2.4rem)", fontWeight: 800, color: "#fff", marginBottom: "0.8rem", letterSpacing: -0.5 }}>Start building something great</h2>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "1rem", marginBottom: "2rem" }}>Join 12,000+ teams already shipping faster with Flowly.</p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => showToast("🚀 Let's go!")}
              style={{ background: "#fff", color: "#E8452A", border: "none", padding: "0.85rem 2rem", borderRadius: 50, fontSize: "1rem", fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.2)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
              Get started free
            </button>
            <button onClick={() => showToast("📅 Booking demo…")}
              style={{ background: "transparent", color: "#fff", border: "2px solid rgba(255,255,255,0.6)", padding: "0.85rem 2rem", borderRadius: 50, fontSize: "1rem", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.6)"; e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "translateY(0)"; }}>
              Book a demo
            </button>
          </div>
        </AnimatedSection>
      </section>

      {/* ── FOOTER ──────────────────────────────── */}
      <footer style={{ background: "#1E0E08", padding: "3rem 2rem 1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "2fr 1fr 1fr 1fr", gap: "2rem", maxWidth: 900, margin: "0 auto 2rem" }}>
          <div style={{ gridColumn: isMobile ? "1 / -1" : "auto" }}>
            <div style={{ fontFamily: "'Sora',sans-serif", fontSize: "1.3rem", fontWeight: 800, color: "#E8452A", marginBottom: 8 }}>✦ Flowly</div>
            <p style={{ fontSize: "0.83rem", color: "#9A6050", lineHeight: 1.6 }}>The workspace teams love. Simple, smart, and built for how modern work actually happens.</p>
          </div>
          {[["Product", ["Features", "Integrations", "Pricing", "Changelog"]], ["Company", ["About", "Blog", "Careers", "Press"]], ["Legal", ["Privacy", "Terms", "Security", "Cookies"]]].map(([title, links]) => (
            <div key={title}>
              <h5 style={{ fontSize: "0.78rem", fontWeight: 700, color: "#D0A090", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>{title}</h5>
              {links.map(l => (
                <a key={l} href="#" style={{ display: "block", fontSize: "0.83rem", color: "#9A6050", textDecoration: "none", marginBottom: 6, transition: "color 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#E8452A"}
                  onMouseLeave={e => e.currentTarget.style.color = "#9A6050"}>{l}</a>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid #3A1C12", paddingTop: "1.2rem", textAlign: "center", fontSize: "0.78rem", color: "#6A3828", maxWidth: 900, margin: "0 auto" }}>© 2025 Flowly, Inc. All rights reserved.</div>
      </footer>

      {/* ── Global styles & keyframes ───────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');
        html { scroll-behavior: smooth; }
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        @keyframes float   { 0%,100%{transform:translateY(0)}   50%{transform:translateY(-10px)} }
        @keyframes pulse   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.45;transform:scale(1.4)} }
        @keyframes fadeIn  { from{opacity:0;transform:translateX(-50%) translateY(10px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
        @keyframes fadeInUp{ from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ticker  { from{transform:translateX(0)} to{transform:translateX(-33.333%)} }
        @keyframes blink   { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </div>
  );
}
