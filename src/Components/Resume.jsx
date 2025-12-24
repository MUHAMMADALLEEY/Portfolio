import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FiBriefcase, FiBookOpen, FiCheckCircle, FiCalendar, FiHome } from "react-icons/fi";
import Snowfall from "react-snowfall";

import { tabs } from "../data/tabs.js";
import { summaryCards } from "../data/summary.js";
import { experienceData } from "../data/experience.js";
import { educationData } from "../data/education.js";

const makeRng = (seed0) => {
  let seed = seed0 >>> 0;
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
};

const TabButton = React.memo(function TabButton({ tab, index, activeTab, goToTab, heavyEffectsEnabled }) {
  const isActive = activeTab === index;

  return (
    <button
      type="button"
      onClick={() => goToTab(index)}
      className={[
        "relative w-full text-left rounded-2xl transition-all duration-300 group overflow-hidden",
        "px-7 py-6",
        isActive
          ? "bg-cyan-400 text-black shadow-2xl shadow-cyan-400/20"
          : "bg-slate-900/45 backdrop-blur-xl perf-blur border border-slate-700/50 text-slate-200 hover:border-cyan-400/40",
        heavyEffectsEnabled ? "hover:scale-[1.02]" : ""
      ].join(" ")}
    >
      <div
        className={[
          "absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full",
          heavyEffectsEnabled ? "group-hover:translate-x-full transition-transform duration-1000" : ""
        ].join(" ")}
      />

      <div className="relative flex items-center gap-4">
        <span
          className={[
            "w-14 h-14 rounded-2xl flex items-center justify-center",
            isActive ? "bg-black/10" : "bg-slate-800/40 border border-slate-700/40",
            "transition-transform duration-300",
            heavyEffectsEnabled ? "group-hover:scale-110" : ""
          ].join(" ")}
          aria-hidden="true"
        >
          <tab.Icon className={`w-8 h-8 ${isActive ? "text-black" : "text-cyan-200"}`} />
        </span>

        <div className="min-w-0">
          <div className="text-2xl font-extrabold tracking-tight">{tab.name}</div>
          <div className={`text-sm mt-1 ${isActive ? "text-black/70" : "text-slate-400"}`}>Tap to view details</div>
        </div>
      </div>

      {isActive && (
        <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <span className={`w-2.5 h-2.5 bg-black rounded-full ${heavyEffectsEnabled ? "animate-ping" : ""}`} />
          <span className="w-2.5 h-2.5 bg-black rounded-full" />
        </div>
      )}
    </button>
  );
});

