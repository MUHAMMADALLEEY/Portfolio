import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FiCode,
  FiPenTool,
  FiZap,
  FiGrid,
  FiServer,
  FiDatabase,
  FiCloud,
  FiBox,
  FiFolder,
  FiSmile,
  FiTarget,
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight
} from "react-icons/fi";
import Snowfall from "react-snowfall";

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

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const Skills = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animateBars, setAnimateBars] = useState(false);
  const sectionRef = useRef(null);

  const [reduceMotion, setReduceMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);

  const seedRef = useRef(Math.floor(Math.random() * 1_000_000_000));

  const frontendSkills = useMemo(
    () => [
      { name: "React.js", level: 90, color: "from-orange-500 to-red-500", Icon: FiCode },
      { name: "Next.js", level: 90, color: "from-blue-500 to-cyan-500", Icon: FiPenTool },
      { name: "Tailwind", level: 70, color: "from-cyan-400 to-blue-500", Icon: FiGrid },
      { name: "JavaScript", level: 80, color: "from-yellow-500 to-orange-500", Icon: FiZap }
    ],
    []
  );

  const backendSkills = useMemo(
    () => [
      { name: "PostgreSQL", level: 80, color: "from-cyan-400 to-blue-600", Icon: FiBox },
      { name: "Express.js", level: 85, color: "from-yellow-500 to-orange-600", Icon: FiCloud },
      { name: "MongoDB", level: 80, color: "from-green-500 to-emerald-600", Icon: FiDatabase },
      { name: "Node.js", level: 80, color: "from-green-600 to-lime-600", Icon: FiServer }
    ],
    []
  );

  useEffect(() => {
    setIsVisible(true);

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

      return () => {
        mq.removeEventListener("change", apply);
        mqMobile.removeEventListener("change", apply);
        mqCoarse.removeEventListener("change", apply);
      };
    }

    mq.addListener(apply);
    mqMobile.addListener(apply);
    mqCoarse.addListener(apply);

    return () => {
      mq.removeListener(apply);
      mqMobile.removeListener(apply);
      mqCoarse.removeListener(apply);
    };
  }, []);

  const enableHeavyMotion = !reduceMotion && !isMobile && !isCoarsePointer;

  const orbCount = enableHeavyMotion ? 18 : 8;

  const orbs = useMemo(() => {
    const rng = makeRng(seedRef.current + 333);
    const colors = ["#22d3ee", "#38bdf8", "#3b82f6", "#e2e8f0"];

    return [...Array(orbCount)].map((_, i) => ({
      id: i,
      size: rng() * 420 + 180,
      left: rng() * 100,
      top: rng() * 100,
      color: colors[i % colors.length],
      delay: i * 0.55,
      duration: rng() * 18 + 26,
      blur: rng() * 35 + 75
    }));
  }, [orbCount]);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const t = window.setTimeout(() => setAnimateBars(true), 380);
          observer.disconnect();
          return () => window.clearTimeout(t);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const Stats = useMemo(
    () => [
      { label: "Projects Completed", value: "Many", Icon: FiFolder, gradient: "from-purple-500 to-pink-500" },
      { label: "Technologies", value: "12+", Icon: FiZap, gradient: "from-cyan-500 to-blue-500" },
      { label: "Years Experience", value: "2 +", Icon: FiTarget, gradient: "from-green-500 to-emerald-500" },
      { label: "Happy Clients", value: "10+", Icon: FiSmile, gradient: "from-orange-500 to-red-500" }
    ],
    []
  );

  const chips = useMemo(() => ["UI Focused", "Performance", "Scalable Code", "Clean Architecture"], []);

  const SkillRow = useCallback(
    ({ skill, accent = "cyan" }) => {
      const pill =
        accent === "cyan"
          ? "text-cyan-200 bg-cyan-500/12 border-cyan-500/25"
          : "text-purple-200 bg-purple-500/12 border-purple-500/25";

      const hoverText = accent === "cyan" ? "group-hover/skill:text-cyan-200" : "group-hover/skill:text-purple-200";
      const glow = accent === "cyan" ? "0 0 18px rgba(34, 211, 238, 0.55)" : "0 0 18px rgba(139, 92, 246, 0.55)";

      return (
        <div className="group/skill">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-3 min-w-0">
              <span
                className={[
                  "w-10 h-10 rounded-2xl flex items-center justify-center",
                  accent === "cyan"
                    ? "bg-cyan-500/12 border border-cyan-500/25"
                    : "bg-purple-500/12 border border-purple-500/25"
                ].join(" ")}
                aria-hidden="true"
              >
                <skill.Icon className={accent === "cyan" ? "w-5 h-5 text-cyan-200" : "w-5 h-5 text-purple-200"} />
              </span>

              <h4 className={`text-lg sm:text-xl font-bold text-white truncate transition-colors duration-300 ${hoverText}`}>
                {skill.name}
              </h4>
            </div>

            <span className={`shrink-0 text-sm sm:text-base font-bold px-4 py-2 rounded-full border ${pill}`}>
              {skill.level}%
            </span>
          </div>

          <div className="relative h-4 bg-slate-800/45 rounded-full overflow-hidden border border-slate-700/55">
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-[1400ms] ease-out"
              style={{
                width: animateBars ? `${skill.level}%` : "0%",
                boxShadow: animateBars ? glow : "none"
              }}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${skill.color}`} />
              {enableHeavyMotion && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white/95 rounded-full shadow-lg animate-pulse-fast" />
                </>
              )}
            </div>
          </div>
        </div>
      );
    },
    [animateBars, enableHeavyMotion]
  );

  const SkillCard = useCallback(
    ({ title, subtitle, accent = "cyan", iconBg, iconSvg, children }) => {
      const borderHover =
        accent === "cyan"
          ? enableHeavyMotion
            ? "hover:border-cyan-400/35 hover:shadow-cyan-400/10"
            : "hover:border-cyan-400/35"
          : enableHeavyMotion
            ? "hover:border-purple-500/40 hover:shadow-purple-500/15"
            : "hover:border-purple-500/40";

      const glowBg = accent === "cyan" ? "from-cyan-500/8" : "from-purple-500/8";
      const titleGrad = accent === "cyan" ? "from-cyan-300 via-sky-400 to-blue-500" : "from-purple-400 to-pink-500";

      return (
        <div
          className={[
            "relative bg-slate-900/45 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 sm:p-10",
            "transition-all duration-300 shadow-2xl shadow-black/25 group overflow-hidden",
            borderHover
          ].join(" ")}
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br ${glowBg} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`}
          />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="relative">
            <div className="flex items-start gap-4 mb-8">
              <div
                className={[
                  `w-16 h-16 rounded-2xl ${iconBg} flex items-center justify-center shadow-xl shrink-0`,
                  enableHeavyMotion ? "group-hover:scale-110 transition-transform duration-500" : ""
                ].join(" ")}
              >
                {iconSvg}
              </div>

              <div className="min-w-0">
                <h3 className={`text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${titleGrad}`}>
                  {title}
                </h3>
                <p className="text-slate-400 text-sm sm:text-base mt-1">{subtitle}</p>
              </div>
            </div>

            <div className="space-y-6">{children}</div>

            <div className="mt-8 flex items-center gap-3 text-xs sm:text-sm text-slate-400">
              <span className={`w-2 h-2 rounded-full bg-white/25 ${enableHeavyMotion ? "animate-pulse-slow" : ""}`} />
              <span>Focused on smooth UI and reliable backend APIs</span>
            </div>
          </div>
        </div>
      );
    },
    [enableHeavyMotion]
  );

  const testimonials = useMemo(
    () => [
        {
        name: "Mustafa Ali",
        role: "Software Engineer @ Switchboard | Full Stack Developer | Delivering Scalable Tech That Drives Growth",
        quote:
          "I had the opportunity to manage Muhammad Ali directly, and he consistently impressed me with his frontend expertise. He takes Figma designs and converts them into clean, reusable React and Next.js components with accuracy and attention to detail. His understanding of UI structure, responsiveness, and modern frontend practices made him one of the most reliable developers on the team. Muhammad Ali would be a strong addition to any engineering team seeking a skilled and dependable frontend developer.",
        avatar: "https://media.licdn.com/dms/image/v2/D4D03AQHAGEou5jsHZQ/profile-displayphoto-crop_800_800/B4DZkWKoA8IcAI-/0/1757013509676?e=1767830400&v=beta&t=3wsqWK8OuJBN-UXwPj5QQ2W5FIBEz1rHI98SH-X9zZw" 
    },
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

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen flex items-center justify-center px-6 sm:px-8 lg:px-20 py-20 overflow-hidden"
      id="skills"
    >
             <div className="absolute inset-0 z-[6] pointer-events-none">
  <Snowfall
    color="#82C3D9"
    snowflakeCount={reduceMotion ? 0 : 120}
    style={{ width: "100%", height: "100%" }}
  />
</div>
      <div className="absolute inset-0 bg-gradient-to-br from-[#05060c] via-[#070b18] to-[#03050b]" />

      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute -top-40 -left-40 w-[900px] h-[900px] rounded-full bg-cyan-500/10 blur-3xl ${enableHeavyMotion ? "animate-aurora-slow" : ""}`} />
        <div className={`absolute top-10 -right-40 w-[860px] h-[860px] rounded-full bg-sky-500/10 blur-3xl ${enableHeavyMotion ? "animate-aurora-slow delay-700" : ""}`} />
        <div className={`absolute -bottom-40 left-1/3 w-[900px] h-[900px] rounded-full bg-blue-500/10 blur-3xl ${enableHeavyMotion ? "animate-aurora-slow delay-300" : ""}`} />
      </div>

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
        <div
          className={[
            "text-center mb-14 sm:mb-20 transition-all duration-1000 transform",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
          ].join(" ")}
        >
          <div className="inline-block relative">
            <h2 className="text-5xl sm:text-6xl lg:text-8xl font-extrabold mb-4 tracking-tight text-white">
              My{" "}
              <span
                className={[
                  "text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500",
                  enableHeavyMotion ? "animate-gradient" : ""
                ].join(" ")}
                style={{ backgroundSize: "200% auto" }}
              >
                Skills
              </span>
            </h2>

            <div
              className={[
                "absolute -bottom-2 left-1/2 -translate-x-1/2 w-44 sm:w-56 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-full",
                enableHeavyMotion ? "animate-pulse-slow" : ""
              ].join(" ")}
            />
          </div>

          <p className="text-slate-200/80 text-base sm:text-xl mt-6 sm:mt-8 max-w-3xl mx-auto leading-relaxed">
            Modern frontend, reliable backend, and a focus on performance, UX, and clean code.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            {chips.map((t) => (
              <span
                key={t}
                className="text-xs sm:text-sm px-4 py-2 rounded-full border border-slate-700/60 bg-slate-900/35 text-slate-200/85 backdrop-blur"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
          <div
            className={[
              "transition-all duration-1000 delay-300 transform",
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-20"
            ].join(" ")}
          >
            <SkillCard
              title="Frontend"
              subtitle="Client-side Technologies"
              accent="purple"
              iconBg="bg-gradient-to-br from-purple-500 to-pink-500 shadow-purple-500/45"
              iconSvg={<FiCode className="w-9 h-9 text-white" />}
            >
              {frontendSkills.map((skill) => (
                <SkillRow key={skill.name} skill={skill} accent="purple" />
              ))}
            </SkillCard>
          </div>

          <div
            className={[
              "transition-all duration-1000 delay-500 transform",
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-20"
            ].join(" ")}
          >
            <SkillCard
              title="Backend"
              subtitle="Server-side Technologies"
              accent="cyan"
              iconBg="bg-gradient-to-br from-cyan-400 to-sky-500 shadow-cyan-400/20"
              iconSvg={<FiServer className="w-9 h-9 text-white" />}
            >
              {backendSkills.map((skill) => (
                <SkillRow key={skill.name} skill={skill} accent="cyan" />
              ))}
            </SkillCard>
          </div>
        </div>

        <div
          className={[
            "grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6 mt-14 sm:mt-20 transition-all duration-1000 delay-700 transform",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
          ].join(" ")}
        >
          {Stats.map((stat) => (
            <div
              key={stat.label}
              className={[
                "relative bg-slate-900/45 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-7 sm:p-8 text-center",
                "transition-all duration-300 shadow-2xl shadow-black/25 group overflow-hidden",
                enableHeavyMotion ? "transform hover:scale-[1.03] hover:-translate-y-1 hover:shadow-cyan-400/10" : "",
                "hover:border-cyan-400/30"
              ].join(" ")}
            >
              <div
                className={[
                  `absolute inset-0 bg-gradient-to-br ${stat.gradient} transition-opacity duration-500`,
                  enableHeavyMotion ? "opacity-0 group-hover:opacity-10" : "opacity-0"
                ].join(" ")}
              />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              <div className="relative">
                <div
                  className={[
                    "w-14 h-14 mx-auto rounded-2xl mb-4 flex items-center justify-center",
                    "bg-slate-900/35 border border-slate-700/45",
                    enableHeavyMotion ? "transform group-hover:scale-110 transition-transform duration-500" : ""
                  ].join(" ")}
                >
                  <stat.Icon className="w-7 h-7 text-slate-100" />
                </div>

                <h4
                  className={`text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${stat.gradient} mb-2 sm:mb-3`}
                >
                  {stat.value}
                </h4>

                <p className="text-slate-200/70 text-sm sm:text-base font-semibold">{stat.label}</p>
              </div>

              <div
                className={[
                  "absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-cyan-400/10 to-transparent rounded-bl-full transition-opacity duration-500",
                  enableHeavyMotion ? "opacity-0 group-hover:opacity-100" : "opacity-0"
                ].join(" ")}
              />
            </div>
          ))}
        </div>

        {/* Testimonials (replaces the CTA block) */}
        <div
          className={[
            "mt-14 sm:mt-20 bg-slate-900/45 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 sm:p-10",
            "transition-all duration-1000 delay-900 transform overflow-hidden",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
          ].join(" ")}
        >
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
                  enableHeavyMotion ? "hover:scale-105 transition-transform duration-200 hover:border-cyan-400/35" : "hover:border-cyan-400/35"
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
                  enableHeavyMotion ? "hover:scale-105 transition-transform duration-200 hover:border-cyan-400/35" : "hover:border-cyan-400/35"
                ].join(" ")}
                aria-label="Next testimonial"
              >
                <FiChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden border border-slate-700/55">
            {/* purple tinted card background, like your screenshot, but keeping your theme */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 via-purple-500/20 to-slate-900/10" />
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.10),transparent_55%)]" />

            <div className="relative p-7 sm:p-10">
              <div className="flex items-start gap-4 sm:gap-5">
                {/* Avatar */}
                <div className="shrink-0">
                  {current?.avatar ? (
                    <img
                      src={current.avatar}
                      alt={current.name}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border border-white/20"
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

                  <p className="text-white/90 text-sm sm:text-base leading-relaxed mt-5">
                    {displayedQuote}
                  </p>

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
                        enableHeavyMotion ? "hover:scale-105 transition-transform duration-200 hover:shadow-2xl hover:shadow-cyan-400/20" : ""
                      ].join(" ")}
                    >
                      <span style={{ color: "black" }}>Get In Touch</span>
                      <FiArrowRight className={`w-5 h-5 ${enableHeavyMotion ? "group-hover:translate-x-1 transition-transform duration-300" : ""}`} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* small helper note to keep spacing similar to your old CTA */}
          <div className="mt-6 text-xs sm:text-sm text-slate-200/55 text-center">
            You can add more testimonials by updating the testimonials array.
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

        @keyframes pulse-fast {
          0%,
          100% {
            opacity: 0.8;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.3);
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

        .animate-gradient {
          animation: gradient 4s ease infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4.5s ease-in-out infinite;
        }

        .animate-pulse-fast {
          animation: pulse-fast 1.5s ease-in-out infinite;
        }

        .animate-shimmer {
          animation: shimmer 2.6s infinite;
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
          .animate-gradient,
          .animate-pulse-slow,
          .animate-pulse-fast,
          .animate-shimmer {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Skills;
