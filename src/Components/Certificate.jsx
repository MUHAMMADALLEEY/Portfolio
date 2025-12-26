import React, { useEffect, useMemo, useRef, useState } from "react";
import Snowfall from "react-snowfall";

const makeRng = (seed0) => {
  let seed = seed0 >>> 0;
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
};

// Icon components
const AwardIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="8" r="7" />
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const SearchIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const StarIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const FilterIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

const GridIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const ListIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

const Certification = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);
  const sectionRef = useRef(null);
  const [isSectionInView, setIsSectionInView] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimerRef = useRef(0);
  const [smoothMouse, setSmoothMouse] = useState({ x: 0, y: 0 });
  const targetMouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(0);
  const mountedRef = useRef(false);
  const seedRef = useRef(Math.floor(Math.random() * 1_000_000_000));

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("Newest");
  const [viewMode, setViewMode] = useState("grid");

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

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => setIsSectionInView(entry.isIntersecting), { threshold: 0.06 });
    obs.observe(el);
    return () => obs.disconnect();
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

  const enableHeavyMotion = !reduceMotion && !isMobile && !isCoarsePointer;
  const heavyEffectsEnabled = enableHeavyMotion && isSectionInView && !isScrolling;

  useEffect(() => {
    if (!heavyEffectsEnabled) {
      setSmoothMouse({ x: 0, y: 0 });
      return;
    }

    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      targetMouseRef.current = { x, y };
    };

    window.addEventListener("mousemove", onMove, { passive: true });

    const tick = () => {
      if (!mountedRef.current) return;

      setSmoothMouse((prev) => {
        const t = targetMouseRef.current;
        const dx = t.x - prev.x;
        const dy = t.y - prev.y;
        const nx = prev.x + dx * 0.08;
        const ny = prev.y + dy * 0.08;
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

  const orbCount = heavyEffectsEnabled ? 6 : 0;
  const particleCount = heavyEffectsEnabled ? 30 : 0;

  const orbs = useMemo(() => {
    if (orbCount === 0) return [];
    const rng = makeRng(seedRef.current + 101);
    return [...Array(orbCount)].map((_, i) => ({
      id: i,
      size: rng() * 300 + 200,
      left: rng() * 100,
      top: rng() * 100,
      delay: i * 0.6,
      duration: rng() * 15 + 20,
      blur: rng() * 12 + 20
    }));
  }, [orbCount]);

  const particles = useMemo(() => {
    if (particleCount === 0) return [];
    const rng = makeRng(seedRef.current + 202);
    return [...Array(particleCount)].map((_, i) => ({
      id: i,
      size: rng() * 3 + 1,
      left: rng() * 100,
      top: rng() * 100,
      delay: rng() * 6,
      duration: rng() * 12 + 12
    }));
  }, [particleCount]);

  const certifications = useMemo(
    () => [
      {
        id: "c1",
        title: "Advanced React & Performance",
        issuer: "Hacker Rank",
        category: "Frontend",
        date: "2025-11-24",
        status: "Completed",
        credentialId: "962ADB6C3D98",
        verifyUrl: "https://www.hackerrank.com/certificates/962adb6c3d98",
        highlights: [
          "Built dynamic and responsive UIs using React 18+ features",
          "Implemented performance optimization techniques including memoization and code splitting",
          "Applied advanced React patterns such as compound components, render props, and context API",
          "Integrated RESTful APIs and GraphQL for efficient data fetching",
          "Used modern state management solutions like Redux Toolkit and Zustand"
        ],
        skills: ["React", "TypeScript", "Performance"]
      },
      {
        id: "c2",
        title: "Full-Stack Node.js Development",
        issuer: "Udemy",
        category: "Backend",
        date: "2024-11-20",
        status: "Completed",
        credentialId: "UC2ODE921W46T",
        verifyUrl: "#",
        highlights: [
          "Developed RESTful APIs using Node.js and Express",
          "Implemented authentication & authorization with JWT and OAuth",
          "Designed and optimized relational and NoSQL databases",
          "Built responsive front-end interfaces with React.js",
          "Integrated third-party APIs and payment gateways",
          "Implemented server-side rendering and state management",
          "Ensured application security and performance optimization"
        ],
        skills: ["Node.js", "Express", "MongoDB"]
      },
      {
        id: "c3",
        title: "Sql",
        issuer: "Hacker Rank",
        category: "Sql",
        date: "2024-03-25",
        status: "Completed",
        credentialId: "3A4C491B1482",
        verifyUrl: "https://www.hackerrank.com/certificates/3a4c491b1483",
        highlights: [
          "Designed and optimized complex SQL queries for large datasets",
          "Implemented database indexing and performance tuning, reducing query time by 50%",
          "Developed stored procedures, triggers, and views to support business logic",
          "Performed data migration and ETL tasks between multiple database systems",
          "Ensured data integrity and security by implementing constraints and user roles"
        ],
        skills: ["SQL"]
      }
    ],
    []
  );

  const categories = useMemo(() => {
    const set = new Set(["All"]);
    certifications.forEach((c) => set.add(c.category));
    return Array.from(set);
  }, [certifications]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = certifications.filter((c) => {
      const matchCategory = category === "All" ? true : c.category === category;
      if (!matchCategory) return false;
      if (!q) return true;

      const hay = [
        c.title,
        c.issuer,
        c.category,
        c.status,
        c.credentialId,
        ...(c.skills || []),
        ...(c.highlights || [])
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return hay.includes(q);
    });

    list.sort((a, b) => {
      const da = new Date(a.date).getTime();
      const db = new Date(b.date).getTime();
      return sort === "Oldest" ? da - db : db - da;
    });

    return list;
  }, [certifications, query, category, sort]);

  const stats = useMemo(() => {
    const total = certifications.length;
    const completed = certifications.filter((c) => (c.status || "").toLowerCase() === "completed").length;
    const uniqueIssuers = new Set(certifications.map((c) => c.issuer)).size;
    return { total, completed, uniqueIssuers };
  }, [certifications]);

  const showSnow = !reduceMotion && isSectionInView && !isScrolling;

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden py-20 px-4 sm:px-6 lg:px-8"
      id="certifications"
    >
      {/* Background base */}
      <div className="absolute inset-0 pointer-events-none" />

      {/* Snowfall layer, above bg, below content */}
      {showSnow && (
        <div className="absolute inset-0 z-[5] pointer-events-none">
          <Snowfall
            color="#82C3D9"
            snowflakeCount={80}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      )}

      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none z-[4]">
        {heavyEffectsEnabled &&
          orbs.map((o) => (
            <div
              key={o.id}
              className="absolute rounded-full mix-blend-screen animate-float-slow"
              style={{
                width: o.size,
                height: o.size,
                left: `${o.left}%`,
                top: `${o.top}%`,
                background:
                  "radial-gradient(circle, rgba(56, 189, 248, 0.15), rgba(59, 130, 246, 0.05), transparent)",
                filter: `blur(${o.blur}px)`,
                animationDelay: `${o.delay}s`,
                animationDuration: `${o.duration}s`,
                transform: `translate3d(${smoothMouse.x * 0.3}px, ${smoothMouse.y * 0.3}px, 0)`
              }}
            />
          ))}

        {heavyEffectsEnabled &&
          particles.map((p) => (
            <div
              key={p.id}
              className="absolute rounded-full bg-cyan-400/20 animate-twinkle"
              style={{
                width: p.size,
                height: p.size,
                left: `${p.left}%`,
                top: `${p.top}%`,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`
              }}
            />
          ))}

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(56, 189, 248, 0.3) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(56, 189, 248, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
            transform: heavyEffectsEnabled
              ? `translate3d(${smoothMouse.x * 0.5}px, ${smoothMouse.y * 0.5}px, 0)`
              : undefined
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
            <AwardIcon />
            <span className="text-cyan-400 text-sm font-semibold">Professional Certifications</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 bg-clip-text text-transparent">
            Skills & Credentials
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Verified achievements and continuous learning across frontend, backend, and modern engineering practices
          </p>
        </div>

        {/* Stats */}
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 transition-all duration-1000 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <StatCard label="Total Certifications" value={stats.total} color="cyan" />
          <StatCard label="Completed" value={stats.completed} color="emerald" />
          <StatCard label="Unique Issuers" value={stats.uniqueIssuers} color="purple" />
        </div>

        {/* Filters */}
        <div
          className={`bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-6 mb-12 transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-5 relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <SearchIcon />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search certifications..."
                className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
            </div>

            <div className="lg:col-span-3 relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <FilterIcon />
              </div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white appearance-none focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-2">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white appearance-none focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all cursor-pointer"
              >
                <option value="Newest">Newest</option>
                <option value="Oldest">Oldest</option>
              </select>
            </div>

            <div className="lg:col-span-2 flex gap-2">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all ${
                  viewMode === "grid"
                    ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-400"
                    : "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-slate-300"
                } border`}
                aria-label="Grid view"
              >
                <GridIcon />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all ${
                  viewMode === "list"
                    ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-400"
                    : "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-slate-300"
                } border`}
                aria-label="List view"
              >
                <ListIcon />
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-slate-400">
              Showing <span className="text-cyan-400 font-semibold">{filtered.length}</span>{" "}
              {filtered.length === 1 ? "certification" : "certifications"}
            </span>
          </div>
        </div>

        {/* Certifications */}
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-4"}>
          {filtered.map((cert, i) => (
            <CertCard key={cert.id} cert={cert} index={i} viewMode={viewMode} />
          ))}
        </div>

        {!filtered.length && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-800/50 border border-slate-700/50 mb-6">
              <div className="text-slate-500">
                <SearchIcon />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-300 mb-2">No results found</h3>
            <p className="text-slate-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes float-slow {
          0%,
          100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(20px, -20px);
          }
        }
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.3);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-float-slow {
          animation: float-slow 20s ease-in-out infinite;
        }
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

function StatCard({ label, value, color }) {
  const colorClasses = {
    cyan: "from-cyan-500/20 to-blue-500/20 border-cyan-500/30",
    emerald: "from-emerald-500/20 to-green-500/20 border-emerald-500/30",
    purple: "from-purple-500/20 to-pink-500/20 border-purple-500/30"
  };

  return (
    <div className={`relative group bg-gradient-to-br ${colorClasses[color]} backdrop-blur-xl border rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl`}>
      <div className="flex items-start justify-between">
        <div className="p-3 rounded-xl bg-slate-900/50 text-white/90">
          <AwardIcon />
        </div>
        <div className="text-right">
          <div className="text-3xl font-black text-white">{value}</div>
          <div className="text-sm text-slate-400 mt-1">{label}</div>
        </div>
      </div>
    </div>
  );
}

function CertCard({ cert, index, viewMode }) {
  const dateLabel = formatMonthYear(cert.date);

  const categoryColors = {
    Frontend: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
    Backend: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    Engineering: "bg-purple-500/10 text-purple-300 border-purple-500/30",
    Cloud: "bg-orange-500/10 text-orange-300 border-orange-500/30",
    Design: "bg-pink-500/10 text-pink-300 border-pink-500/30",
    Sql: "bg-sky-500/10 text-sky-300 border-sky-500/30"
  };

  const catClass = categoryColors[cert.category] || categoryColors.Frontend;

  const verifyClick = (e) => {
    if (!cert.verifyUrl || cert.verifyUrl === "#") e.preventDefault();
  };

  if (viewMode === "list") {
    return (
      <div
        className="group bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300"
        style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-start gap-4 mb-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-200">
                <AwardIcon />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  {cert.title}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                  <span className="flex items-center gap-1">
                    <StarIcon />
                    {cert.issuer}
                  </span>
                  <span>•</span>
                  <span>{dateLabel}</span>
                  <span className={`px-3 py-1 rounded-full border text-xs font-semibold ${catClass}`}>{cert.category}</span>
                </div>
              </div>
            </div>

            {!!cert.credentialId && (
              <div className="text-xs text-slate-500 mb-3">
                Credential ID: <span className="text-slate-300 font-semibold">{cert.credentialId}</span>
              </div>
            )}

            {cert.skills?.length ? (
              <div className="flex flex-wrap gap-2">
                {cert.skills.map((skill) => (
                  <span key={skill} className="px-3 py-1 rounded-lg bg-slate-800/50 text-slate-300 text-xs font-medium border border-slate-700/50">
                    {skill}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <a
            href={cert.verifyUrl}
            onClick={verifyClick}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-300 font-semibold hover:from-cyan-500/30 hover:to-blue-500/30 hover:shadow-lg hover:shadow-cyan-500/20 transition-all whitespace-nowrap"
          >
            <span>Verify</span>
            <ExternalLinkIcon />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      className="group relative bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300"
      style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.08}s both` }}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="flex items-start justify-between gap-3">
        <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-200">
          <AwardIcon />
        </div>

        <span className={`px-3 py-1 rounded-full border text-xs font-semibold ${catClass}`}>{cert.category}</span>
      </div>

      <h3 className="mt-4 text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">{cert.title}</h3>

      <div className="mt-2 text-sm text-slate-400 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1">
          <StarIcon />
          {cert.issuer}
        </span>
        <span>•</span>
        <span>{dateLabel}</span>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-emerald-300">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
          <CheckCircleIcon />
          {cert.status || "Completed"}
        </span>
      </div>

      {!!cert.credentialId && (
        <div className="mt-3 text-xs text-slate-500">
          Credential ID: <span className="text-slate-300 font-semibold">{cert.credentialId}</span>
        </div>
      )}

      {!!cert.highlights?.length && (
        <ul className="mt-4 space-y-2 text-sm text-slate-300/80">
          {cert.highlights.slice(0, 3).map((h, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-cyan-300/80 shrink-0" />
              <span>{h}</span>
            </li>
          ))}
        </ul>
      )}

      {!!cert.skills?.length && (
        <div className="mt-4 flex flex-wrap gap-2">
          {cert.skills.slice(0, 6).map((skill) => (
            <span key={skill} className="px-3 py-1 rounded-lg bg-slate-800/50 text-slate-300 text-xs font-medium border border-slate-700/50">
              {skill}
            </span>
          ))}
        </div>
      )}

      <div className="mt-6">
        <a
          href={cert.verifyUrl}
          onClick={verifyClick}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-300 font-semibold hover:from-cyan-500/30 hover:to-blue-500/30 hover:shadow-lg hover:shadow-cyan-500/20 transition-all"
        >
          <span>Verify</span>
          <ExternalLinkIcon />
        </a>
      </div>
    </div>
  );
}

function formatMonthYear(iso) {
  if (!iso) return "Unknown";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, { month: "short", year: "numeric" });
}

export default Certification;
