import React, { useEffect, useMemo, useState } from "react";

const About = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // UPDATED: cyan, sky, blue, white (removed purple, pink)
  const orbs = useMemo(
    () =>
      [...Array(12)].map((_, i) => ({
        id: i,
        size: Math.random() * 420 + 180,
        left: Math.random() * 100,
        top: Math.random() * 100,
        color: ["#22d3ee", "#38bdf8", "#3b82f6", "#e2e8f0"][i % 4],
        delay: i * 0.65,
        duration: Math.random() * 18 + 26,
        blur: Math.random() * 30 + 70
      })),
    []
  );

  const skillTags = useMemo(
    () => ["React", "Node.js", "MongoDB", "Tailwind", "JavaScript", "Express", "Firebase", "REST APIs"],
    []
  );

  const highlights = useMemo(
    () => [
      {
        title: "Frontend that feels premium",
        desc: "Clean layouts, smooth animations, pixel-perfect responsiveness, and great UX for real users.",
        icon: "✨"
      },
      {
        title: "Backend that scales",
        desc: "Well-structured APIs, validation, auth, database design, and code that is easy to maintain.",
        icon: "⚙️"
      },
      {
        title: "Fast delivery, clear communication",
        desc: "Daily updates, organized tasks, and clean commits, so you always know what is happening.",
        icon: "📌"
      },
      {
        title: "Performance and SEO mindset",
        desc: "Optimized bundles, lazy loading, caching basics, and technical SEO friendly pages.",
        icon: "🚀"
      }
    ],
    []
  );

  const whatIDo = useMemo(
    () => [
      { icon: "🧩", title: "Build UI", text: "Landing pages, dashboards, admin panels, components, animations." },
      { icon: "🔐", title: "Auth and Security", text: "JWT, role-based access, protected routes, best practices." },
      { icon: "🗄️", title: "Database", text: "MongoDB schemas, indexes, data modeling, migrations planning." },
      { icon: "🔌", title: "Integrations", text: "Payments, email, third-party APIs, file uploads, webhooks." }
    ],
    []
  );

  return (
    <section
      className="relative w-full min-h-screen flex items-center justify-center px-6 sm:px-8 lg:px-20 py-20 overflow-hidden"
      id="about"
    >
      {/* UPDATED: black base background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#05060c] via-[#070b18] to-[#03050b]" />

      {/* UPDATED: aurora layers cyan, sky, blue */}
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

      {/* UPDATED: grid overlay cyan tint */}
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
          className={`text-center mb-12 sm:mb-16 transition-all duration-1000 transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
          }`}
        >
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold inline-block tracking-tight text-white">
            About{" "}
            {/* UPDATED: cyan gradient */}
            <span
              className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 animate-gradient"
              style={{ backgroundSize: "200% auto" }}
            >
              Me
            </span>
          </h2>

          {/* UPDATED: underline cyan */}
          <div className="h-1 w-36 bg-gradient-to-r from-cyan-400 to-transparent mx-auto mt-6 rounded-full animate-pulse-slow" />

          <p className="text-slate-200/90 text-lg sm:text-xl mt-6 max-w-3xl mx-auto leading-relaxed">
            I build modern, fast, and beautiful web applications, with clean code and a strong focus on user experience.
          </p>
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left */}
          <div
            className={`lg:col-span-7 transition-all duration-1000 delay-200 transform ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-20"
            }`}
          >
            <div className="relative bg-slate-900/45 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 sm:p-10 overflow-hidden shadow-2xl shadow-black/30">
              {/* UPDATED: subtle cyan tint */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/8 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              <div className="relative">
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className="px-4 py-2 rounded-full bg-slate-800/40 border border-slate-700/50 text-slate-100 font-extrabold text-sm sm:text-base">
                    Full Stack Developer
                  </span>

                  {/* UPDATED: badges to cyan/sky */}
                  <span className="px-4 py-2 rounded-full bg-cyan-500/12 border border-cyan-400/25 text-cyan-100 font-extrabold text-sm sm:text-base">
                    React + Node.js
                  </span>
                  <span className="px-4 py-2 rounded-full bg-sky-500/12 border border-sky-400/25 text-sky-100 font-extrabold text-sm sm:text-base">
                    Clean UI and APIs
                  </span>
                </div>

                <h3 className="text-3xl sm:text-5xl font-extrabold leading-tight text-white">
                  Hi, I'm{" "}
                  {/* UPDATED: cyan gradient */}
                  <span
                    className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 animate-gradient"
                    style={{ backgroundSize: "200% auto" }}
                  >
                    Muhammad Ali
                  </span>
                </h3>

                <div className="flex items-center gap-2 mt-5">
                  <div className="h-1 w-20 bg-gradient-to-r from-cyan-400 to-sky-400 rounded-full animate-pulse-slow" />
                  <div className="h-1 w-10 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full animate-pulse-slow delay-300" />
                </div>

                <p className="text-slate-100/90 text-lg sm:text-xl leading-relaxed mt-7 bg-slate-800/25 p-7 rounded-2xl border border-slate-700/40 hover:border-cyan-400/35 transition-all duration-300">
                  I build end-to-end web applications, from a beautiful frontend to a reliable backend. I focus on
                  responsiveness, performance, and clean architecture, so your product is easy to scale and easy to
                  maintain. If you want someone who cares about details and delivers on time, I can help.
                </p>

                {/* Skill tags */}
                <div className="flex flex-wrap gap-3 mt-7">
                  {skillTags.map((skill, index) => (
                    <span
                      key={skill}
                      className="px-5 py-3 bg-slate-800/45 border border-cyan-500/25 rounded-full text-cyan-100 text-sm sm:text-base font-extrabold hover:bg-cyan-500/10 hover:border-cyan-400 transition-all duration-300 hover:scale-105 cursor-default animate-fadeInUp opacity-0"
                      style={{
                        animationDelay: `${0.6 + index * 0.08}s`,
                        animationFillMode: "forwards"
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* UPDATED: buttons, primary cyan with black text, secondary border cyan */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <a
                    href="#contact"
                    className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-cyan-400 text-black text-lg sm:text-xl font-extrabold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-400/35 relative overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <span className="relative">Let's Work Together</span>
                    <svg
                      className="w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>

                  <a
                    href="#resume"
                    className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-slate-900/40 border border-cyan-400/40 text-white text-lg sm:text-xl font-extrabold rounded-xl hover:border-cyan-300/70 hover:bg-slate-900/55 transition-all duration-300 transform hover:scale-105"
                  >
                    View Resume <span className="text-xl">📄</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-8">
              {highlights.map((h, idx) => (
                <div
                  key={h.title}
                  className="relative bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-7 hover:border-cyan-400/35 transition-all duration-500 hover:shadow-xl hover:shadow-cyan-400/10 group overflow-hidden animate-fadeInUp opacity-0"
                  style={{ animationDelay: `${0.35 + idx * 0.1}s`, animationFillMode: "forwards" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/7 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative flex items-start gap-4">
                    <div className="text-4xl">{h.icon}</div>
                    <div>
                      <h4 className="text-2xl font-extrabold text-white group-hover:text-cyan-200 transition-colors duration-300">
                        {h.title}
                      </h4>
                      <p className="text-slate-200/90 text-lg mt-2 leading-relaxed">{h.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right */}
          <div
            className={`lg:col-span-5 transition-all duration-1000 delay-400 transform ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-20"
            }`}
          >
            <div className="relative bg-slate-900/45 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 sm:p-9 shadow-2xl shadow-black/30 overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
                What I{" "}
                {/* UPDATED: cyan gradient */}
                <span
                  className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 animate-gradient"
                  style={{ backgroundSize: "200% auto" }}
                >
                  Do
                </span>
              </h3>

              <p className="text-slate-200/90 text-lg sm:text-xl mt-3 leading-relaxed">
                Here is what you can expect when you hire me.
              </p>

              <div className="mt-7 space-y-4">
                {whatIDo.map((item, idx) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-4 bg-slate-800/30 border border-slate-700/40 rounded-2xl p-6 hover:border-cyan-400/35 hover:bg-slate-800/40 transition-all duration-300 animate-fadeInUp opacity-0"
                    style={{ animationDelay: `${0.55 + idx * 0.08}s`, animationFillMode: "forwards" }}
                  >
                    <div className="text-4xl">{item.icon}</div>
                    <div>
                      <div className="text-2xl font-extrabold text-white">{item.title}</div>
                      <div className="text-slate-200/90 text-lg mt-1 leading-relaxed">{item.text}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* UPDATED: promise card cyan tint */}
              <div className="mt-7 bg-gradient-to-br from-cyan-500/10 to-sky-500/8 border border-cyan-400/20 rounded-2xl p-6">
                <div className="text-white text-2xl font-extrabold">My promise</div>
                <div className="text-slate-100/90 text-lg mt-2 leading-relaxed">
                  You will get clean code, smooth UI, and clear communication, no confusion, no delays.
                </div>
              </div>
            </div>

            {/* Availability card (UPDATED: cyan primary button, black text) */}
            <div className="mt-8 relative bg-gradient-to-br from-cyan-500/12 to-blue-500/10 backdrop-blur-xl border border-cyan-400/25 rounded-3xl p-8 sm:p-9 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent animate-shimmer" />
              <div className="relative">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-3xl font-extrabold text-white">Availability</h4>
                    <p className="text-slate-100/90 text-lg mt-2">Full-time and freelance work</p>
                  </div>
                  <div className="px-5 py-2 rounded-full bg-slate-900/35 border border-slate-700/50 text-slate-100 font-extrabold text-lg">
                    Open ✅
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="bg-slate-900/35 border border-slate-700/45 rounded-2xl p-5">
                    <div className="text-slate-200/80 text-base font-semibold">Response Time</div>
                    <div className="text-white text-2xl font-extrabold mt-1">Fast</div>
                  </div>
                  <div className="bg-slate-900/35 border border-slate-700/45 rounded-2xl p-5">
                    <div className="text-slate-200/80 text-base font-semibold">Timezone</div>
                    <div className="text-white text-2xl font-extrabold mt-1">PKT</div>
                  </div>
                </div>

                <div className="mt-6">
                  <a
                    href="#contact"
                    className="group inline-flex items-center justify-center gap-3 w-full px-10 py-5 bg-cyan-400 text-black text-lg sm:text-xl font-extrabold rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-400/35 relative overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <span className="relative">Get In Touch</span>
                    <svg
                      className="w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
                </div>
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
            opacity: 0.35;
          }
          50% {
            opacity: 0.55;
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

        .animate-pulse-slow {
          animation: pulse-slow 4.5s ease-in-out infinite;
        }

        .animate-shimmer {
          animation: shimmer 2.5s infinite;
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

export default About;
