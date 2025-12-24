"use client";

import React, { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FaGithub, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FiArrowRight, FiCheckCircle, FiChevronLeft, FiChevronRight } from "react-icons/fi";

// Lazy load for performance (works in React CRA/Vite too)
const Snowfall = lazy(() => import("react-snowfall"));

const makeRng = (seed0) => {
  let seed = seed0 >>> 0;
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
};

const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "U";
  const first = parts[0]?.[0] || "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
  return (first + last).toUpperCase();
};

const Chip = React.memo(({ text }) => {
  return (
    <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-200 font-semibold text-sm sm:text-base sm:backdrop-blur-md hover:bg-white/10 transition-all duration-300 hover:scale-[1.03]">
      {text}
    </span>
  );
});

const SocialCircle = React.memo(({ href, borderHover, bgHover, iconHover, Icon, label }) => {
  const isExternal = href?.startsWith("http");

  return (
    <a
      href={href}
      aria-label={label}
      title={label}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={[
        "group w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-800/40 sm:backdrop-blur-sm border border-slate-700/70 flex items-center justify-center",
        "transition-all duration-300 hover:scale-110 hover:-translate-y-1 relative overflow-hidden",
        borderHover,
        bgHover
      ].join(" ")}
    >
      <span className="pointer-events-none absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="absolute inset-0 rounded-full ring-1 ring-white/10 animate-ringPulse" />
        <span className="absolute -inset-6 rounded-full border border-white/10 animate-orbit" />
      </span>

      <span className="pointer-events-none absolute -inset-y-8 -left-24 w-24 rotate-12 bg-white/10 blur-md opacity-0 group-hover:opacity-100 group-hover:translate-x-[220px] transition-all duration-700" />

      <Icon className={`w-7 h-7 sm:w-8 sm:h-8 text-slate-400 transition-colors ${iconHover}`} />

      <style jsx>{`
        @keyframes ringPulse {
          0% { transform: scale(1); opacity: 0.18; }
          100% { transform: scale(1.38); opacity: 0; }
        }
        @keyframes orbit {
          0% { transform: rotate(0deg); opacity: 0.2; }
          100% { transform: rotate(360deg); opacity: 0.2; }
        }
        .animate-ringPulse { animation: ringPulse 0.95s ease-out infinite; }
        .animate-orbit { animation: orbit 2.8s linear infinite; }

        @media (prefers-reduced-motion: reduce) {
          .animate-ringPulse,
          .animate-orbit { animation: none !important; }
        }
      `}</style>
    </a>
  );
});

