import React, { useEffect, useMemo, useRef, useState } from "react";

const Resume = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // UPDATED: stable background orbs (cyan, sky, blue, slate)
  const orbs = useMemo(
    () =>
      [...Array(18)].map((_, i) => ({
        id: i,
        size: Math.random() * 360 + 180,
        left: Math.random() * 100,
        top: Math.random() * 100,
        color: ["#22d3ee", "#38bdf8", "#3b82f6", "#e2e8f0"][i % 4],
        delay: i * 0.55,
        duration: Math.random() * 18 + 26,
        blur: Math.random() * 30 + 70
      })),
    []
  );

  const tabs = useMemo(
    () => [
      { name: "Experience", icon: "💼" },
      { name: "Education", icon: "🎓" }
    ],
    []
  );

  const experienceData = useMemo(
    () => [
      {
        year: "2025 - present",
        title: "Web Developer",
        company: "&Build",
        description: "Created responsive, user-friendly interfaces and optimized website performance.",
        skills: ["React", "Node.js", "UI/UX"]
      },
      {
        year: "2024",
        title: "React Developer",
        company: "Remote",
        description: "Built dynamic, responsive web applications using React.js and related libraries.",
        skills: ["React", "JavaScript", "API"]
      },
      {
        year: "2024 - Sep",
        title: "Backend Developer",
        company: "Remote",
        description: "Designed and implemented backend APIs, Firebase, and database management solutions.",
        skills: ["Firebase", "MongoDB", "Express"]
      }
    ],
    []
  );

  const educationData = useMemo(
    () => [
      {
        year: "2020 - 2024",
        title: "BSCS",
        company: "Riphah International University",
        description: "Expertise in Programming, Web development, and Problem-solving.",
        grade: "3.5+ GPA"
      },
      {
        year: "2018 - 2020",
        title: "ICS",
        company: "Punjab College Gojra",
        description: "Gained knowledge of how computers work at the backend, and more.",
        grade: "Distinction"
      },
      {
        year: "2024",
        title: "React Developer",
        company: "Remote",
        description: "Cleared all concepts of React in my learning journey.",
        grade: "Certificate"
      }
    ],
    []
  );

  const summaryCards = useMemo(
    () => [
      { label: "Experience", value: "2+ Years", icon: "⏱️" },
      { label: "Projects", value: "15+", icon: "🧩" },
      { label: "Availability", value: "Open", icon: "✅" },
      { label: "Timezone", value: "PKT", icon: "🕒" }
    ],
    []
  );

  const goToTab = (idx) => {
    setActiveTab(idx);
    setTimeout(() => contentRef.current?.focus?.(), 0);
  };

  const TabButton = ({ tab, index }) => {
    const isActive = activeTab === index;

    return (
      <button
        type="button"
        onClick={() => goToTab(index)}
        className={[
          "relative w-full text-left rounded-2xl transition-all duration-500 transform hover:scale-[1.02] group overflow-hidden",
          "px-7 py-6",
          // UPDATED: active = cyan, non-active = blackish with cyan hover
          isActive
            ? "bg-cyan-400 text-black shadow-2xl shadow-cyan-400/20"
            : "bg-slate-900/45 backdrop-blur-xl border border-slate-700/50 text-slate-200 hover:border-cyan-400/40"
        ].join(" ")}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        <div className="relative flex items-center gap-4">
          <span className="text-5xl leading-none transform group-hover:scale-110 transition-transform duration-300">
            {tab.icon}
          </span>
          <div className="min-w-0">
            <div className="text-2xl font-extrabold tracking-tight">{tab.name}</div>
            <div className={`text-sm mt-1 ${isActive ? "text-black/70" : "text-slate-400"}`}>Tap to view details</div>
          </div>
        </div>

        {isActive && (
          <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-black rounded-full animate-ping" />
            <span className="w-2.5 h-2.5 bg-black rounded-full" />
          </div>
        )}
      </button>
    );
  };

  const TimelineItem = ({ item, index, variant = "purple", rightPill }) => {
    // UPDATED: timeline line + dot colors for cyan theme
    const line = "border-cyan-500/20 hover:border-cyan-400/45";
    const dot = "from-cyan-400 to-sky-500 shadow-cyan-400/20";
    const hoverBorder = "hover:border-cyan-400/35 hover:shadow-cyan-400/10";
    const titleHover = "group-hover:text-cyan-200";

    return (
      <div
        className={`relative pl-10 pb-10 border-l-2 transition-all duration-500 ${line} animate-slideInLeft`}
        style={{ animationDelay: `${index * 0.12}s` }}
      >
        <div
          className={`absolute left-0 top-0 w-5 h-5 bg-gradient-to-r ${dot} rounded-full -translate-x-[11px] shadow-lg animate-pulse-slow`}
        />

        <div
          className={[
            "bg-slate-900/45 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 sm:p-9",
            "transition-all duration-500 transform hover:-translate-y-1 group hover:shadow-2xl",
            hoverBorder
          ].join(" ")}
        >
          <div className="flex flex-wrap justify-between items-start gap-4 mb-5">
            <div className="min-w-0">
              {/* UPDATED: year pill cyan */}
              <p className="text-cyan-200 text-base font-extrabold mb-3 inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 rounded-full border border-cyan-500/25">
                <span className="text-lg">🗓️</span>
                <span>{item.year}</span>
              </p>

              <h3
                className={`text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-3 transition-colors duration-300 ${titleHover}`}
              >
                {item.title}
              </h3>

              <p className="text-slate-200/90 font-semibold text-2xl flex items-center gap-2">
                <span>🏢</span>
                <span className="break-words">{item.company}</span>
              </p>
            </div>

            {rightPill ? (
              <div className="mt-1">
                {/* UPDATED: grade pill cyan */}
                <span className="px-5 py-2 bg-cyan-500/12 text-cyan-200 rounded-full text-base font-extrabold border border-cyan-400/25">
                  {rightPill}
                </span>
              </div>
            ) : null}
          </div>

          <p className="text-slate-200 leading-relaxed text-xl sm:text-2xl">{item.description}</p>

          {"skills" in item && Array.isArray(item.skills) && (
            <div className="flex flex-wrap gap-2.5 mt-6">
              {/* UPDATED: skills chips cyan */}
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
  };

  return (
    <section
      className="relative w-full min-h-screen flex items-center justify-center px-6 sm:px-8 lg:px-20 py-20 overflow-hidden"
      id="resume"
    >
      {/* UPDATED: black background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#05060c] via-[#070b18] to-[#03050b]" />

      {/* UPDATED: aurora cyan, sky, blue */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[900px] h-[900px] rounded-full bg-cyan-500/10 blur-3xl animate-aurora-slow" />
        <div className="absolute top-10 -right-40 w-[860px] h-[860px] rounded-full bg-sky-500/10 blur-3xl animate-aurora-slow delay-700" />
        <div className="absolute -bottom-40 left-1/3 w-[900px] h-[900px] rounded-full bg-blue-500/10 blur-3xl animate-aurora-slow delay-300" />
      </div>

      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {orbs.map((o) => (
          <div
            key={o.id}
            className="absolute rounded-full opacity-10 animate-float-smooth"
            style={{
              width: `${o.size}px`,
              height: `${o.size}px`,
              left: `${o.left}%`,
              top: `${o.top}%`,
              background: `radial-gradient(circle, ${o.color}, transparent 70%)`,
              animationDelay: `${o.delay}s`,
              animationDuration: `${o.duration}s`,
              filter: `blur(${o.blur}px)`
            }}
          />
        ))}
      </div>

      {/* UPDATED: cyan grid */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34, 211, 238, 0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.18) 1px, transparent 1px)",
          backgroundSize: "80px 80px"
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.55)_70%,rgba(0,0,0,0.85)_100%)]" />

      <div className="relative z-10 w-full max-w-[1300px]">
        {/* Heading */}
        <div
          className={`text-center mb-14 sm:mb-20 transition-all duration-1000 transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
          }`}
        >
          <div className="inline-block relative">
            {/* UPDATED: title white, gradient cyan */}
            <h2 className="text-5xl sm:text-6xl lg:text-8xl font-extrabold mb-4 tracking-tight text-white">
              Resume{" "}
              <span
                className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 animate-gradient"
                style={{ backgroundSize: "200% auto" }}
              >
                Overview
              </span>
            </h2>

            {/* UPDATED: underline cyan */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-44 sm:w-56 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-full animate-pulse-slow" />
          </div>

          <p className="text-slate-200/90 text-lg sm:text-2xl mt-6 sm:mt-8 max-w-3xl mx-auto leading-relaxed">
            Experience and education, presented in a clean timeline, with bigger text and a smooth UI.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div
            className={`lg:col-span-4 space-y-4 transition-all duration-1000 delay-200 transform ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-20"
            }`}
          >
            <div className="space-y-4">{tabs.map((t, idx) => <TabButton key={t.name} tab={t} index={idx} />)}</div>

            {/* Summary cards */}
            <div className="relative bg-slate-900/45 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-7 overflow-hidden shadow-2xl shadow-black/25">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              <h3 className="text-2xl font-extrabold text-white mb-6">Quick Summary</h3>

              <div className="grid grid-cols-2 gap-4">
                {summaryCards.map((c) => (
                  <div
                    key={c.label}
                    className="bg-slate-800/30 border border-slate-700/40 rounded-2xl p-5 hover:border-cyan-400/30 transition-all duration-300"
                  >
                    <div className="text-3xl">{c.icon}</div>
                    <div className="text-slate-300 text-sm font-semibold mt-2">{c.label}</div>
                    <div className="text-white text-2xl font-extrabold mt-1">{c.value}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {/* UPDATED: contact button cyan */}
                <a
                  href="#contact"
                  className="text-center px-4 py-3 rounded-xl bg-cyan-400 text-black font-extrabold text-lg hover:scale-[1.02] transition-transform duration-300"
                >
                  Contact
                </a>

                {/* UPDATED: portfolio button cyan hover */}
                <a
                  href="#portfolio"
                  className="text-center px-4 py-3 rounded-xl bg-slate-900/40 border border-slate-700/60 text-slate-100 font-extrabold text-lg hover:border-cyan-400/40 hover:scale-[1.02] transition-all duration-300"
                >
                  Portfolio
                </a>
              </div>
            </div>
          </div>

          {/* Content */}
          <div
            className={`lg:col-span-8 transition-all duration-1000 delay-400 transform ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-20"
            }`}
          >
            <div className="bg-slate-900/45 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 sm:p-10 min-h-[640px] shadow-2xl shadow-black/30">
              <div ref={contentRef} tabIndex={-1} className="outline-none">
                {/* Content header */}
                <div className="flex items-start sm:items-center justify-between gap-4 mb-8">
                  <div className="flex items-center gap-4">
                    {/* UPDATED: icon tile cyan */}
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br from-cyan-400 to-sky-500 shadow-cyan-400/20">
                      <span className="text-4xl">{tabs[activeTab].icon}</span>
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
                    <div className="px-5 py-2 rounded-full bg-slate-800/40 border border-slate-700/50 text-slate-100 font-extrabold text-lg">
                      Updated ✅
                    </div>
                    <div className="text-slate-400 text-sm mt-2">Clean timeline view</div>
                  </div>
                </div>

                {/* Intro */}
                <div className="text-slate-200 text-xl sm:text-2xl leading-relaxed bg-slate-800/30 rounded-2xl p-7 border border-slate-700/30 mb-10 animate-fadeInUp">
                  {activeTab === 0
                    ? "I build modern web apps with strong UI, clean APIs, and reliable delivery. Here are my most recent roles."
                    : "A strong academic base plus practical learning, focused on programming and modern web development."}
                </div>

                {/* Tab Content */}
                {activeTab === 0 && (
                  <div className="space-y-1">
                    {experienceData.map((item, idx) => (
                      <TimelineItem key={`${item.title}-${idx}`} item={item} index={idx} />
                    ))}
                  </div>
                )}

                {activeTab === 1 && (
                  <div className="space-y-1">
                    {educationData.map((item, idx) => (
                      <TimelineItem key={`${item.title}-${idx}`} item={item} index={idx} rightPill={item.grade} />
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
          100% {
            transform: translate3d(0, 0, 0);
          }
          25% {
            transform: translate3d(-12px, -12px, 0);
          }
          50% {
            transform: translate3d(12px, -8px, 0);
          }
          75% {
            transform: translate3d(-8px, 12px, 0);
          }
        }

        @keyframes aurora-slow {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 0.65;
          }
          50% {
            transform: translate3d(18px, -14px, 0) scale(1.03);
            opacity: 0.9;
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

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-26px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
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

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.55;
            transform: scale(1);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.06);
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
          animation: fadeInUp 0.85s ease-out both;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.65s ease-out both;
        }

        .animate-gradient {
          animation: gradient 4s ease infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4.5s ease-in-out infinite;
        }

        .delay-300 {
          animation-delay: 300ms;
        }
        .delay-700 {
          animation-delay: 700ms;
        }
      `}</style>
    </section>
  );
};

export default Resume;
