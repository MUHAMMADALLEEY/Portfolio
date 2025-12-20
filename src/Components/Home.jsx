import React, { useEffect, useMemo, useRef, useState } from "react";

const Home = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [smoothMouse, setSmoothMouse] = useState({ x: 0, y: 0 });
  const [lastMoveAt, setLastMoveAt] = useState(Date.now());
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 14;
      const y = (e.clientY / window.innerHeight - 0.5) * 14;
      setMousePosition({ x, y });
      setLastMoveAt(Date.now());
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      setSmoothMouse((prev) => {
        const dx = mousePosition.x - prev.x;
        const dy = mousePosition.y - prev.y;
        return { x: prev.x + dx * 0.07, y: prev.y + dy * 0.07 };
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [mousePosition]);

  const isIdle = Date.now() - lastMoveAt > 900;

  // background orbs
  const orbs = useMemo(
    () =>
      [...Array(14)].map((_, i) => ({
        id: i,
        size: Math.random() * 460 + 200,
        left: Math.random() * 100,
        top: Math.random() * 100,
        color: ["#22d3ee", "#38bdf8", "#3b82f6", "#e2e8f0"][i % 4],
        delay: i * 0.55,
        duration: Math.random() * 18 + 28,
        blur: Math.random() * 34 + 70,
        opacity: Math.random() * 0.08 + 0.06
      })),
    []
  );

  const sparkles = useMemo(
    () =>
      [...Array(60)].map((_, i) => ({
        id: i,
        size: Math.random() * 2.8 + 1.2,
        left: Math.random() * 100,
        top: Math.random() * 100,
        opacity: Math.random() * 0.35 + 0.1,
        delay: Math.random() * 5,
        duration: Math.random() * 12 + 10
      })),
    []
  );

  const shootingStars = useMemo(
    () =>
      [...Array(7)].map((_, i) => ({
        id: i,
        top: Math.random() * 65,
        delay: Math.random() * 6 + i * 1.2,
        duration: Math.random() * 1.6 + 1.4,
        length: Math.random() * 220 + 180,
        opacity: Math.random() * 0.28 + 0.2
      })),
    []
  );

  const emojis = useMemo(() => {
    const list = ["⚡", "✨", "🚀", "💻", "🔥", "🧠", "⭐", "🎯", "🛠️", "🎨", "📦", "🌙", "💡"];
    return [...Array(22)].map((_, i) => ({
      id: i,
      emoji: list[i % list.length],
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 22 + 16,
      rotate: Math.random() * 70 - 35,
      delay: Math.random() * 5,
      duration: Math.random() * 18 + 18,
      opacity: Math.random() * 0.16 + 0.06
    }));
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen flex items-start justify-center px-6 sm:px-8 lg:px-20 overflow-hidden"
      id="home"
      style={{
        paddingTop: "140px",
        paddingBottom: "90px"
      }}
    >
      {/* Base background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#05060c] via-[#070b18] to-[#03050b]" />

      {/* Animated gradient mesh */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.55]">
        <div className="absolute -top-52 -left-52 w-[900px] h-[900px] rounded-full bg-cyan-500/10 blur-3xl animate-blobA" />
        <div className="absolute top-16 -right-56 w-[980px] h-[980px] rounded-full bg-sky-500/10 blur-3xl animate-blobB" />
        <div className="absolute -bottom-56 left-1/3 w-[980px] h-[980px] rounded-full bg-blue-500/10 blur-3xl animate-blobC" />
      </div>

      {/* Aurora parallax */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: `translate3d(${smoothMouse.x * 1.2}px, ${smoothMouse.y * 1.2}px, 0)`,
          transition: "transform 0.12s ease-out"
        }}
      >
        <div className="absolute -top-40 -left-40 w-[900px] h-[900px] rounded-full bg-cyan-500/10 blur-3xl animate-aurora-slow" />
        <div className="absolute top-10 -right-40 w-[860px] h-[860px] rounded-full bg-sky-500/10 blur-3xl animate-aurora-slow delay-700" />
        <div className="absolute -bottom-40 left-1/3 w-[900px] h-[900px] rounded-full bg-blue-500/10 blur-3xl animate-aurora-slow delay-300" />
      </div>

      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
              filter: `blur(${o.blur}px)`
            }}
          />
        ))}
      </div>

      {/* Sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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

      {/* Shooting stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
              filter: "drop-shadow(0 0 10px rgba(34, 211, 238, 0.18))"
            }}
          />
        ))}
      </div>

      {/* Floating emojis */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {emojis.map((e) => (
          <div
            key={e.id}
            className="absolute animate-emojiFloat select-none"
            style={{
              left: `${e.left}%`,
              top: `${e.top}%`,
              fontSize: `${e.size}px`,
              opacity: e.opacity,
              filter: "drop-shadow(0 0 14px rgba(34, 211, 238, 0.14))",
              ["--r"]: `${e.rotate}deg`,
              animationDelay: `${e.delay}s`,
              animationDuration: `${e.duration}s`
            }}
          >
            {e.emoji}
          </div>
        ))}
      </div>

      {/* Grid overlay parallax */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34, 211, 238, 0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.18) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          transform: `translate3d(${smoothMouse.x * 0.6}px, ${smoothMouse.y * 0.6}px, 0)`,
          transition: "transform 0.12s ease-out"
        }}
      />

      {/* Scanline shimmer */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.10] mix-blend-overlay animate-scan">
        <div className="h-full w-full bg-[linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_2px)] bg-[length:100%_6px]" />
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.55)_70%,rgba(0,0,0,0.85)_100%)]" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1300px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left */}
          <div className="lg:col-span-7 space-y-8 animate-slideInLeft">
            <div className="space-y-6">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[0.95] tracking-tight">
                <span className="text-white block animate-fadeInUp">
                  Hi, I'm <span className="inline-block animate-waveHand">👋</span>
                </span>

                <span
                  className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 block animate-fadeInUp animate-gradient animate-softGlow"
                  style={{
                    animationDelay: "0.2s",
                    backgroundSize: "220% 220%"
                  }}
                >
                  Muhammad Ali
                </span>
              </h1>

              <div className="relative w-full">
                <h3
                  className="text-3xl sm:text-4xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 animate-fadeInUp animate-shimmerText"
                  style={{
                    animationDelay: "0.4s",
                    WebkitTextStroke: "0.5px rgba(34, 211, 238, 0.22)"
                  }}
                >
                  FullStack Developer
                </h3>

                <div className="mt-5 h-[3px] w-full max-w-xl rounded-full bg-slate-800/60 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-400 via-sky-400 to-transparent animate-expandWidth-smooth" />
                </div>

                <div className="mt-3 w-full max-w-xl h-[1px] opacity-60 bg-gradient-to-r from-transparent via-cyan-300/55 to-transparent animate-pulseLine" />
              </div>
            </div>

            {/* Chips */}
            <div
              className="flex flex-wrap gap-3 animate-fadeInUp opacity-0"
              style={{ animationDelay: "0.55s", animationFillMode: "forwards" }}
            >
              <Chip text="React ⚛️" />
              <Chip text="Node.js 🟩" />
              <Chip text="MongoDB 🍃" />
              <Chip text="Firebase 🔥" />
              <Chip text="UI Animations ✨" />
            </div>

            <p
              className="text-slate-200 text-lg sm:text-xl lg:text-2xl leading-relaxed max-w-4xl animate-fadeInUp opacity-0"
              style={{
                animationDelay: "0.7s",
                animationFillMode: "forwards"
              }}
            >
              I'm a Full Stack Developer focused on building fast, modern, and scalable web apps. Clean UI,
              smooth animations, solid backend, production ready delivery.
              <span className="ml-2 inline-block animate-sparklePop">✨</span>
            </p>

            {/* Stats */}
            <div
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl animate-fadeInUp opacity-0"
              style={{ animationDelay: "0.82s", animationFillMode: "forwards" }}
            >
              <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md px-4 py-3">
                <p className="text-white font-extrabold text-lg">3+</p>
                <p className="text-slate-300 text-sm">Years experience</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md px-4 py-3">
                <p className="text-white font-extrabold text-lg">20+</p>
                <p className="text-slate-300 text-sm">Projects delivered</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md px-4 py-3">
                <p className="text-white font-extrabold text-lg">Fast</p>
                <p className="text-slate-300 text-sm">Clean UI and API</p>
              </div>
            </div>

            {/* Extra spacing so content does not look stuck to the top area */}
            <div className="h-1" />

            {/* Buttons, hover removed */}
            <div
              className="flex flex-col sm:flex-row gap-5 animate-fadeInUp opacity-0"
              style={{
                animationDelay: "0.9s",
                animationFillMode: "forwards"
              }}
            >
              <a
                href="./My Cv/aaaa.docx"
                className="relative px-10 py-5 text-lg sm:text-xl bg-cyan-400 rounded-xl font-extrabold overflow-hidden"
                style={{ color: "#000" }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Download CV <span className="inline-block">📄</span>
                </span>
                <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-white/10" />
              </a>

              <a
                href="#contact"
                className="relative px-10 py-5 text-lg sm:text-xl bg-transparent border-2 border-cyan-400/70 rounded-xl font-extrabold text-white overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Hire me <span className="inline-block">🤝</span>
                </span>
                <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-white/10" />
              </a>
            </div>

            {/* Social */}
            <div
              className="flex gap-4 animate-fadeInUp opacity-0"
              style={{
                animationDelay: "1.05s",
                animationFillMode: "forwards"
              }}
            >
              <SocialCircle
                href="https://github.com/MUHAMMADALLEEY"
                borderHover="hover:border-cyan-400"
                bgHover="hover:bg-cyan-400/10"
                iconHover="group-hover:text-cyan-300"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </SocialCircle>

              <SocialCircle
                href="#"
                borderHover="hover:border-sky-400"
                bgHover="hover:bg-sky-400/10"
                iconHover="group-hover:text-sky-300"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </SocialCircle>

              <SocialCircle
                href="https://www.linkedin.com/in/muhammad-a-105104253/"
                borderHover="hover:border-blue-500"
                bgHover="hover:bg-blue-500/10"
                iconHover="group-hover:text-blue-300"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </SocialCircle>
            </div>
          </div>

          {/* Right image, unchanged sizing */}
          <div className="lg:col-span-5 flex justify-center animate-slideInRight">
            <div className="relative group">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 blur-3xl opacity-35 group-hover:opacity-55 transition-opacity duration-500 animate-pulse-slow" />

              <div className="absolute -inset-10 animate-spin-slow opacity-25">
                <div className="h-full w-full rounded-full border-2 border-cyan-500/35 border-t-cyan-400 border-r-sky-400" />
              </div>

              <div className="absolute -inset-5 animate-spin-reverse opacity-15">
                <div className="h-full w-full rounded-full border border-blue-500/35 border-b-blue-400" />
              </div>

              <div
                className="relative rounded-full overflow-hidden border-4 border-cyan-400/20 bg-gradient-to-br from-cyan-900/10 to-blue-900/10 backdrop-blur-sm shadow-2xl shadow-cyan-400/15 transition-all duration-500 group-hover:scale-[1.02] group-hover:border-cyan-300/35"
                style={{
                  width: "460px",
                  height: "460px",
                  transform: `perspective(1000px) rotateY(${smoothMouse.x}deg) rotateX(${-smoothMouse.y}deg) ${
                    isIdle ? "translate3d(0,-8px,0)" : ""
                  }`,
                  transition: "transform 0.26s ease-out"
                }}
              >
                <img
                  src="/images/file2.png"
                  alt="Muhammad Ali"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  style={{ objectPosition: "center 30%" }}
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/460x460/0ea5e9/ffffff?text=MA";
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-slate-100 font-semibold text-sm sm:text-base animate-badgeFloat">
                  Available for work ✨
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
            transform: translate3d(-14px, -12px, 0);
          }
          50% {
            transform: translate3d(14px, -10px, 0);
          }
          75% {
            transform: translate3d(-10px, 14px, 0);
          }
        }

        @keyframes aurora-slow {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 0.6;
          }
          50% {
            transform: translate3d(18px, -14px, 0) scale(1.035);
            opacity: 0.92;
          }
        }

        @keyframes blobA {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          33% {
            transform: translate3d(28px, -22px, 0) scale(1.05);
          }
          66% {
            transform: translate3d(-22px, 26px, 0) scale(0.98);
          }
        }

        @keyframes blobB {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1.02);
          }
          33% {
            transform: translate3d(-26px, 18px, 0) scale(1.06);
          }
          66% {
            transform: translate3d(18px, -26px, 0) scale(0.98);
          }
        }

        @keyframes blobC {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          33% {
            transform: translate3d(18px, 22px, 0) scale(1.05);
          }
          66% {
            transform: translate3d(-26px, -18px, 0) scale(0.99);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-70px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(70px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
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

        @keyframes expandWidthSmooth {
          from {
            width: 0%;
          }
          to {
            width: 100%;
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
            opacity: 0.32;
          }
          50% {
            opacity: 0.58;
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes sparkle-drift {
          0% {
            transform: translate3d(0, 0, 0);
            opacity: 0.05;
          }
          20% {
            opacity: 0.35;
          }
          50% {
            transform: translate3d(16px, -18px, 0);
            opacity: 0.18;
          }
          100% {
            transform: translate3d(-12px, 14px, 0);
            opacity: 0.06;
          }
        }

        @keyframes softGlow {
          0%,
          100% {
            filter: drop-shadow(0 0 0px rgba(34, 211, 238, 0));
          }
          50% {
            filter: drop-shadow(0 0 22px rgba(34, 211, 238, 0.2));
          }
        }

        @keyframes shimmerText {
          0% {
            background-position: 0% 50%;
            filter: drop-shadow(0 0 10px rgba(34, 211, 238, 0.05));
          }
          50% {
            background-position: 100% 50%;
            filter: drop-shadow(0 0 18px rgba(56, 189, 248, 0.12));
          }
          100% {
            background-position: 0% 50%;
            filter: drop-shadow(0 0 10px rgba(34, 211, 238, 0.05));
          }
        }

        @keyframes emojiFloat {
          0%,
          100% {
            transform: translate3d(0, 0, 0) rotate(var(--r));
          }
          25% {
            transform: translate3d(16px, -10px, 0) rotate(calc(var(--r) + 10deg));
          }
          50% {
            transform: translate3d(-10px, -20px, 0) rotate(calc(var(--r) - 8deg));
          }
          75% {
            transform: translate3d(10px, 14px, 0) rotate(calc(var(--r) + 6deg));
          }
        }

        @keyframes waveHand {
          0%,
          100% {
            transform: rotate(0deg);
          }
          15% {
            transform: rotate(14deg);
          }
          30% {
            transform: rotate(-10deg);
          }
          45% {
            transform: rotate(12deg);
          }
          60% {
            transform: rotate(-8deg);
          }
        }

        @keyframes sparklePop {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.85;
          }
          50% {
            transform: scale(1.25);
            opacity: 1;
          }
        }

        @keyframes pulseLine {
          0%,
          100% {
            opacity: 0.18;
            transform: scaleX(0.85);
          }
          50% {
            opacity: 0.6;
            transform: scaleX(1);
          }
        }

        @keyframes scan {
          0% {
            transform: translateY(-35%);
            opacity: 0.05;
          }
          50% {
            opacity: 0.12;
          }
          100% {
            transform: translateY(35%);
            opacity: 0.05;
          }
        }

        @keyframes shoot {
          0% {
            transform: translate3d(0, 0, 0) rotate(-12deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translate3d(160vw, 55vh, 0) rotate(-12deg);
            opacity: 0;
          }
        }

        @keyframes badgeFloat {
          0%,
          100% {
            transform: translate3d(-50%, 0, 0);
            opacity: 0.85;
          }
          50% {
            transform: translate3d(-50%, -10px, 0);
            opacity: 1;
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

        .animate-blobA {
          animation: blobA 16s ease-in-out infinite;
          will-change: transform;
        }
        .animate-blobB {
          animation: blobB 18s ease-in-out infinite;
          will-change: transform;
        }
        .animate-blobC {
          animation: blobC 20s ease-in-out infinite;
          will-change: transform;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.85s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-slideInRight {
          animation: slideInRight 0.85s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.9s ease-out;
        }

        .animate-expandWidth-smooth {
          animation: expandWidthSmooth 1.05s ease-out;
        }

        .animate-gradient {
          animation: gradient 5s ease infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4.5s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 22s linear infinite;
        }

        .animate-spin-reverse {
          animation: spin-reverse 16s linear infinite;
        }

        .animate-sparkle-drift {
          animation: sparkle-drift ease-in-out infinite;
          will-change: transform, opacity;
        }

        .animate-softGlow {
          animation: softGlow 4.2s ease-in-out infinite;
        }

        .animate-shimmerText {
          background-size: 240% 240%;
          animation: shimmerText 7s ease-in-out infinite;
        }

        .animate-emojiFloat {
          animation: emojiFloat ease-in-out infinite;
          will-change: transform;
        }

        .animate-waveHand {
          transform-origin: 70% 70%;
          animation: waveHand 1.7s ease-in-out infinite;
        }

        .animate-sparklePop {
          animation: sparklePop 2.2s ease-in-out infinite;
        }

        .animate-pulseLine {
          animation: pulseLine 2.8s ease-in-out infinite;
        }

        .animate-scan {
          animation: scan 9s ease-in-out infinite;
        }

        .animate-shoot {
          animation: shoot linear infinite;
        }

        .animate-badgeFloat {
          animation: badgeFloat 2.8s ease-in-out infinite;
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

const Chip = ({ text }) => {
  return (
    <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-200 font-semibold text-sm sm:text-base backdrop-blur-md hover:bg-white/10 transition-all duration-300 hover:scale-[1.03]">
      {text}
    </span>
  );
};

const SocialCircle = ({ href, children, borderHover, bgHover, iconHover }) => {
  const isExternal = href?.startsWith("http");
  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={[
        "group w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-800/40 backdrop-blur-sm border border-slate-700/70 flex items-center justify-center",
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

      <svg
        className={`w-7 h-7 sm:w-8 sm:h-8 text-slate-400 transition-colors ${iconHover}`}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        {children}
      </svg>

      <style jsx>{`
        @keyframes ringPulse {
          0% {
            transform: scale(1);
            opacity: 0.18;
          }
          100% {
            transform: scale(1.38);
            opacity: 0;
          }
        }
        @keyframes orbit {
          0% {
            transform: rotate(0deg);
            opacity: 0.2;
          }
          100% {
            transform: rotate(360deg);
            opacity: 0.2;
          }
        }
        .animate-ringPulse {
          animation: ringPulse 0.95s ease-out infinite;
        }
        .animate-orbit {
          animation: orbit 2.8s linear infinite;
        }
      `}</style>
    </a>
  );
};

export default Home;
