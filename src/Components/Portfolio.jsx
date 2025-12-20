import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

const makeRng = (seed0) => {
  let seed = seed0 >>> 0;
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
};

const Portfolio = () => {
  // pagination
  const PER_PAGE = 6;
  const [page, setPage] = useState(1);

  // reveal once when section enters viewport
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);

  // reduce motion + coarse pointer (touch)
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);

  // stable seed for random backgrounds
  const seedRef = useRef(Math.floor(Math.random() * 1_000_000_000));

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

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.unobserve(el); // stop observing after first reveal
        }
      },
      { threshold: 0.12 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const projects = useMemo(
    () => [
      {
        title: "Agency",
        description: "Full-stack application built with React.js, Express, and MongoDB.",
        image: "/images/agency.PNG",
        alt: "Agency Project Screenshot",
        tech: ["React", "Express", "MongoDB"],
        href: "#"
      },
      {
        title: "Portfolio",
        description: "Responsive personal portfolio using React and modern libraries.",
        image: "/images/Portfolio.PNG",
        alt: "Portfolio Website Screenshot",
        tech: ["React", "Tailwind", "Framer Motion"],
        href: "#"
      },
      {
        title: "E-commerce Store",
        description: "Online store built with React and Firebase for authentication and data handling.",
        image: "/images/ecommerce.PNG",
        alt: "E-commerce Store Screenshot",
        tech: ["React", "Firebase", "Stripe"],
        href: "#"
      },
      {
        title: "E-commerce Store",
        description: "Online store built with React and Firebase for authentication and data handling.",
        image: "/images/ecommerce.PNG",
        alt: "E-commerce Store Screenshot",
        tech: ["React", "Firebase", "Stripe"],
        href: "#"
      },
      {
        title: "Snow Dream",
        description: "Creative site built with React.js and Framer Motion animations.",
        image: "/images/snowdream.PNG",
        alt: "Snow Dream Project Screenshot",
        tech: ["React", "Framer Motion", "CSS"],
        href: "#"
      },
      {
        title: "Notes App",
        description: "Notes-taking app built with Express.js and MongoDB.",
        image: "/images/notes.png",
        alt: "Notes App Screenshot",
        tech: ["Express", "MongoDB", "Node.js"],
        href: "#"
      },
      {
        title: "Post App",
        description: "Blog-style post application using Express, MongoDB, and EJS templating.",
        image: "/images/auth.jpg",
        alt: "Post App Screenshot",
        tech: ["Express", "MongoDB", "EJS"],
        href: "#"
      }
    ],
    []
  );

  const totalPages = useMemo(() => Math.max(1, Math.ceil(projects.length / PER_PAGE)), [projects.length]);
  const start = useMemo(() => (page - 1) * PER_PAGE, [page]);
  const currentProjects = useMemo(() => projects.slice(start, start + PER_PAGE), [projects, start]);
  const showPagination = projects.length > PER_PAGE;

  const goTo = useCallback(
    (p) => {
      const safe = Math.min(totalPages, Math.max(1, p));
      setPage(safe);
    },
    [totalPages]
  );

  // reduce background work on mobile/touch and on reduced motion
  const enableHeavyMotion = !reduceMotion && !isMobile && !isCoarsePointer;
  const orbCount = enableHeavyMotion ? 12 : 6;

  // Stable, seeded orbs, less count on mobile/touch
  const orbs = useMemo(() => {
    const rng = makeRng(seedRef.current + 999);
    const colors = ["#22d3ee", "#38bdf8", "#3b82f6", "#e2e8f0"];
    return [...Array(orbCount)].map((_, i) => ({
      id: i,
      size: rng() * 380 + 180,
      left: rng() * 100,
      top: rng() * 100,
      color: colors[i % colors.length],
      delay: i * 0.65,
      duration: rng() * 18 + 26,
      blur: rng() * 30 + 70
    }));
  }, [orbCount]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen flex flex-col items-center justify-center px-6 sm:px-8 lg:px-20 py-20 overflow-hidden"
      id="portfolio"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#05060c] via-[#070b18] to-[#03050b]" />

      {/* Aurora, disable animation on mobile/touch and reduced motion */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute -top-40 -left-40 w-[900px] h-[900px] rounded-full bg-cyan-500/10 blur-3xl ${enableHeavyMotion ? "animate-aurora-slow" : ""}`} />
        <div className={`absolute top-10 -right-40 w-[860px] h-[860px] rounded-full bg-sky-500/10 blur-3xl ${enableHeavyMotion ? "animate-aurora-slow delay-700" : ""}`} />
        <div className={`absolute -bottom-40 left-1/3 w-[900px] h-[900px] rounded-full bg-blue-500/10 blur-3xl ${enableHeavyMotion ? "animate-aurora-slow delay-300" : ""}`} />
      </div>

      {/* Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {orbs.map((o) => (
          <div
            key={o.id}
            className={`absolute rounded-full opacity-10 ${enableHeavyMotion ? "animate-float-smooth" : ""}`}
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

      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34, 211, 238, 0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.18) 1px, transparent 1px)",
          backgroundSize: "80px 80px"
        }}
      />

      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.55)_70%,rgba(0,0,0,0.85)_100%)]" />

      <div className="relative z-10 w-full max-w-[1300px]">
        {/* Heading */}
        <div
          className={[
            "text-center mb-12 sm:mb-16 transition-all duration-1000 transform",
            inView ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
          ].join(" ")}
        >
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold inline-block tracking-tight text-white">
            My{" "}
            <span
              className={[
                "text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500",
                enableHeavyMotion ? "animate-gradient" : ""
              ].join(" ")}
              style={{ backgroundSize: "200% auto" }}
            >
              Portfolio
            </span>
          </h2>

          <div className={`h-1 w-36 bg-gradient-to-r from-cyan-400 to-transparent mx-auto mt-6 rounded-full ${enableHeavyMotion ? "animate-pulse-slow" : ""}`} />

          <p className="text-slate-200/90 text-lg sm:text-xl mt-6 max-w-3xl mx-auto leading-relaxed">
            A selection of projects showing clean UI, smooth interactions, and reliable full stack features.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          {currentProjects.map((project, localIndex) => {
            const globalIndex = start + localIndex;

            return (
              <article
                key={`${project.title}-${globalIndex}`}
                className={[
                  "group relative bg-slate-900/45 backdrop-blur-xl rounded-3xl overflow-hidden border border-slate-700/50 hover:border-cyan-400/40 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-400/10 transform hover:-translate-y-2",
                  inView ? "animate-revealUp" : "opacity-0 translate-y-6"
                ].join(" ")}
                style={inView ? { animationDelay: `${localIndex * 0.12}s` } : undefined}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/7 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                <div className="relative h-64 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://via.placeholder.com/600x420/0ea5e9/000000?text=" + encodeURIComponent(project.title);
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                  {/* Tech chips, CSS only, no React hover state */}
                  <div className="absolute left-5 right-5 top-5 flex flex-wrap gap-2 opacity-0 -translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="px-3 py-1.5 bg-slate-950/55 backdrop-blur-md text-slate-100 text-xs font-extrabold rounded-full border border-white/10"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="absolute bottom-5 left-5 right-5 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                    <a
                      href={project.href}
                      className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-cyan-400 text-black font-extrabold hover:shadow-2xl hover:shadow-cyan-400/25 transition-all duration-300"
                    >
                      View Project
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </a>
                  </div>
                </div>

                <div className="relative p-7">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500">
                      {project.title}
                    </h3>

                    <span className="px-3 py-1.5 rounded-full bg-slate-800/35 border border-slate-700/45 text-slate-200 text-xs font-extrabold">
                      Case Study
                    </span>
                  </div>

                  <p className="text-slate-200/90 text-base leading-relaxed mt-3">{project.description}</p>

                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-300 text-sm font-semibold">
                      <span className={`w-2 h-2 rounded-full bg-cyan-400/80 ${enableHeavyMotion ? "animate-pulse-slow" : ""}`} />
                      <span>UI, API, Deployment</span>
                    </div>

                    <a
                      href={project.href}
                      className="group/btn inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200 font-extrabold transition-all duration-300"
                    >
                      Details
                      <svg
                        className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </a>
                  </div>
                </div>

                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-cyan-500/14 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </article>
            );
          })}
        </div>

        {/* Pagination */}
        {showPagination && (
          <div className="flex flex-col items-center gap-4 mb-14">
            <div className="flex items-center gap-3">
              <button
                onClick={() => goTo(page - 1)}
                disabled={page === 1}
                className={`px-4 py-2 rounded-xl border font-extrabold transition-all duration-300 ${
                  page === 1
                    ? "opacity-40 cursor-not-allowed border-slate-700/50 bg-slate-900/25 text-slate-300"
                    : "border-slate-700/60 bg-slate-900/45 text-slate-100 hover:border-cyan-400/45 hover:shadow-lg hover:shadow-cyan-400/10"
                }`}
              >
                Prev
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const p = i + 1;
                  const active = p === page;

                  return (
                    <button
                      key={p}
                      onClick={() => goTo(p)}
                      className={`w-10 h-10 rounded-xl border font-extrabold transition-all duration-300 ${
                        active
                          ? "border-cyan-400/60 bg-cyan-400/15 text-white shadow-lg shadow-cyan-400/10"
                          : "border-slate-700/60 bg-slate-900/35 text-slate-200 hover:border-cyan-400/40"
                      }`}
                      aria-label={`Go to page ${p}`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => goTo(page + 1)}
                disabled={page === totalPages}
                className={`px-4 py-2 rounded-xl border font-extrabold transition-all duration-300 ${
                  page === totalPages
                    ? "opacity-40 cursor-not-allowed border-slate-700/50 bg-slate-900/25 text-slate-300"
                    : "border-slate-700/60 bg-slate-900/45 text-slate-100 hover:border-cyan-400/45 hover:shadow-lg hover:shadow-cyan-400/10"
                }`}
              >
                Next
              </button>
            </div>

            <div className="text-slate-300/80 text-sm font-semibold">
              Showing <span className="text-slate-100">{start + 1}</span> to{" "}
              <span className="text-slate-100">{Math.min(start + PER_PAGE, projects.length)}</span> of{" "}
              <span className="text-slate-100">{projects.length}</span>
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className={inView ? "text-center animate-fadeInUp" : "text-center opacity-0 translate-y-6"}>
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 px-8 py-5 bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl hover:border-cyan-400/40 transition-all duration-300 group">
            <span className="text-lg text-slate-200/90 font-semibold">Want to see more work?</span>

            <div className="flex items-center gap-3">
              <a
                href="https://github.com/MUHAMMADALLEEY"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200 font-extrabold transition-colors duration-300"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
                GitHub
              </a>

              <span className="text-slate-400">or</span>

              <a
                href="https://www.linkedin.com/in/muhammad-a-105104253/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sky-300 hover:text-sky-200 font-extrabold transition-colors duration-300"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </a>
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

        @keyframes revealUp {
          from {
            opacity: 0;
            transform: translateY(22px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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
          animation: fadeInUp 0.85s ease-out forwards;
        }

        .animate-gradient {
          animation: gradient 4s ease infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4.5s ease-in-out infinite;
        }

        .animate-revealUp {
          animation: revealUp 0.9s ease-out forwards;
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
          .animate-gradient,
          .animate-pulse-slow,
          .animate-revealUp {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Portfolio;
