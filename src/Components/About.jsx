"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Snowfall from "react-snowfall";
import {
  FiArrowRight,
  FiCheckCircle,
  FiCpu,
  FiDatabase,
  FiShield,
  FiZap,
  FiLink2,
  FiStar,
  FiCode,
  FiActivity,
  FiTool,
} from "react-icons/fi";

const makeRng = (seed0) => {
  let seed = seed0 >>> 0;
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
};

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const sectionRef = useRef(null);
  const [inView, setInView] = useState(true);

  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimerRef = useRef(0);

  const seedRef = useRef(Math.floor(Math.random() * 1_000_000_000));

  useEffect(() => setIsVisible(true), []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(mq.matches);
    apply();

    if (mq.addEventListener) {
      mq.addEventListener("change", apply);
      return () => mq.removeEventListener("change", apply);
    }
    mq.addListener(apply);
    return () => mq.removeListener(apply);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.06 }
    );

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

  const heavyEffectsEnabled = inView && !reduceMotion && !isScrolling;

  const orbCount = 6;

  const orbs = useMemo(() => {
    const rng = makeRng(seedRef.current + 123);
    const colors = ["#22d3ee", "#38bdf8", "#3b82f6", "#e2e8f0"];
    return [...Array(orbCount)].map((_, i) => ({
      id: i,
      size: rng() * 300 + 180,
      left: rng() * 100,
      top: rng() * 100,
      color: colors[i % colors.length],
      delay: i * 0.55,
      duration: rng() * 14 + 18,
      blur: rng() * 10 + 18,
      opacity: rng() * 0.05 + 0.04,
    }));
  }, []);

  const skillTags = useMemo(
    () => [
      "React",
      "Next.js",
      "Node.js",
      "Express",
      "PostgreSQL",
      "MongoDB",
      "REST APIs",
      "Tailwind",
      "Authentication(Bcrypt and JWS)",
    ],
    []
  );

  const stats = useMemo(
    () => [
      { value: "< 24 hours", label: "Response Time", Icon: FiActivity },
      { value: "Strong", label: "Problem Solving", Icon: FiTool },
      { value: "Scalable", label: "Architecture and APIs", Icon: FiCpu },
    ],
    []
  );

  const capabilityCards = useMemo(
    () => [
      {
        Icon: FiStar,
        title: "Premium UI Engineering",
        text: "Pixel-perfect layouts, responsive components, and motion that supports UX.",
      },
      {
        Icon: FiShield,
        title: "Secure Authentication",
        text: "JWT sessions, role-based access, protected routes, and validation best practices.",
      },
      {
        Icon: FiDatabase,
        title: "Data Modeling",
        text: "Schemas, indexing, migrations planning, and scalable query patterns.",
      },
      {
        Icon: FiLink2,
        title: "Integrations and Automation",
        text: "Payments, email, uploads, third-party APIs, and webhooks.",
      },
      {
        Icon: FiZap,
        title: "Performance and SEO",
        text: "Bundle strategy, lazy loading, caching basics, and technical SEO hygiene.",
      },
      {
        Icon: FiCode,
        title: "Maintainable Codebase",
        text: "Clear architecture, reusable modules, clean commits, and structured delivery.",
      },
    ],
    []
  );

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full min-h-screen flex items-center justify-center px-6 sm:px-8 lg:px-20 py-20 overflow-hidden"
    >
      {inView && !isScrolling && !reduceMotion && (
        <div className="absolute inset-0 z-[6] pointer-events-none">
          <Snowfall color="#82C3D9" snowflakeCount={70} style={{ width: "100%", height: "100%" }} />
        </div>
      )}

      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#05060c] via-[#070b18] to-[#03050b]" />

      <div className="absolute inset-0 z-[1] pointer-events-none" style={{ contain: "paint" }}>
        <div className="absolute -top-40 -left-40 w-[900px] h-[900px] rounded-full bg-cyan-500/10 blur-2xl animate-aurora-slow" />
        <div className="absolute top-10 -right-40 w-[860px] h-[860px] rounded-full bg-sky-500/10 blur-2xl animate-aurora-slow delay-700" />
        <div className="absolute -bottom-40 left-1/3 w-[900px] h-[900px] rounded-full bg-blue-500/10 blur-2xl animate-aurora-slow delay-300" />
      </div>

      {heavyEffectsEnabled && (
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
                transform: "translateZ(0)",
              }}
            />
          ))}
        </div>
      )}

      <div
        className="absolute inset-0 z-[2] opacity-[0.055]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34, 211, 238, 0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.18) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          contain: "paint",
        }}
      />

      <div className="absolute inset-0 z-[3] pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.55)_70%,rgba(0,0,0,0.85)_100%)]" />

      <div className="relative z-10 w-full max-w-[1200px]">
        {/* Header */}
        <div
          className={`text-center transition-all duration-1000 transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
          }`}
        >
         

          <h2 className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white">
            About{" "}
            <span
              className={`text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 ${
                reduceMotion ? "" : "animate-gradient"
              }`}
              style={{ backgroundSize: "200% auto" }}
            >
              Me
            </span>
          </h2>

          <p className="text-slate-200/90 text-lg sm:text-xl mt-5 max-w-3xl mx-auto leading-relaxed">
            I build modern, fast web applications with clean architecture, reliable APIs, and a premium user experience.
          </p>
        </div>

        {/* Main layout */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left, story + stats + skills */}
          <div
            className={`lg:col-span-5 transition-all duration-1000 delay-200 transform ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-20"
            }`}
          >
            <div className="relative bg-slate-900/45 sm:backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 sm:p-9 overflow-hidden shadow-2xl shadow-black/30">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/8 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              <div className="relative">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">What you get</h3>
                <p className="text-slate-100/90 text-lg mt-4 leading-relaxed">
                  End-to-end delivery, from UI to backend. I focus on responsiveness, performance, and maintainability,
                  so your product stays easy to scale and easy to evolve.
                </p>

                {/* Stats row */}
                <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {stats.map((s) => (
                    <div
                      key={s.label}
                      className="rounded-2xl border border-white/10 bg-white/5 sm:backdrop-blur-md px-4 py-4"
                    >
                      <div className="flex items-center gap-2">
                        <s.Icon className="w-5 h-5 text-cyan-200" />
                        <p className="text-white font-extrabold text-base">{s.value}</p>
                      </div>
                      <p className="text-slate-300 text-sm mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Skills */}
                <div className="mt-7">
                  <div className="text-slate-200/80 text-base font-semibold">Core Stack</div>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {skillTags.map((skill, index) => (
                      <span
                        key={skill}
                        className={`px-4 py-2 bg-slate-800/45 border border-cyan-500/25 rounded-full text-cyan-100 text-sm sm:text-base font-extrabold hover:bg-cyan-500/10 hover:border-cyan-400 transition-all duration-300 hover:scale-[1.03] cursor-default ${
                          reduceMotion ? "" : "animate-fadeInUp opacity-0"
                        }`}
                        style={
                          reduceMotion
                            ? undefined
                            : { animationDelay: `${0.55 + index * 0.07}s`, animationFillMode: "forwards" }
                        }
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Single CTA button only */}
                <div className="mt-8">
                  <a
                    href="./My Cv/Ali-Full Stack Developer.pdf"
                    className="group inline-flex items-center justify-center gap-3 w-full px-10 py-5 bg-cyan-400 text-black text-lg sm:text-xl font-extrabold rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-400/35 relative overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <span className="relative text-black">Get In Touch</span>
                    <FiArrowRight className="w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </a>

                  <div className="mt-3 text-center text-slate-300/80 text-sm">
                    Available for full-time and freelance work
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right, capabilities grid */}
          <div
            className={`lg:col-span-7 transition-all duration-1000 delay-400 transform ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-20"
            }`}
          >
            <div className="relative bg-slate-900/45 sm:backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 sm:p-9 shadow-2xl shadow-black/30 overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              <div className="flex items-end justify-between gap-4">
                <div>
                  <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
                    Engineering{" "}
                    <span
                      className={`text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 ${
                        reduceMotion ? "" : "animate-gradient"
                      }`}
                      style={{ backgroundSize: "200% auto" }}
                    >
                      Capabilities
                    </span>
                  </h3>
                  <p className="text-slate-200/90 text-lg sm:text-xl mt-3 leading-relaxed">
                    A clean build process, practical architecture, and consistent delivery.
                  </p>
                </div>

                <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/35 border border-slate-700/50 text-slate-100 font-extrabold text-base">
                  Open <FiCheckCircle className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
                {capabilityCards.map((c, idx) => (
                  <div
                    key={c.title}
                    className={`relative bg-slate-800/28 border border-slate-700/45 rounded-2xl p-7 hover:border-cyan-400/35 hover:bg-slate-800/38 transition-all duration-400 overflow-hidden ${
                      reduceMotion ? "" : "animate-fadeInUp opacity-0"
                    }`}
                    style={
                      reduceMotion
                        ? undefined
                        : { animationDelay: `${0.25 + idx * 0.08}s`, animationFillMode: "forwards" }
                    }
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/7 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center">
                        <c.Icon className="w-7 h-7 text-cyan-200" />
                      </div>
                      <div>
                        <h4 className="text-xl sm:text-2xl font-extrabold text-white">{c.title}</h4>
                        <p className="text-slate-200/90 text-base sm:text-lg mt-2 leading-relaxed">{c.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-7 bg-gradient-to-br from-cyan-500/10 to-sky-500/8 border border-cyan-400/20 rounded-2xl p-6">
                <div className="text-white text-2xl font-extrabold">Delivery Standard</div>
                <div className="text-slate-100/90 text-lg mt-2 leading-relaxed">
                  Clean code, clear updates, and production-ready results, no confusion, no delays.
                </div>
              </div>
            </div>

            {/* Compact footer note */}
            <div className="mt-6 text-center text-slate-300/80 text-sm">
              If you want a reliable developer for UI and backend delivery, use the button to start.
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-smooth {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }
          25% {
            transform: translate3d(-10px, -10px, 0);
          }
          50% {
            transform: translate3d(10px, -8px, 0);
          }
          75% {
            transform: translate3d(-8px, 10px, 0);
          }
        }

        @keyframes aurora-slow {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 0.65;
          }
          50% {
            transform: translate3d(16px, -12px, 0) scale(1.02);
            opacity: 0.88;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(26px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-float-smooth {
          animation: float-smooth ease-in-out infinite;
          will-change: transform;
        }

        .animate-aurora-slow {
          animation: aurora-slow ease-in-out infinite;
          animation-duration: 18s;
          will-change: transform, opacity;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.85s ease-out;
        }

        .animate-gradient {
          animation: gradient 4s ease infinite;
        }

        .delay-300 {
          animation-delay: 300ms;
        }
        .delay-700 {
          animation-delay: 700ms;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-float-smooth,
          .animate-aurora-slow,
          .animate-fadeInUp,
          .animate-gradient {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default About;