const TimelineItem = React.memo(function TimelineItem({ item, index, rightPill, heavyEffectsEnabled }) {
  return (
    <div
      className={[
        "relative pl-10 pb-10 border-l-2 transition-all duration-300 border-cyan-500/20 hover:border-cyan-400/45",
        heavyEffectsEnabled ? "animate-slideInLeft" : ""
      ].join(" ")}
      style={heavyEffectsEnabled ? { animationDelay: `${index * 0.12}s` } : undefined}
    >
      <div
        className={[
          "absolute left-0 top-0 w-5 h-5 bg-gradient-to-r from-cyan-400 to-sky-500 rounded-full -translate-x-[11px] shadow-lg shadow-cyan-400/20",
          heavyEffectsEnabled ? "animate-pulse-slow" : ""
        ].join(" ")}
      />

      <div
        className={[
          "bg-slate-900/45 backdrop-blur-xl perf-blur border border-slate-700/50 rounded-3xl p-8 sm:p-9",
          "transition-all duration-300 group",
          heavyEffectsEnabled ? "hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-400/10" : "",
          "hover:border-cyan-400/35"
        ].join(" ")}
        style={{
          contain: "layout paint style",
          contentVisibility: "auto",
          containIntrinsicSize: "1px 600px"
        }}
      >
        <div className="flex flex-wrap justify-between items-start gap-4 mb-5">
          <div className="min-w-0">
            <p className="text-cyan-200 text-base font-extrabold mb-3 inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 rounded-full border border-cyan-500/25">
              <FiCalendar className="w-5 h-5" />
              <span>{item.year}</span>
            </p>

            <h3 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-3 transition-colors duration-300 group-hover:text-cyan-200">
              {item.title}
            </h3>

            <p className="text-slate-200/90 font-semibold text-2xl flex items-center gap-2">
              <FiHome className="w-6 h-6 text-slate-300" />
              <span className="break-words">{item.company}</span>
            </p>
          </div>

          {rightPill ? (
            <div className="mt-1">
              <span className="px-5 py-2 bg-cyan-500/12 text-cyan-200 rounded-full text-base font-extrabold border border-cyan-400/25">
                {rightPill}
              </span>
            </div>
          ) : null}
        </div>

        <p className="text-slate-200 leading-relaxed text-xl sm:text-2xl">{item.description}</p>

        {"skills" in item && Array.isArray(item.skills) && (
          <div className="flex flex-wrap gap-2.5 mt-6">
            {item.skills.map((s) => (
              <span
                key={s}
                className="px-5 py-2.5 bg-cyan-500/10 text-cyan-100 rounded-full text-base sm:text-lg font-bold border border-cyan-400/25 hover:bg-cyan-500/16 transition-colors duration-300"
              >
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

const Resume = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const contentRef = useRef(null);

  const [reduceMotion, setReduceMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);

  const sectionRef = useRef(null);
  const [isSectionInView, setIsSectionInView] = useState(true);

  const isScrollingRef = useRef(false);
  const scrollTimerRef = useRef(0);

  const snowWrapRef = useRef(null);
  const fxWrapRef = useRef(null);

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
    const mqMobile = window.matchMedia("(max-width: 1023px)");
    const mqCoarse = window.matchMedia("(pointer: coarse)");

    const apply = () => {
      setIsMobile(mqMobile.matches);
      setIsCoarsePointer(mqCoarse.matches);
    };

    apply();

    if (mqMobile.addEventListener) {
      mqMobile.addEventListener("change", apply);
      mqCoarse.addEventListener("change", apply);
      return () => {
        mqMobile.removeEventListener("change", apply);
        mqCoarse.removeEventListener("change", apply);
      };
    }

    mqMobile.addListener(apply);
    mqCoarse.addListener(apply);
    return () => {
      mqMobile.removeListener(apply);
      mqCoarse.removeListener(apply);
    };
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(([entry]) => setIsSectionInView(entry.isIntersecting), { threshold: 0.06 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // KEY OPTIMIZATION: disable blur + heavy layers while scrolling, no React state updates
  useEffect(() => {
    const onScroll = () => {
      isScrollingRef.current = true;

      if (sectionRef.current) sectionRef.current.classList.add("is-scrolling");
      if (snowWrapRef.current) snowWrapRef.current.style.opacity = "0";
      if (fxWrapRef.current) fxWrapRef.current.style.opacity = "0";

      window.clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = window.setTimeout(() => {
        isScrollingRef.current = false;

        if (sectionRef.current) sectionRef.current.classList.remove("is-scrolling");
        if (snowWrapRef.current) snowWrapRef.current.style.opacity = "1";
        if (fxWrapRef.current) fxWrapRef.current.style.opacity = "1";
      }, 160);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(scrollTimerRef.current);
    };
  }, []);

  const enableHeavyMotion = !reduceMotion && !isMobile && !isCoarsePointer;
  const heavyEffectsEnabled = enableHeavyMotion && isSectionInView && !isScrollingRef.current;

  const orbCount = heavyEffectsEnabled ? 6 : 0;

  const orbs = useMemo(() => {
    if (orbCount === 0) return [];
    const rng = makeRng(seedRef.current + 777);
    const colors = ["#22d3ee", "#38bdf8", "#3b82f6", "#e2e8f0"];

    return [...Array(orbCount)].map((_, i) => ({
      id: i,
      size: rng() * 180 + 140,
      left: rng() * 100,
      top: rng() * 100,
      color: colors[i % colors.length],
      delay: i * 0.6,
      duration: rng() * 10 + 16,
      blur: rng() * 6 + 14,
      opacity: rng() * 0.04 + 0.035
    }));
  }, [orbCount]);

  const goToTab = useCallback((idx) => {
    setActiveTab(idx);
    requestAnimationFrame(() => contentRef.current?.focus?.());
  }, []);

  const showSnow = !reduceMotion && isSectionInView && !isMobile;

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen flex items-center justify-center px-6 sm:px-8 lg:px-20 py-20 overflow-hidden"
      id="resume"
      style={{
        contain: "layout paint style",
        contentVisibility: "auto",
        containIntrinsicSize: "1px 1200px"
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#05060c] via-[#070b18] to-[#03050b]" />

      {/* Snowfall, fades out while scrolling */}
      {showSnow && (
        <div
          ref={snowWrapRef}
          className="absolute inset-0 z-[6] pointer-events-none transition-opacity duration-200"
          style={{ opacity: 1 }}
        >
          <Snowfall color="#82C3D9" snowflakeCount={30} style={{ width: "100%", height: "100%" }} />
        </div>
      )}

      {/* FX wrapper, fades out while scrolling */}
      <div
        ref={fxWrapRef}
        className="absolute inset-0 pointer-events-none transition-opacity duration-200"
        style={{ opacity: 1 }}
      >
        <div className="absolute inset-0 perf-aurora">
          <div className={`absolute -top-40 -left-40 w-[900px] h-[900px] rounded-full bg-cyan-500/10 blur-3xl ${heavyEffectsEnabled ? "animate-aurora-slow" : ""}`} />
          <div className={`absolute top-10 -right-40 w-[860px] h-[860px] rounded-full bg-sky-500/10 blur-3xl ${heavyEffectsEnabled ? "animate-aurora-slow delay-700" : ""}`} />
          <div className={`absolute -bottom-40 left-1/3 w-[900px] h-[900px] rounded-full bg-blue-500/10 blur-3xl ${heavyEffectsEnabled ? "animate-aurora-slow delay-300" : ""}`} />
        </div>

        {heavyEffectsEnabled && (
          <div className="absolute inset-0 overflow-hidden perf-orbs" style={{ contain: "paint" }}>
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
      </div>

      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34, 211, 238, 0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.18) 1px, transparent 1px)",
          backgroundSize: "90px 90px"
        }}
      />

      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.55)_70%,rgba(0,0,0,0.85)_100%)]" />

      <div className="relative z-10 w-full max-w-[1300px]">
        <div
          className={[
            "text-center mb-14 sm:mb-20 transition-all duration-1000 transform",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
          ].join(" ")}
        >
          <div className="inline-block relative">
            <h2 className="text-5xl sm:text-6xl lg:text-8xl font-extrabold mb-4 tracking-tight text-white">
              Resume{" "}
              <span
                className={[
                  "text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500",
                  heavyEffectsEnabled ? "animate-gradient" : ""
                ].join(" ")}
                style={{ backgroundSize: "200% auto" }}
              >
                Overview
              </span>
            </h2>

            <div
              className={[
                "absolute -bottom-2 left-1/2 -translate-x-1/2 w-44 sm:w-56 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-full",
                heavyEffectsEnabled ? "animate-pulse-slow" : ""
              ].join(" ")}
            />
          </div>

          <p className="text-slate-200/90 text-lg sm:text-2xl mt-6 sm:mt-8 max-w-3xl mx-auto leading-relaxed">
            Experience and education, presented in a clean timeline, with bigger text and a smooth UI.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div
            className={[
              "lg:col-span-4 space-y-4 transition-all duration-1000 delay-200 transform",
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-20"
            ].join(" ")}
          >
            <div className="space-y-4">
              {tabs.map((t, idx) => (
                <TabButton
                  key={t.name}
                  tab={t}
                  index={idx}
                  activeTab={activeTab}
                  goToTab={goToTab}
                  heavyEffectsEnabled={heavyEffectsEnabled}
                />
              ))}
            </div>

            <div className="relative bg-slate-900/45 backdrop-blur-xl perf-blur border border-slate-700/50 rounded-3xl p-7 overflow-hidden shadow-2xl shadow-black/25">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              <h3 className="text-2xl font-extrabold text-white mb-6">Quick Summary</h3>

              <div className="grid grid-cols-2 gap-4">
                {summaryCards.map((c) => (
                  <div
                    key={c.label}
                    className="bg-slate-800/30 border border-slate-700/40 rounded-2xl p-5 hover:border-cyan-400/30 transition-all duration-300"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center">
                      <c.Icon className="w-6 h-6 text-cyan-200" />
                    </div>
                    <div className="text-slate-300 text-sm font-semibold mt-2">{c.label}</div>
                    <div className="text-white text-2xl font-extrabold mt-1">{c.value}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <a
                  href="#contact"
                  className={`text-center px-4 py-3 rounded-xl bg-cyan-400 text-black font-extrabold text-lg ${
                    heavyEffectsEnabled ? "hover:scale-[1.02] transition-transform duration-300" : ""
                  }`}
                >
                  Contact
                </a>

                <a
                  href="#portfolio"
                  className={[
                    "text-center px-4 py-3 rounded-xl bg-slate-900/40 border border-slate-700/60 text-slate-100 font-extrabold text-lg",
                    heavyEffectsEnabled ? "hover:border-cyan-400/40 hover:scale-[1.02]" : "hover:border-cyan-400/40",
                    "transition-all duration-300"
                  ].join(" ")}
                >
                  Portfolio
                </a>
              </div>
            </div>
          </div>

          <div
            className={[
              "lg:col-span-8 transition-all duration-1000 delay-400 transform",
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-20"
            ].join(" ")}
          >
            <div className="bg-slate-900/45 backdrop-blur-xl perf-blur border border-slate-700/50 rounded-3xl p-8 sm:p-10 min-h-[640px] shadow-2xl shadow-black/30">
              <div ref={contentRef} tabIndex={-1} className="outline-none">
                <div className="flex items-start sm:items-center justify-between gap-4 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br from-cyan-400 to-sky-500 shadow-cyan-400/20">
                      {activeTab === 0 ? (
                        <FiBriefcase className="w-9 h-9 text-black" />
                      ) : (
                        <FiBookOpen className="w-9 h-9 text-black" />
                      )}
                    </div>

                    <div>
                      <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                        {activeTab === 0 ? (
                          <>
                            Work{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500">
                              Experience
                            </span>
                          </>
                        ) : (
                          <>
                            My{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500">
                              Education
                            </span>
                          </>
                        )}
                      </h2>
                      <p className="text-slate-200/85 mt-2 text-lg sm:text-xl">
                        {activeTab === 0 ? "Roles, responsibilities, and core skills" : "Degrees, learning, and certifications"}
                      </p>
                    </div>
                  </div>

                  <div className="hidden lg:flex flex-col items-end">
                    <div className="px-5 py-2 rounded-full bg-slate-800/40 border border-slate-700/50 text-slate-100 font-extrabold text-lg inline-flex items-center gap-2">
                      Updated <FiCheckCircle className="w-5 h-5 text-cyan-200" />
                    </div>
                    <div className="text-slate-400 text-sm mt-2">Clean timeline view</div>
                  </div>
                </div>

                <div
                  className={[
                    "text-slate-200 text-xl sm:text-2xl leading-relaxed bg-slate-800/30 rounded-2xl p-7 border border-slate-700/30 mb-10",
                    heavyEffectsEnabled ? "animate-fadeInUp" : ""
                  ].join(" ")}
                >
                  {activeTab === 0
                    ? "I build modern web apps with strong UI, clean APIs, and reliable delivery. Here are my most recent roles."
                    : "A strong academic base plus practical learning, focused on programming and modern web development."}
                </div>

                {activeTab === 0 && (
                  <div className="space-y-1">
                    {experienceData.map((item, idx) => (
                      <TimelineItem key={`${item.title}-${idx}`} item={item} index={idx} heavyEffectsEnabled={heavyEffectsEnabled} />
                    ))}
                  </div>
                )}

                {activeTab === 1 && (
                  <div className="space-y-1">
                    {educationData.map((item, idx) => (
                      <TimelineItem
                        key={`${item.title}-${idx}`}
                        item={item}
                        index={idx}
                        rightPill={item.grade}
                        heavyEffectsEnabled={heavyEffectsEnabled}
                      />
                    ))}
                  </div>
                )}
              </div>
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

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(26px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-26px); }
          to { opacity: 1; transform: translateX(0); }
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

        .animate-float-smooth { animation: float-smooth ease-in-out infinite; will-change: transform; }
        .animate-aurora-slow { animation: aurora-slow ease-in-out infinite; animation-duration: 18s; will-change: transform, opacity; }
        .animate-fadeInUp { animation: fadeInUp 0.85s ease-out both; }
        .animate-slideInLeft { animation: slideInLeft 0.65s ease-out both; }
        .animate-gradient { animation: gradient 4s ease infinite; }
        .animate-pulse-slow { animation: pulse-slow 4.5s ease-in-out infinite; }

        .delay-300 { animation-delay: 300ms; }
        .delay-700 { animation-delay: 700ms; }

        /* PERF: disable expensive effects while scrolling */
        :global(#resume.is-scrolling .perf-blur) {
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
        }

        :global(#resume.is-scrolling .shadow-2xl),
        :global(#resume.is-scrolling .shadow-lg) {
          box-shadow: none !important;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-float-smooth,
          .animate-aurora-slow,
          .animate-fadeInUp,
          .animate-slideInLeft,
          .animate-gradient,
          .animate-pulse-slow { animation: none !important; }
        }
      `}</style>
    </section>
  );
};

export default Resume;
