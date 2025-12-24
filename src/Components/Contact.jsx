// src/Components/Contact.jsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import emailjs from "emailjs-com";
import {
  FiMail,
  FiMessageSquare,
  FiSend,
  FiPhone,
  FiMapPin,
  FiUser,
  FiEdit3,
  FiInfo,
  FiCheckCircle,
  FiXCircle,
  FiZap,
  FiStar,
  FiTarget,
  FiCpu,
  FiTrendingUp,
  FiTool
} from "react-icons/fi";
import Snowfall from "react-snowfall";

const makeRng = (seed0) => {
  let seed = seed0 >>> 0;
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    subject: "",
    message: ""
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // parallax state (gated)
  const [smoothMouse, setSmoothMouse] = useState({ x: 0, y: 0 });
  const [magnet, setMagnet] = useState({ x: 0, y: 0 });

  // reduce motion + device characteristics
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);

  // section in-view gating
  const sectionRef = useRef(null);
  const [isSectionInView, setIsSectionInView] = useState(true);

  // pause heavy effects while scrolling
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimerRef = useRef(0);

  // stable seed
  const seedRef = useRef(Math.floor(Math.random() * 1_000_000_000));

  const targetMouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(0);
  const mountedRef = useRef(false);

  useEffect(() => {
    setIsVisible(true);
    mountedRef.current = true;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqMobile = window.matchMedia("(max-width: 1023px)");
    const mqCoarse = window.matchMedia("(pointer: coarse)");

    const apply = () => {
      setReduceMotion(mq.matches);
      setIsMobile(mqMobile.matches);
      setIsCoarsePointer(mqCoarse.matches);
    };

    apply();

    if (mq.addEventListener) {
      mq.addEventListener("change", apply);
      mqMobile.addEventListener("change", apply);
      mqCoarse.addEventListener("change", apply);
    } else {
      mq.addListener(apply);
      mqMobile.addListener(apply);
      mqCoarse.addListener(apply);
    }

    // init emailjs only if provided
    if (process.env.REACT_APP_EMAILJS_USER_ID) {
      emailjs.init(process.env.REACT_APP_EMAILJS_USER_ID);
    }

    return () => {
      mountedRef.current = false;

      if (mq.removeEventListener) {
        mq.removeEventListener("change", apply);
        mqMobile.removeEventListener("change", apply);
        mqCoarse.removeEventListener("change", apply);
      } else {
        mq.removeListener(apply);
        mqMobile.removeListener(apply);
        mqCoarse.removeListener(apply);
      }
    };
  }, []);

  // section in-view observer
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => setIsSectionInView(entry.isIntersecting),
      { threshold: 0.06 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // scrolling gating
  useEffect(() => {
    const onScroll = () => {
      setIsScrolling(true);
      window.clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = window.setTimeout(() => setIsScrolling(false), 140);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(scrollTimerRef.current);
    };
  }, []);

  const enableHeavyMotion = !reduceMotion && !isMobile && !isCoarsePointer;
  const heavyEffectsEnabled = enableHeavyMotion && isSectionInView && !isScrolling;

  // mouse parallax only when heavy enabled
  useEffect(() => {
    if (!heavyEffectsEnabled) {
      setSmoothMouse({ x: 0, y: 0 });
      return;
    }

    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 14;
      const y = (e.clientY / window.innerHeight - 0.5) * 14;
      targetMouseRef.current = { x, y };
    };

    window.addEventListener("mousemove", onMove, { passive: true });

    const tick = () => {
      if (!mountedRef.current) return;

      setSmoothMouse((prev) => {
        const t = targetMouseRef.current;
        const dx = t.x - prev.x;
        const dy = t.y - prev.y;
        const nx = prev.x + dx * 0.07;
        const ny = prev.y + dy * 0.07;

        if (Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001) return prev;
        return { x: nx, y: ny };
      });

      rafRef.current = window.requestAnimationFrame(tick);
    };

    rafRef.current = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.cancelAnimationFrame(rafRef.current);
    };
  }, [heavyEffectsEnabled]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  }, []);

  const validate = useCallback(() => {
    if (!formData.name.trim()) return "Please enter your name.";
    if (!formData.email.trim()) return "Please enter your email.";
    if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) return "Please enter a valid email.";
    if (!formData.subject.trim()) return "Please enter a subject.";
    if (!formData.message.trim()) return "Please write your message.";
    return "";
  }, [formData.email, formData.message, formData.name, formData.subject]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      const err = validate();
      if (err) {
        setErrorMessage(err);
        window.setTimeout(() => setErrorMessage(""), 4500);
        return;
      }

      setIsLoading(true);
      setErrorMessage("");

      const templateParams = {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        subject: formData.subject,
        message: formData.message
      };

      emailjs
        .send(
          process.env.REACT_APP_EMAILJS_SERVICE_ID,
          process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
          templateParams,
          process.env.REACT_APP_EMAILJS_USER_ID
        )
        .then(
          () => {
            setIsSubmitted(true);
            setIsLoading(false);
            setFormData({ name: "", email: "", mobile: "", subject: "", message: "" });
            window.setTimeout(() => setIsSubmitted(false), 4500);
          },
          () => {
            setErrorMessage("Failed to send the message. Please try again later.");
            setIsLoading(false);
            window.setTimeout(() => setErrorMessage(""), 5000);
          }
        );
    },
    [formData.email, formData.message, formData.mobile, formData.name, formData.subject, validate]
  );

  const handleMagnetMove = useCallback(
    (e) => {
      if (!heavyEffectsEnabled) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - (rect.left + rect.width / 2)) * 0.18;
      const y = (e.clientY - (rect.top + rect.height / 2)) * 0.18;
      setMagnet({ x, y });
    },
    [heavyEffectsEnabled]
  );

  const resetMagnet = useCallback(() => setMagnet({ x: 0, y: 0 }), []);

  // lighter counts, and fully off when heavy effects disabled
  const orbCount = heavyEffectsEnabled ? 8 : 0;
  const sparkleCount = heavyEffectsEnabled ? 26 : 0;
  const starCount = heavyEffectsEnabled ? 3 : 0;
  const floatIconCount = heavyEffectsEnabled ? 10 : 0;
  const confettiCount = heavyEffectsEnabled ? 18 : 12;

  const orbs = useMemo(() => {
    if (orbCount === 0) return [];
    const rng = makeRng(seedRef.current + 101);
    const colors = ["#22d3ee", "#38bdf8", "#3b82f6", "#e2e8f0"];
    return [...Array(orbCount)].map((_, i) => ({
      id: i,
      size: rng() * 260 + 160,
      left: rng() * 100,
      top: rng() * 100,
      color: colors[i % 4],
      delay: i * 0.55,
      duration: rng() * 14 + 18,
      blur: rng() * 10 + 18,
      opacity: rng() * 0.05 + 0.04
    }));
  }, [orbCount]);

  const sparkles = useMemo(() => {
    if (sparkleCount === 0) return [];
    const rng = makeRng(seedRef.current + 202);
    return [...Array(sparkleCount)].map((_, i) => ({
      id: i,
      size: rng() * 2.2 + 1.0,
      left: rng() * 100,
      top: rng() * 100,
      opacity: rng() * 0.22 + 0.06,
      delay: rng() * 5,
      duration: rng() * 10 + 10
    }));
  }, [sparkleCount]);

  const shootingStars = useMemo(() => {
    if (starCount === 0) return [];
    const rng = makeRng(seedRef.current + 303);
    return [...Array(starCount)].map((_, i) => ({
      id: i,
      top: rng() * 65,
      delay: rng() * 6 + i * 1.15,
      duration: rng() * 1.6 + 1.4,
      length: rng() * 200 + 150,
      opacity: rng() * 0.22 + 0.18
    }));
  }, [starCount]);

  const floatingIcons = useMemo(() => {
    if (floatIconCount === 0) return [];
    const rng = makeRng(seedRef.current + 404);
    const list = [FiMail, FiStar, FiTrendingUp, FiCpu, FiZap, FiTool, FiTarget, FiSend, FiMessageSquare, FiEdit3];
    return [...Array(floatIconCount)].map((_, i) => ({
      id: i,
      Icon: list[i % list.length],
      left: rng() * 100,
      top: rng() * 100,
      size: rng() * 16 + 14,
      rotate: rng() * 70 - 35,
      delay: rng() * 5,
      duration: rng() * 14 + 16,
      opacity: rng() * 0.12 + 0.05
    }));
  }, [floatIconCount]);

  const confetti = useMemo(() => {
    const rng = makeRng(seedRef.current + 505);
    const colors = ["#a855f7", "#ec4899", "#22d3ee", "#60a5fa", "#34d399"];
    return [...Array(confettiCount)].map((_, i) => ({
      id: i,
      left: rng() * 100,
      size: rng() * 7 + 6,
      delay: rng() * 0.25,
      duration: rng() * 1.05 + 1.05,
      color: colors[i % colors.length],
      rotate: rng() * 180
    }));
  }, [confettiCount]);

  const contactInfo = useMemo(
    () => [
      {
        label: "Email",
        value: "muhammadali43800@gmail.com",
        hint: "Best for detailed requests",
        color: "from-purple-500 to-pink-500",
        Icon: FiMail,
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        )
      },
      {
        label: "Phone",
        value: "+92 3137149438",
        hint: "Fast response on call or WhatsApp",
        color: "from-cyan-500 to-blue-500",
        Icon: FiPhone,
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
        )
      },
      {
        label: "Location",
        value: "Faisalabad, Pakistan",
        hint: "Timezone: PKT",
        color: "from-green-500 to-emerald-500",
        Icon: FiMapPin,
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )
      }
    ],
    []
  );

  const parallaxStyle = heavyEffectsEnabled
    ? { transform: `translate3d(${smoothMouse.x}px, ${smoothMouse.y}px, 0)`, transition: "transform 0.12s ease-out" }
    : undefined;

  const parallaxStyle2 = heavyEffectsEnabled
    ? {
        transform: `translate3d(${smoothMouse.x * 1.2}px, ${smoothMouse.y * 1.2}px, 0)`,
        transition: "transform 0.12s ease-out"
      }
    : undefined;

  const gridParallaxStyle = heavyEffectsEnabled
    ? {
        transform: `translate3d(${smoothMouse.x * 0.6}px, ${smoothMouse.y * 0.6}px, 0)`,
        transition: "transform 0.12s ease-out"
      }
    : undefined;

  const cardMagnetStyle = heavyEffectsEnabled
    ? { transform: `translate3d(${magnet.x}px, ${magnet.y}px, 0)`, transition: "transform 140ms ease-out" }
    : undefined;

  const showSnow = !reduceMotion && isSectionInView && !isScrolling;

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen flex items-center justify-center px-6 sm:px-8 lg:px-20 py-20 overflow-hidden"
      id="contact"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#05060c] via-[#070b18] to-[#03050b]" />

      {/* Snowfall, once, above bg, below content */}
      {showSnow && (
        <div className="absolute inset-0 z-[6] pointer-events-none">
          <Snowfall color="#82C3D9" snowflakeCount={80} style={{ width: "100%", height: "100%" }} />
        </div>
      )}

      {/* Blobs */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.58]" style={parallaxStyle}>
        <div className={`absolute -top-52 -left-52 w-[940px] h-[940px] rounded-full bg-purple-500/10 blur-3xl ${heavyEffectsEnabled ? "animate-blobA" : ""}`} />
        <div className={`absolute top-10 -right-56 w-[980px] h-[980px] rounded-full bg-pink-500/10 blur-3xl ${heavyEffectsEnabled ? "animate-blobB" : ""}`} />
        <div className={`absolute -bottom-56 left-1/3 w-[980px] h-[980px] rounded-full bg-cyan-500/10 blur-3xl ${heavyEffectsEnabled ? "animate-blobC" : ""}`} />
      </div>

      {/* Aurora */}
      <div className="absolute inset-0 pointer-events-none" style={parallaxStyle2}>
        <div className={`absolute -top-40 -left-40 w-[900px] h-[900px] rounded-full bg-cyan-500/10 blur-3xl ${heavyEffectsEnabled ? "animate-aurora-slow" : ""}`} />
        <div className={`absolute top-10 -right-40 w-[860px] h-[860px] rounded-full bg-sky-500/10 blur-3xl ${heavyEffectsEnabled ? "animate-aurora-slow delay-700" : ""}`} />
        <div className={`absolute -bottom-40 left-1/3 w-[900px] h-[900px] rounded-full bg-blue-500/10 blur-3xl ${heavyEffectsEnabled ? "animate-aurora-slow delay-300" : ""}`} />
      </div>

      {/* Orbs */}
      {heavyEffectsEnabled && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ contain: "paint" }}>
          {orbs.map((o) => (
            <div
              key={o.id}
              className="absolute rounded-full animate-float-smooth"
              style={{
                width: `${o.size}px`,
                height: `${o.size}px`,
                left: `${o.left}%`,
                top: `${o.top}%`,
                opacity: o.opacity,
                background: `radial-gradient(circle, ${o.color}, transparent 70%)`,
                animationDelay: `${o.delay}s`,
                animationDuration: `${o.duration}s`,
                filter: `blur(${o.blur}px)`,
                willChange: "transform, opacity",
                transform: "translateZ(0)"
              }}
            />
          ))}
        </div>
      )}

      {/* Sparkles */}
      {heavyEffectsEnabled && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ contain: "paint" }}>
          {sparkles.map((s) => (
            <div
              key={s.id}
              className="absolute rounded-full bg-white/70 animate-sparkle-drift"
              style={{
                width: `${s.size}px`,
                height: `${s.size}px`,
                left: `${s.left}%`,
                top: `${s.top}%`,
                opacity: s.opacity,
                animationDelay: `${s.delay}s`,
                animationDuration: `${s.duration}s`,
                filter: "blur(0.2px)"
              }}
            />
          ))}
        </div>
      )}

      {/* Shooting stars */}
      {heavyEffectsEnabled && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ contain: "paint" }}>
          {shootingStars.map((st) => (
            <div
              key={st.id}
              className="absolute animate-shoot"
              style={{
                top: `${st.top}%`,
                left: "-30%",
                width: `${st.length}px`,
                height: "2px",
                opacity: st.opacity,
                animationDelay: `${st.delay}s`,
                animationDuration: `${st.duration}s`,
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.55) 35%, rgba(34,211,238,0.45) 70%, rgba(255,255,255,0) 100%)",
                filter: "drop-shadow(0 0 10px rgba(34,211,238,0.18))"
              }}
            />
          ))}
        </div>
      )}

      {/* Floating icons */}
      {heavyEffectsEnabled && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ contain: "paint" }}>
          {floatingIcons.map((it) => (
            <div
              key={it.id}
              className="absolute select-none animate-emojiFloat"
              style={{
                left: `${it.left}%`,
                top: `${it.top}%`,
                opacity: it.opacity,
                filter: "drop-shadow(0 0 14px rgba(34,211,238,0.14))",
                ["--r"]: `${it.rotate}deg`,
                animationDelay: `${it.delay}s`,
                animationDuration: `${it.duration}s`,
                willChange: "transform"
              }}
              aria-hidden="true"
            >
              <it.Icon style={{ width: `${it.size}px`, height: `${it.size}px` }} className="text-white/90" />
            </div>
          ))}
        </div>
      )}

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34, 211, 238, 0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.18) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          ...gridParallaxStyle
        }}
      />

      {/* Scan overlay */}
      <div className={`absolute inset-0 pointer-events-none opacity-[0.10] mix-blend-overlay ${heavyEffectsEnabled ? "animate-scan" : ""}`}>
        <div className="h-full w-full bg-[linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_2px)] bg-[length:100%_6px]" />
      </div>

      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.55)_70%,rgba(0,0,0,0.85)_100%)]" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1300px]" style={cardMagnetStyle}>
        <div
          className={`text-center mb-14 sm:mb-16 transition-all duration-1000 transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
          }`}
        >
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight inline-block text-white">
            Contact{" "}
            <span
              className={`text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 ${
                heavyEffectsEnabled ? "animate-gradient" : ""
              }`}
              style={{ backgroundSize: "220% 220%" }}
            >
              Me
            </span>{" "}
            <span className={`inline-flex align-middle ${heavyEffectsEnabled ? "animate-bounceSoft" : ""}`} aria-hidden="true">
              <FiMail className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </span>
          </h2>

          <div className={`h-1 w-44 bg-gradient-to-r from-cyan-400 via-sky-500 to-transparent mx-auto mt-6 rounded-full ${heavyEffectsEnabled ? "animate-pulse-slow" : ""}`} />
          <div className={`mt-3 w-56 h-[1px] mx-auto opacity-60 bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent ${heavyEffectsEnabled ? "animate-pulseLine" : ""}`} />

          <p className="text-slate-200/80 text-base sm:text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
            Tell me about your project. I’ll reply with a clear plan, timeline, and next steps.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          <div
            className={`lg:col-span-5 transition-all duration-1000 delay-200 transform ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-20"
            }`}
          >
            <div className="bg-slate-900/45 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-7 sm:p-8 shadow-2xl shadow-black/25 overflow-hidden relative">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <div className={`pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/8 ${heavyEffectsEnabled ? "animate-borderGlow" : ""}`} />

              <h3 className="text-3xl font-extrabold text-white flex items-center gap-3">
                <span>Let’s talk</span>
                <span className={`inline-flex ${heavyEffectsEnabled ? "animate-miniWiggle" : ""}`} aria-hidden="true">
                  <FiMessageSquare className="w-6 h-6 text-white" />
                </span>
              </h3>

              <p className="text-slate-200/75 mt-2 leading-relaxed">
                Share your goal, features, and deadline. If you have a reference website, send it too.
              </p>

              <div className="mt-7 grid grid-cols-1 gap-4">
                {contactInfo.map((info) => (
                  <div
                    key={info.label}
                    className="group relative bg-slate-900/35 border border-slate-700/55 rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:border-cyan-400/30 hover:shadow-xl hover:shadow-cyan-400/10"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${info.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                    {heavyEffectsEnabled && (
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                        <div className="absolute -inset-y-10 -left-24 w-24 rotate-12 bg-white/10 blur-md group-hover:translate-x-[420px] transition-transform duration-700" />
                      </div>
                    )}

                    <div className="relative flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${info.color} flex items-center justify-center shadow-lg shrink-0`}>
                        <div className="text-white">{info.icon}</div>
                      </div>

                      <div className="min-w-0">
                        <div className="text-slate-300 text-sm font-semibold flex items-center gap-2">
                          <span>{info.label}</span>
                          <info.Icon className="w-4 h-4 text-slate-200/90" aria-hidden="true" />
                        </div>
                        <div className="text-white text-lg font-extrabold break-words mt-1">{info.value}</div>
                        <div className="text-slate-200/60 text-sm mt-1">{info.hint}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-gradient-to-br from-cyan-500/10 to-sky-500/10 border border-cyan-400/20 rounded-2xl p-6 relative overflow-hidden">
                {heavyEffectsEnabled && (
                  <div className="absolute inset-0 opacity-60 pointer-events-none animate-softSheen">
                    <div className="absolute -inset-y-10 -left-32 w-28 rotate-12 bg-white/10 blur-md" />
                  </div>
                )}

                <div className="text-white font-extrabold text-lg flex items-center gap-3">
                  <span>Quick note</span>
                  <span className={`inline-flex ${heavyEffectsEnabled ? "animate-sparklePop" : ""}`} aria-hidden="true">
                    <FiStar className="w-5 h-5 text-white" />
                  </span>
                </div>

                <div className="text-slate-200/80 mt-2 leading-relaxed">
                  I can build React frontends, Node APIs, and full stack apps, clean UI, smooth animations, and scalable code.
                </div>
              </div>
            </div>
          </div>

          <div
            className={`lg:col-span-7 transition-all duration-1000 delay-300 transform ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-20"
            }`}
          >
            <div className="bg-slate-900/45 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-7 sm:p-10 shadow-2xl shadow-black/25 overflow-hidden relative">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <div className={`pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/8 ${heavyEffectsEnabled ? "animate-borderGlow2" : ""}`} />

              <div className="flex items-start justify-between gap-4 mb-8">
                <div>
                  <h3 className="text-3xl sm:text-4xl font-extrabold text-white flex items-center gap-3">
                    <span>Send a message</span>
                    <span className={`inline-flex ${heavyEffectsEnabled ? "animate-miniWiggle" : ""}`} aria-hidden="true">
                      <FiMessageSquare className="w-6 h-6 text-white" />
                    </span>
                  </h3>
                  <p className="text-slate-200/70 mt-2 flex items-center gap-2">
                    <span>I usually reply quickly, especially during PKT daytime.</span>
                    <FiZap className="w-4 h-4 text-slate-200/80" aria-hidden="true" />
                  </p>
                </div>

                <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/35 border border-slate-700/55 text-slate-200 font-extrabold">
                  <span className={`w-2.5 h-2.5 rounded-full bg-green-400 ${heavyEffectsEnabled ? "animate-pulse" : ""}`} />
                  <span>Available</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6" onMouseMove={handleMagnetMove} onMouseLeave={resetMagnet}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field
                    label="Your Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Muhammad Ali"
                    required
                    Icon={FiUser}
                    enableHeavyMotion={heavyEffectsEnabled}
                  />
                  <Field
                    label="Your Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@email.com"
                    required
                    Icon={FiMail}
                    enableHeavyMotion={heavyEffectsEnabled}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field
                    label="Mobile (optional)"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="+92 3xx xxxxxxx"
                    Icon={FiPhone}
                    enableHeavyMotion={heavyEffectsEnabled}
                  />
                  <Field
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Project inquiry"
                    required
                    Icon={FiEdit3}
                    enableHeavyMotion={heavyEffectsEnabled}
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold mb-2 flex items-center gap-2">
                    <span>Message</span>
                    <FiInfo className="w-4 h-4 text-slate-200/80" aria-hidden="true" />
                  </label>

                  <div className="relative group">
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={7}
                      placeholder="Tell me what you want to build, features, deadline, and any reference links."
                      className="w-full px-6 py-4 bg-slate-900/35 border border-slate-700/55 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/10 transition-all duration-300 resize-none"
                      required
                    />

                    {heavyEffectsEnabled && (
                      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/8 to-sky-500/8" />
                        <div className="absolute -inset-y-10 -left-28 w-24 rotate-12 bg-white/10 blur-md group-hover:translate-x-[560px] transition-transform duration-700" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-start gap-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center justify-center gap-3 px-10 py-4 bg-cyan-400 text-black rounded-2xl font-extrabold text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span className="text-black">Send Message</span>
                        <FiSend className="w-5 h-5" aria-hidden="true" />
                      </>
                    )}
                  </button>

                  {isSubmitted && (
                    <div className="relative w-full">
                      <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        {confetti.map((c) => (
                          <span
                            key={c.id}
                            className={`absolute top-0 ${heavyEffectsEnabled ? "animate-confetti" : ""}`}
                            style={{
                              left: `${c.left}%`,
                              width: `${c.size}px`,
                              height: `${c.size}px`,
                              backgroundColor: c.color,
                              borderRadius: "2px",
                              animationDelay: `${c.delay}s`,
                              animationDuration: `${c.duration}s`,
                              transform: `translate3d(0,0,0) rotate(${c.rotate}deg)`
                            }}
                          />
                        ))}
                      </div>

                      <div className={`flex items-center gap-2 px-6 py-3 bg-green-500/10 border border-green-500/40 rounded-2xl text-green-300 ${heavyEffectsEnabled ? "animate-fadeInUp" : ""}`}>
                        <FiCheckCircle className="w-5 h-5" aria-hidden="true" />
                        <span>Message sent successfully!</span>
                      </div>
                    </div>
                  )}

                  {errorMessage && (
                    <div className={`flex items-center gap-2 px-6 py-3 bg-red-500/10 border border-red-500/40 rounded-2xl text-red-300 ${heavyEffectsEnabled ? "animate-fadeInUp" : ""}`}>
                      <FiXCircle className="w-5 h-5" aria-hidden="true" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="text-xs sm:text-sm text-slate-200/60 flex items-center gap-2">
                    <span>Tip, add your budget and deadline for a faster, more accurate reply.</span>
                    <FiTarget className="w-4 h-4 text-slate-200/70" aria-hidden="true" />
                  </div>
                </div>
              </form>

              <div className={`pointer-events-none absolute -bottom-24 left-1/2 -translate-x-1/2 w-[520px] h-[220px] rounded-full bg-cyan-400/10 blur-3xl ${heavyEffectsEnabled ? "animate-pulse-slow" : ""}`} />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-smooth {
          0%,
          100% { transform: translate3d(0, 0, 0); }
          25% { transform: translate3d(-10px, -10px, 0); }
          50% { transform: translate3d(10px, -8px, 0); }
          75% { transform: translate3d(-8px, 10px, 0); }
        }

        @keyframes aurora-slow {
          0%,
          100% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.65; }
          50% { transform: translate3d(16px, -12px, 0) scale(1.02); opacity: 0.88; }
        }

        @keyframes blobA {
          0%,
          100% { transform: translate3d(0, 0, 0) scale(1); }
          33% { transform: translate3d(22px, -18px, 0) scale(1.04); }
          66% { transform: translate3d(-18px, 20px, 0) scale(0.99); }
        }

        @keyframes blobB {
          0%,
          100% { transform: translate3d(0, 0, 0) scale(1.02); }
          33% { transform: translate3d(-20px, 14px, 0) scale(1.05); }
          66% { transform: translate3d(14px, -20px, 0) scale(0.99); }
        }

        @keyframes blobC {
          0%,
          100% { transform: translate3d(0, 0, 0) scale(1); }
          33% { transform: translate3d(14px, 18px, 0) scale(1.04); }
          66% { transform: translate3d(-20px, -14px, 0) scale(0.99); }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes gradient {
          0%,
          100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes pulse-slow {
          0%,
          100% { opacity: 0.55; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.06); }
        }

        @keyframes pulseLine {
          0%,
          100% { opacity: 0.18; transform: scaleX(0.85); }
          50% { opacity: 0.6; transform: scaleX(1); }
        }

        @keyframes scan {
          0% { transform: translateY(-35%); opacity: 0.05; }
          50% { opacity: 0.12; }
          100% { transform: translateY(35%); opacity: 0.05; }
        }

        @keyframes sparkle-drift {
          0% { transform: translate3d(0, 0, 0); opacity: 0.05; }
          20% { opacity: 0.35; }
          50% { transform: translate3d(14px, -16px, 0); opacity: 0.16; }
          100% { transform: translate3d(-10px, 12px, 0); opacity: 0.06; }
        }

        @keyframes emojiFloat {
          0%,
          100% { transform: translate3d(0, 0, 0) rotate(var(--r)); }
          25% { transform: translate3d(14px, -10px, 0) rotate(calc(var(--r) + 8deg)); }
          50% { transform: translate3d(-10px, -18px, 0) rotate(calc(var(--r) - 6deg)); }
          75% { transform: translate3d(10px, 12px, 0) rotate(calc(var(--r) + 5deg)); }
        }

        @keyframes shoot {
          0% { transform: translate3d(0, 0, 0) rotate(-12deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translate3d(160vw, 55vh, 0) rotate(-12deg); opacity: 0; }
        }

        @keyframes miniWiggle {
          0%,
          100% { transform: rotate(0deg); }
          50% { transform: rotate(10deg); }
        }

        @keyframes bounceSoft {
          0%,
          100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        @keyframes borderGlow {
          0%,
          100% { box-shadow: 0 0 0 rgba(34, 211, 238, 0); }
          50% { box-shadow: 0 0 44px rgba(34, 211, 238, 0.12); }
        }

        @keyframes borderGlow2 {
          0%,
          100% { box-shadow: 0 0 0 rgba(34, 211, 238, 0); }
          50% { box-shadow: 0 0 50px rgba(34, 211, 238, 0.12); }
        }

        @keyframes softSheen {
          0% { transform: translateX(-120%); opacity: 0.25; }
          50% { opacity: 0.35; }
          100% { transform: translateX(140%); opacity: 0.25; }
        }

        @keyframes confetti {
          0% { transform: translate3d(0, 0, 0) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translate3d(0, 120px, 0) rotate(220deg); opacity: 0; }
        }

        @keyframes sparklePop {
          0%,
          100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        .animate-float-smooth { animation: float-smooth ease-in-out infinite; will-change: transform; }
        .animate-aurora-slow { animation: aurora-slow ease-in-out infinite; animation-duration: 18s; will-change: transform, opacity; }
        .animate-blobA { animation: blobA 16s ease-in-out infinite; will-change: transform; }
        .animate-blobB { animation: blobB 18s ease-in-out infinite; will-change: transform; }
        .animate-blobC { animation: blobC 20s ease-in-out infinite; will-change: transform; }
        .animate-fadeInUp { animation: fadeInUp 0.55s ease-out both; }
        .animate-gradient { animation: gradient 4.5s ease infinite; }
        .animate-pulse-slow { animation: pulse-slow 4.5s ease-in-out infinite; }
        .animate-pulseLine { animation: pulseLine 2.8s ease-in-out infinite; }
        .animate-scan { animation: scan 9s ease-in-out infinite; }
        .animate-sparkle-drift { animation: sparkle-drift ease-in-out infinite; will-change: transform, opacity; }
        .animate-emojiFloat { animation: emojiFloat ease-in-out infinite; will-change: transform; }
        .animate-shoot { animation: shoot linear infinite; }
        .animate-miniWiggle { animation: miniWiggle 1.5s ease-in-out infinite; }
        .animate-bounceSoft { animation: bounceSoft 1.9s ease-in-out infinite; }
        .animate-borderGlow { animation: borderGlow 4.6s ease-in-out infinite; }
        .animate-borderGlow2 { animation: borderGlow2 4.8s ease-in-out infinite; }
        .animate-softSheen { animation: softSheen 3.2s ease-in-out infinite; }
        .animate-confetti { animation: confetti ease-out forwards; }
        .animate-sparklePop { animation: sparklePop 1.7s ease-in-out infinite; }

        .delay-300 { animation-delay: 300ms; }
        .delay-700 { animation-delay: 700ms; }

        @media (prefers-reduced-motion: reduce) {
          .animate-float-smooth,
          .animate-aurora-slow,
          .animate-blobA,
          .animate-blobB,
          .animate-blobC,
          .animate-fadeInUp,
          .animate-gradient,
          .animate-pulse-slow,
          .animate-pulseLine,
          .animate-scan,
          .animate-sparkle-drift,
          .animate-emojiFloat,
          .animate-shoot,
          .animate-miniWiggle,
          .animate-bounceSoft,
          .animate-borderGlow,
          .animate-borderGlow2,
          .animate-softSheen,
          .animate-confetti,
          .animate-sparklePop { animation: none !important; }
        }
      `}</style>
    </section>
  );
};

const Field = React.memo(function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  Icon,
  enableHeavyMotion
}) {
  return (
    <div>
      <label className="block text-slate-300 font-semibold mb-2 flex items-center gap-2">
        <span>{label}</span>
        {Icon ? <Icon className="w-4 h-4 text-slate-200/80" aria-hidden="true" /> : null}
        {required ? <span className="text-sky-300">*</span> : null}
      </label>

      <div className="relative group">
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full px-6 py-4 bg-slate-900/35 border border-slate-700/55 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/10 transition-all duration-300"
        />

        {enableHeavyMotion && (
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/7 to-sky-500/7" />
            <div className="absolute -inset-y-10 -left-28 w-24 rotate-12 bg-white/10 blur-md group-hover:translate-x-[520px] transition-transform duration-700" />
          </div>
        )}
      </div>
    </div>
  );
});

export default Contact;