const Home = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const sectionRef = useRef(null);
  const [inView, setInView] = useState(true);

  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimerRef = useRef(0);

  const seedRef = useRef(Math.floor(Math.random() * 1_000_000_000));

  const auroraRef = useRef(null);
  const gridRef = useRef(null);
  const imageRef = useRef(null);

  const targetRef = useRef({ x: 0, y: 0 });
  const smoothRef = useRef({ x: 0, y: 0 });
  const lastMoveRef = useRef(Date.now());
  const rafRef = useRef(0);

  // Testimonials (moved from Skills)
  const testimonials = useMemo(
    () => [
      {
        name: "Mustafa Ali",
        role: "Software Engineer @ Switchboard | Full Stack Developer | Delivering Scalable Tech That Drives Growth",
        quote:
          "I had the opportunity to manage Muhammad Ali directly, and he consistently impressed me with his frontend expertise. He takes Figma designs and converts them into clean, reusable React and Next.js components with accuracy and attention to detail. His understanding of UI structure, responsiveness, and modern frontend practices made him one of the most reliable developers on the team. Muhammad Ali would be a strong addition to any engineering team seeking a skilled and dependable frontend developer.",
        avatar:
          "https://media.licdn.com/dms/image/v2/D4D03AQHAGEou5jsHZQ/profile-displayphoto-crop_800_800/B4DZkWKoA8IcAI-/0/1757013509676?e=1767830400&v=beta&t=3wsqWK8OuJBN-UXwPj5QQ2W5FIBEz1rHI98SH-X9zZw"
      }
    ],
    []
  );

  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const current = testimonials[activeTestimonial];

  const nextTestimonial = useCallback(() => {
    setExpanded(false);
    setActiveTestimonial((i) => (i + 1) % testimonials.length);
  }, [testimonials.length]);

  const prevTestimonial = useCallback(() => {
    setExpanded(false);
    setActiveTestimonial((i) => (i - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  const displayedQuote = useMemo(() => {
    const q = current?.quote || "";
    if (expanded) return q;
    if (q.length <= 260) return q;
    return q.slice(0, 260).trimEnd() + "…";
  }, [current?.quote, expanded]);

  useEffect(() => {
    const mqMobile = window.matchMedia("(max-width: 1023px)");
    const mqCoarse = window.matchMedia("(pointer: coarse)");
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    const apply = () => {
      setIsMobile(mqMobile.matches);
      setIsCoarsePointer(mqCoarse.matches);
      setReducedMotion(mqReduce.matches);
    };

    apply();

    const add = (mq, fn) => {
      if (mq.addEventListener) mq.addEventListener("change", fn);
      else mq.addListener(fn);
    };
    const remove = (mq, fn) => {
      if (mq.removeEventListener) mq.removeEventListener("change", fn);
      else mq.removeListener(fn);
    };

    add(mqMobile, apply);
    add(mqCoarse, apply);
    add(mqReduce, apply);

    return () => {
      remove(mqMobile, apply);
      remove(mqCoarse, apply);
      remove(mqReduce, apply);
    };
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

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

  const heavyEffectsEnabled = inView && !reducedMotion && !isScrolling;
  const parallaxEnabled = !isMobile && !isCoarsePointer && !reducedMotion && inView && !isScrolling;

  // Parallax mouse tracking (RAF throttled)
  useEffect(() => {
    if (!parallaxEnabled) return;

    let ticking = false;

    const handleMouseMove = (e) => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        ticking = false;
        const x = (e.clientX / window.innerWidth - 0.5) * 14;
        const y = (e.clientY / window.innerHeight - 0.5) * 14;
        targetRef.current.x = x;
        targetRef.current.y = y;
        lastMoveRef.current = Date.now();
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [parallaxEnabled]);

  // Parallax loop
  useEffect(() => {
    const resetTransforms = () => {
      if (auroraRef.current) auroraRef.current.style.transform = "none";
      if (gridRef.current) gridRef.current.style.transform = "none";
      if (imageRef.current) imageRef.current.style.transform = "none";
    };

    if (!parallaxEnabled) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
      resetTransforms();
      return;
    }

    let stopTimer = 0;

    const loop = () => {
      const t = targetRef.current;
      const s = smoothRef.current;

      s.x += (t.x - s.x) * 0.07;
      s.y += (t.y - s.y) * 0.07;

      const aurora = auroraRef.current;
      const grid = gridRef.current;
      const image = imageRef.current;

      if (aurora) aurora.style.transform = `translate3d(${s.x * 1.2}px, ${s.y * 1.2}px, 0)`;
      if (grid) grid.style.transform = `translate3d(${s.x * 0.6}px, ${s.y * 0.6}px, 0)`;

      if (image) {
        const idle = Date.now() - lastMoveRef.current > 900;
        image.style.transform =
          `perspective(1000px) rotateY(${s.x}deg) rotateX(${-s.y}deg)` +
          (idle ? " translate3d(0,-8px,0)" : "");
      }

      window.clearTimeout(stopTimer);
      stopTimer = window.setTimeout(() => {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }, 450);

      rafRef.current = requestAnimationFrame(loop);
    };

    if (!rafRef.current) rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.clearTimeout(stopTimer);
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    };
  }, [parallaxEnabled]);

  // Reduce counts on mobile + when not heavy enabled
  const orbCount = heavyEffectsEnabled ? (isMobile ? 5 : 8) : 0;
  const sparkleCount = heavyEffectsEnabled ? (isMobile ? 10 : 22) : 0;
  const shootingStarCount = heavyEffectsEnabled ? (isMobile ? 2 : 3) : 0;
  const emojiCount = heavyEffectsEnabled ? (isMobile ? 0 : 10) : 0;

  const orbs = useMemo(() => {
    if (!orbCount) return [];
    const rng = makeRng(seedRef.current + 101);
    const colors = ["#22d3ee", "#38bdf8", "#3b82f6", "#e2e8f0"];
    return [...Array(orbCount)].map((_, i) => ({
      id: i,
      size: rng() * (isMobile ? 220 : 360) + (isMobile ? 140 : 180),
      left: rng() * 100,
      top: rng() * 100,
      color: colors[i % colors.length],
      delay: i * 0.55,
      duration: rng() * (isMobile ? 14 : 16) + (isMobile ? 18 : 22),
      blur: rng() * (isMobile ? 10 : 14) + (isMobile ? 18 : 28),
      opacity: rng() * (isMobile ? 0.05 : 0.06) + (isMobile ? 0.045 : 0.05)
    }));
  }, [orbCount, isMobile]);

  const sparkles = useMemo(() => {
    if (!sparkleCount) return [];
    const rng = makeRng(seedRef.current + 202);
    return [...Array(sparkleCount)].map((_, i) => ({
      id: i,
      size: rng() * (isMobile ? 2.0 : 2.4) + 1.0,
      left: rng() * 100,
      top: rng() * 100,
      opacity: rng() * (isMobile ? 0.18 : 0.24) + 0.08,
      delay: rng() * 5,
      duration: rng() * (isMobile ? 9 : 10) + 10
    }));
  }, [sparkleCount, isMobile]);

  const shootingStars = useMemo(() => {
    if (!shootingStarCount) return [];
    const rng = makeRng(seedRef.current + 303);
    return [...Array(shootingStarCount)].map((_, i) => ({
      id: i,
      top: rng() * 65,
      delay: rng() * 6 + i * 1.2,
      duration: rng() * 1.4 + 1.3,
      length: rng() * (isMobile ? 150 : 190) + (isMobile ? 130 : 160),
      opacity: rng() * (isMobile ? 0.18 : 0.22) + 0.18
    }));
  }, [shootingStarCount, isMobile]);

  const emojis = useMemo(() => {
    if (!emojiCount) return [];
    const rng = makeRng(seedRef.current + 404);
    const list = ["⚡", "✨", "🚀", "💻", "🔥", "🧠", "⭐", "🎯", "🛠️", "🎨", "📦", "🌙", "💡"];
    return [...Array(emojiCount)].map((_, i) => ({
      id: i,
      emoji: list[i % list.length],
      left: rng() * 100,
      top: rng() * 100,
      size: rng() * 18 + 14,
      rotate: rng() * 70 - 35,
      delay: rng() * 5,
      duration: rng() * 16 + 16,
      opacity: rng() * 0.12 + 0.05
    }));
  }, [emojiCount]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen flex items-start justify-center px-6 sm:px-8 lg:px-20 overflow-hidden pt-24 sm:pt-28 lg:pt-[140px] pb-16 sm:pb-20 lg:pb-[90px]"
      id="home"
    >
      {/* Snowfall lazy loaded */}
      {inView && !isScrolling && !reducedMotion && (
        <div className="absolute inset-0 z-[6] pointer-events-none">
          <Suspense fallback={null}>
            <Snowfall color="#82C3D9" snowflakeCount={isMobile ? 45 : 80} />
          </Suspense>
        </div>
      )}

      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#05060c] via-[#070b18] to-[#03050b]" />

      <div className="absolute inset-0 z-[1] pointer-events-none opacity-[0.55]" style={{ contain: "paint" }}>
        <div className="absolute -top-52 -left-52 w-[900px] h-[900px] rounded-full bg-cyan-500/10 blur-2xl animate-blobA" />
        <div className="absolute top-16 -right-56 w-[980px] h-[980px] rounded-full bg-sky-500/10 blur-2xl animate-blobB" />
        <div className="absolute -bottom-56 left-1/3 w-[980px] h-[980px] rounded-full bg-blue-500/10 blur-2xl animate-blobC" />
      </div>

      <div ref={auroraRef} className="absolute inset-0 z-[2] pointer-events-none will-change-transform" style={{ contain: "paint" }}>
        <div className="absolute -top-40 -left-40 w-[900px] h-[900px] rounded-full bg-cyan-500/10 blur-2xl animate-aurora-slow" />
        <div className="absolute top-10 -right-40 w-[860px] h-[860px] rounded-full bg-sky-500/10 blur-2xl animate-aurora-slow delay-700" />
        <div className="absolute -bottom-40 left-1/3 w-[900px] h-[900px] rounded-full bg-blue-500/10 blur-2xl animate-aurora-slow delay-300" />
      </div>

      {!!orbs.length && (
        <div className="absolute inset-0 z-[2] overflow-hidden pointer-events-none" style={{ contain: "paint" }}>
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

      {!!sparkles.length && (
        <div className="absolute inset-0 z-[3] overflow-hidden pointer-events-none" style={{ contain: "paint" }}>
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
                filter: "blur(0.2px)",
                willChange: "transform, opacity",
                transform: "translateZ(0)"
              }}
            />
          ))}
        </div>
      )}

      {!!shootingStars.length && (
        <div className="absolute inset-0 z-[3] overflow-hidden pointer-events-none" style={{ contain: "paint" }}>
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
                  "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.55) 35%, rgba(34,211,238,0.35) 70%, rgba(255,255,255,0) 100%)",
                filter: "drop-shadow(0 0 10px rgba(34, 211, 238, 0.14))",
                willChange: "transform, opacity",
                transform: "translateZ(0)"
              }}
            />
          ))}
        </div>
      )}

      {!!emojis.length && (
        <div className="absolute inset-0 z-[3] overflow-hidden pointer-events-none" style={{ contain: "paint" }}>
          {emojis.map((e) => (
            <div
              key={e.id}
              className="absolute animate-emojiFloat select-none"
              style={{
                left: `${e.left}%`,
                top: `${e.top}%`,
                fontSize: `${e.size}px`,
                opacity: e.opacity,
                filter: "drop-shadow(0 0 14px rgba(34, 211, 238, 0.12))",
                ["--r"]: `${e.rotate}deg`,
                animationDelay: `${e.delay}s`,
                animationDuration: `${e.duration}s`,
                willChange: "transform, opacity",
                transform: "translateZ(0)"
              }}
            >
              {e.emoji}
            </div>
          ))}
        </div>
      )}

      <div
        ref={gridRef}
        className="absolute inset-0 z-[2] opacity-[0.055] will-change-transform"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34, 211, 238, 0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.18) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          contain: "paint"
        }}
      />

      {!isMobile && heavyEffectsEnabled && (
        <div className="absolute inset-0 z-[4] pointer-events-none opacity-[0.09] mix-blend-overlay animate-scan" style={{ contain: "paint" }}>
          <div className="h-full w-full bg-[linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_2px)] bg-[length:100%_6px]" />
        </div>
      )}

      <div className="absolute inset-0 z-[4] pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.55)_70%,rgba(0,0,0,0.85)_100%)]" />

      <div className="relative z-10 w-full max-w-[1300px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Image side */}
          <div className="lg:col-span-5 flex justify-center order-1 lg:order-2 animate-slideInRight">
            <div className="relative group">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 blur-2xl opacity-35 group-hover:opacity-55 transition-opacity duration-500 animate-pulse-slow" />

              <div className="absolute -inset-10 animate-spin-slow opacity-25">
                <div className="h-full w-full rounded-full border-2 border-cyan-500/35 border-t-cyan-400 border-r-sky-400" />
              </div>

              <div className="absolute -inset-5 animate-spin-reverse opacity-15">
                <div className="h-full w-full rounded-full border border-blue-500/35 border-b-blue-400" />
              </div>

              <div
                ref={imageRef}
                className="relative rounded-full overflow-hidden border-4 border-cyan-400/20 bg-gradient-to-br from-cyan-900/10 to-blue-900/10 sm:backdrop-blur-sm shadow-2xl shadow-cyan-400/15 will-change-transform"
                style={{
                  width: isMobile ? "320px" : "460px",
                  height: isMobile ? "320px" : "460px",
                  transform: "translateZ(0)"
                }}
              >
                <img
                  src="/images/file2.png"
                  alt="Muhammad Ali"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ objectPosition: "center 30%" }}
                  loading="eager"
                  decoding="async"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/460x460/0ea5e9/ffffff?text=MA";
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full bg-black/40 sm:backdrop-blur-md border border-white/10 text-slate-100 font-semibold text-sm sm:text-base animate-badgeFloat flex items-center gap-2">
                  <FiCheckCircle className="text-slate-100" />
                  Available for work ✨
                </div>
              </div>
            </div>
          </div>

          {/* Text side */}
          <div className="lg:col-span-7 space-y-8 order-2 lg:order-1 animate-slideInLeft">
            <div className="space-y-6">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[0.95] tracking-tight">
                <span className="text-white block animate-fadeInUp">
                  Hi, I'm <span className="inline-block animate-waveHand">👋</span>
                </span>

                <span
                  className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 block animate-fadeInUp animate-gradient animate-softGlow"
                  style={{ animationDelay: "0.2s", backgroundSize: "220% 220%" }}
                >
                  Muhammad Ali
                </span>
              </h1>

              <div className="relative w-full">
                <h3
                  className="text-3xl sm:text-4xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 animate-fadeInUp animate-shimmerText"
                  style={{ animationDelay: "0.4s", WebkitTextStroke: "0.5px rgba(34, 211, 238, 0.22)" }}
                >
                  FullStack Developer
                </h3>

                <div className="mt-5 h-[3px] w-full max-w-xl rounded-full bg-slate-800/60 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-400 via-sky-400 to-transparent animate-expandWidth-smooth" />
                </div>

                <div className="mt-3 w-full max-w-xl h-[1px] opacity-60 bg-gradient-to-r from-transparent via-cyan-300/55 to-transparent animate-pulseLine" />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 animate-fadeInUp opacity-0" style={{ animationDelay: "0.55s", animationFillMode: "forwards" }}>
              <Chip text="React ⚛️" />
              <Chip text="Node.js 🟩" />
              <Chip text="MongoDB 🍃" />
              <Chip text="UI Animations ✨" />
              <Chip text="PostgreSQL 🐘" />
            </div>

            <p className="text-slate-200 text-lg sm:text-xl lg:text-2xl leading-relaxed max-w-4xl animate-fadeInUp opacity-0" style={{ animationDelay: "0.7s", animationFillMode: "forwards" }}>
              A Full Stack Engineer with a passion for developing efficient, user centric web solutions. Throughout my career I have consistently demonstrated a strong ability to take initiative and lead diverse teams towards successful project outcomes.
              I excel in collaborative environments but also enjoy independently diving deep into complex problems. My approach combines analytical thinking with creativity, which allows me to tackle issues from multiple angles.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl animate-fadeInUp opacity-0" style={{ animationDelay: "0.82s", animationFillMode: "forwards" }}>
              <div className="rounded-xl border border-white/10 bg-white/5 sm:backdrop-blur-md px-4 py-3">
                <p className="text-white font-extrabold text-lg">2+</p>
                <p className="text-slate-300 text-sm">Years experience</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 sm:backdrop-blur-md px-4 py-3">
                <p className="text-white font-extrabold text-lg">Multiple</p>
                <p className="text-slate-300 text-sm">Projects delivered</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 sm:backdrop-blur-md px-4 py-3">
                <p className="text-white font-extrabold text-lg">Fast</p>
                <p className="text-slate-300 text-sm">Clean UI and API</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-5 animate-fadeInUp opacity-0" style={{ animationDelay: "0.9s", animationFillMode: "forwards" }}>
              <a href="./My Cv/aaaa.docx" className="relative px-10 py-5 text-lg sm:text-xl bg-cyan-400 rounded-xl font-extrabold overflow-hidden" style={{ color: "#000" }}>
                <span className="relative z-10 flex items-center gap-2 text-black">
                  Download CV <FiArrowRight />
                </span>
                <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-white/10" />
              </a>

              <a href="#contact" className="relative px-10 py-5 text-lg sm:text-xl bg-transparent border-2 border-cyan-400/70 rounded-xl font-extrabold text-white overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  Hire me <FiCheckCircle />
                </span>
                <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-white/10" />
              </a>
            </div>

            <div className="flex gap-4 animate-fadeInUp opacity-0" style={{ animationDelay: "1.05s", animationFillMode: "forwards" }}>
              <SocialCircle
                href="https://github.com/MUHAMMADALLEEY"
                borderHover="hover:border-cyan-400"
                bgHover="hover:bg-cyan-400/10"
                iconHover="group-hover:text-cyan-300"
                Icon={FaGithub}
                label="GitHub"
              />

              <SocialCircle
                href="#"
                borderHover="hover:border-sky-400"
                bgHover="hover:bg-sky-400/10"
                iconHover="group-hover:text-sky-300"
                Icon={FaInstagram}
                label="Instagram"
              />

              <SocialCircle
                href="https://www.linkedin.com/in/muhammad-a-105104253/"
                borderHover="hover:border-blue-500"
                bgHover="hover:bg-blue-500/10"
                iconHover="group-hover:text-blue-300"
                Icon={FaLinkedinIn}
                label="LinkedIn"
              />
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-14 sm:mt-20 bg-slate-900/45 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 sm:p-10 overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
            <div className="min-w-0">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Testimonials</h3>
              <p className="text-slate-200/70 text-sm sm:text-base mt-2 max-w-2xl">
                Feedback from people I have worked with, focused on delivery, ownership, and quality.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={prevTestimonial}
                className={[
                  "inline-flex items-center justify-center w-11 h-11 rounded-xl border",
                  "border-slate-700/60 bg-slate-900/35 text-slate-200",
                  heavyEffectsEnabled ? "hover:scale-105 transition-transform duration-200 hover:border-cyan-400/35" : "hover:border-cyan-400/35"
                ].join(" ")}
                aria-label="Previous testimonial"
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={nextTestimonial}
                className={[
                  "inline-flex items-center justify-center w-11 h-11 rounded-xl border",
                  "border-slate-700/60 bg-slate-900/35 text-slate-200",
                  heavyEffectsEnabled ? "hover:scale-105 transition-transform duration-200 hover:border-cyan-400/35" : "hover:border-cyan-400/35"
                ].join(" ")}
                aria-label="Next testimonial"
              >
                <FiChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden border border-slate-700/55">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 via-purple-500/20 to-slate-900/10" />
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.10),transparent_55%)]" />

            <div className="relative p-7 sm:p-10">
              <div className="flex items-start gap-4 sm:gap-5">
                <div className="shrink-0">
                  {current?.avatar ? (
                    <img
                      src={current.avatar}
                      alt={current.name}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border border-white/20"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/15 border border-white/20 flex items-center justify-center text-white font-extrabold">
                      {getInitials(current?.name)}
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-white font-extrabold text-lg sm:text-xl truncate">{current?.name}</div>
                      <div className="text-white/75 text-xs sm:text-sm mt-1">{current?.role}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      {testimonials.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            setExpanded(false);
                            setActiveTestimonial(i);
                          }}
                          className={[
                            "w-2.5 h-2.5 rounded-full transition-all duration-200",
                            i === activeTestimonial ? "bg-white/90" : "bg-white/35 hover:bg-white/55"
                          ].join(" ")}
                          aria-label={`Go to testimonial ${i + 1}`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-white/90 text-sm sm:text-base leading-relaxed mt-5">{displayedQuote}</p>

                  {current?.quote?.length > 260 && (
                    <button
                      type="button"
                      onClick={() => setExpanded((v) => !v)}
                      className="mt-4 text-white/80 hover:text-white text-sm font-semibold underline underline-offset-4"
                    >
                      {expanded ? "See less" : "See more"}
                    </button>
                  )}

                  <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                    <div className="text-white/65 text-xs sm:text-sm">
                      {activeTestimonial + 1} of {testimonials.length}
                    </div>

                    <a
                      href="#contact"
                      className={[
                        "inline-flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-extrabold",
                        "bg-cyan-400 text-black border border-cyan-300/30",
                        heavyEffectsEnabled ? "hover:scale-105 transition-transform duration-200 hover:shadow-2xl hover:shadow-cyan-400/20" : ""
                      ].join(" ")}
                    >
                      <span style={{ color: "black" }}>Get In Touch</span>
                      <FiArrowRight className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-xs sm:text-sm text-slate-200/55 text-center">
            You can add more testimonials by updating the testimonials array.
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-smooth {
          0%,
          100% { transform: translate3d(0, 0, 0); }
          25% { transform: translate3d(-14px, -12px, 0); }
          50% { transform: translate3d(14px, -10px, 0); }
          75% { transform: translate3d(-10px, 14px, 0); }
        }
        @keyframes aurora-slow {
          0%,
          100% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.6; }
          50% { transform: translate3d(18px, -14px, 0) scale(1.035); opacity: 0.92; }
        }
        @keyframes blobA {
          0%,
          100% { transform: translate3d(0, 0, 0) scale(1); }
          33% { transform: translate3d(28px, -22px, 0) scale(1.05); }
          66% { transform: translate3d(-22px, 26px, 0) scale(0.98); }
        }
        @keyframes blobB {
          0%,
          100% { transform: translate3d(0, 0, 0) scale(1.02); }
          33% { transform: translate3d(-26px, 18px, 0) scale(1.06); }
          66% { transform: translate3d(18px, -26px, 0) scale(0.98); }
        }
        @keyframes blobC {
          0%,
          100% { transform: translate3d(0, 0, 0) scale(1); }
          33% { transform: translate3d(18px, 22px, 0) scale(1.05); }
          66% { transform: translate3d(-26px, -18px, 0) scale(0.99); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-70px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(70px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(26px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes expandWidthSmooth {
          from { width: 0%; }
          to { width: 100%; }
        }
        @keyframes gradient {
          0%,
          100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes pulse-slow {
          0%,
          100% { opacity: 0.32; }
          50% { opacity: 0.58; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes sparkle-drift {
          0% { transform: translate3d(0, 0, 0); opacity: 0.05; }
          20% { opacity: 0.28; }
          50% { transform: translate3d(14px, -16px, 0); opacity: 0.16; }
          100% { transform: translate3d(-10px, 12px, 0); opacity: 0.06; }
        }
        @keyframes softGlow {
          0%,
          100% { filter: drop-shadow(0 0 0px rgba(34, 211, 238, 0)); }
          50% { filter: drop-shadow(0 0 22px rgba(34, 211, 238, 0.18)); }
        }
        @keyframes shimmerText {
          0% { background-position: 0% 50%; filter: drop-shadow(0 0 10px rgba(34, 211, 238, 0.05)); }
          50% { background-position: 100% 50%; filter: drop-shadow(0 0 18px rgba(56, 189, 248, 0.1)); }
          100% { background-position: 0% 50%; filter: drop-shadow(0 0 10px rgba(34, 211, 238, 0.05)); }
        }
        @keyframes emojiFloat {
          0%,
          100% { transform: translate3d(0, 0, 0) rotate(var(--r)); }
          25% { transform: translate3d(14px, -10px, 0) rotate(calc(var(--r) + 10deg)); }
          50% { transform: translate3d(-10px, -18px, 0) rotate(calc(var(--r) - 8deg)); }
          75% { transform: translate3d(10px, 12px, 0) rotate(calc(var(--r) + 6deg)); }
        }
        @keyframes waveHand {
          0%,
          100% { transform: rotate(0deg); }
          15% { transform: rotate(14deg); }
          30% { transform: rotate(-10deg); }
          45% { transform: rotate(12deg); }
          60% { transform: rotate(-8deg); }
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
        @keyframes shoot {
          0% { transform: translate3d(0, 0, 0) rotate(-12deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translate3d(160vw, 55vh, 0) rotate(-12deg); opacity: 0; }
        }
        @keyframes badgeFloat {
          0%,
          100% { transform: translate3d(-50%, 0, 0); opacity: 0.85; }
          50% { transform: translate3d(-50%, -10px, 0); opacity: 1; }
        }

        .animate-float-smooth { animation: float-smooth ease-in-out infinite; will-change: transform; }
        .animate-aurora-slow { animation: aurora-slow ease-in-out infinite; animation-duration: 18s; will-change: transform, opacity; }
        .animate-blobA { animation: blobA 16s ease-in-out infinite; will-change: transform; }
        .animate-blobB { animation: blobB 18s ease-in-out infinite; will-change: transform; }
        .animate-blobC { animation: blobC 20s ease-in-out infinite; will-change: transform; }

        .animate-slideInLeft { animation: slideInLeft 0.85s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .animate-slideInRight { animation: slideInRight 0.85s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .animate-fadeInUp { animation: fadeInUp 0.9s ease-out; }
        .animate-expandWidth-smooth { animation: expandWidthSmooth 1.05s ease-out; }

        .animate-gradient { animation: gradient 5s ease infinite; }
        .animate-pulse-slow { animation: pulse-slow 4.5s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 22s linear infinite; }
        .animate-spin-reverse { animation: spin-reverse 16s linear infinite; }

        .animate-sparkle-drift { animation: sparkle-drift ease-in-out infinite; will-change: transform, opacity; }
        .animate-softGlow { animation: softGlow 4.2s ease-in-out infinite; }
        .animate-shimmerText { background-size: 240% 240%; animation: shimmerText 7s ease-in-out infinite; }
        .animate-emojiFloat { animation: emojiFloat ease-in-out infinite; will-change: transform; }
        .animate-waveHand { transform-origin: 70% 70%; animation: waveHand 1.7s ease-in-out infinite; }

        .animate-pulseLine { animation: pulseLine 2.8s ease-in-out infinite; }
        .animate-scan { animation: scan 9s ease-in-out infinite; }
        .animate-shoot { animation: shoot linear infinite; }
        .animate-badgeFloat { animation: badgeFloat 2.8s ease-in-out infinite; }

        .delay-300 { animation-delay: 300ms; }
        .delay-700 { animation-delay: 700ms; }

        @media (prefers-reduced-motion: reduce) {
          .animate-float-smooth,
          .animate-aurora-slow,
          .animate-blobA,
          .animate-blobB,
          .animate-blobC,
          .animate-spin-slow,
          .animate-spin-reverse,
          .animate-sparkle-drift,
          .animate-softGlow,
          .animate-shimmerText,
          .animate-emojiFloat,
          .animate-waveHand,
          .animate-pulseLine,
          .animate-scan,
          .animate-shoot,
          .animate-badgeFloat {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Home;
