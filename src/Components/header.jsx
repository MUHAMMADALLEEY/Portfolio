import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const rafRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = useMemo(
    () => [
      { name: "Home", to: "/" },
      { name: "About", to: "/about" },
      { name: "Projects", to: "/portfolio" },
      { name: "Resume", to: "/resume" },
      { name: "Skills", to: "/skills" },
      { name: "Certification", to: "/certificate" }
    ],
    []
  );

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 40);
        rafRef.current = null;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const getActivePath = () => {
    const path = location.pathname;
    if (path.startsWith("/projects/")) return "/portfolio";
    return path;
  };

  const activePath = getActivePath();

  const handleNavClick = (to) => {
    setIsMobileMenuOpen(false);
    navigate(to);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        {/* Glow line */}
        <div
          className={`pointer-events-none absolute inset-x-0 top-0 h-px transition-opacity duration-500 ${
            isScrolled ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-400/55 to-transparent" />
        </div>

        {/* Header background */}
        <div
          className={[
            "transition-all duration-500",
            isScrolled
              ? "bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/50 shadow-2xl shadow-cyan-400/10"
              : "bg-transparent"
          ].join(" ")}
        >
          <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-20">
            <div className="flex items-center justify-between h-24">
              {/* Logo */}
              <button
                type="button"
                onClick={() => handleNavClick("/")}
                className="relative group flex items-center gap-4"
                aria-label="Go to Home"
              >
                <div className="relative">
                  <span className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 animate-gradient inline-block">
                    M ALI
                  </span>
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-300 to-sky-400 group-hover:w-full transition-all duration-300" />
                </div>

                <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-700/60 bg-slate-900/30 text-slate-200/80 text-sm font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Available
                </span>
              </button>

              {/* Desktop nav */}
              <nav className="hidden lg:flex items-center gap-2">
                {navItems.map((item) => {
                  const isActive = activePath === item.to;

                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => handleNavClick(item.to)}
                      className={[
                        "relative px-6 py-3.5 text-xl font-semibold rounded-xl transition-all duration-300",
                        isActive
                          ? "text-white"
                          : "text-slate-300 hover:text-cyan-300"
                      ].join(" ")}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <span className="relative z-10">{item.name}</span>
                      {isActive && (
                        <span className="absolute inset-0 rounded-xl bg-slate-800/40" />
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Desktop CTA */}
              <div className="hidden lg:flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => handleNavClick("/")}
                  className="group relative inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl text-xl font-extrabold transition-all duration-300 hover:scale-[1.04] hover:shadow-xl hover:shadow-cyan-400/30 overflow-hidden"
                >
                  <span className="backdrop-blur-xl border-b border-slate-800/50 shadow-2xl shadow-cyan-400/10 text-white text-2xl">
                    Hire Me
                  </span>
                  <svg
                    className="w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-300"
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
                </button>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen((v) => !v)}
                className="lg:hidden w-12 h-12 flex items-center justify-center rounded-xl bg-slate-900/35 border border-slate-700/60 hover:border-cyan-400/40 transition-all duration-300"
                aria-label="Open menu"
                aria-expanded={isMobileMenuOpen}
                type="button"
              >
                <div className="flex flex-col gap-1.5">
                  <span
                    className={`block w-6 h-0.5 bg-cyan-300 transition-all duration-300 ${
                      isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
                    }`}
                  />
                  <span
                    className={`block w-6 h-0.5 bg-cyan-300 transition-all duration-300 ${
                      isMobileMenuOpen ? "opacity-0" : ""
                    }`}
                  />
                  <span
                    className={`block w-6 h-0.5 bg-cyan-300 transition-all duration-300 ${
                      isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile panel */}
        <div
          className={[
            "lg:hidden overflow-hidden transition-all duration-500",
            isMobileMenuOpen ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0"
          ].join(" ")}
        >
          <div className="bg-slate-950/96 backdrop-blur-xl border-b border-slate-800/60">
            <div className="max-w-[1400px] mx-auto px-6 sm:px-8">
              <nav className="py-6 space-y-2">
                {navItems.map((item, index) => {
                  const isActive = activePath === item.to;

                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => handleNavClick(item.to)}
                      className={[
                        "block w-full text-left px-6 py-4 rounded-2xl text-xl font-semibold transition-all duration-300 animate-slideInRight",
                        isActive
                          ? "bg-cyan-400 text-slate-900 shadow-lg shadow-cyan-400/20"
                          : "bg-slate-900/30 border border-slate-800/40 text-slate-200 hover:bg-slate-900/45 hover:border-cyan-400/30 hover:text-cyan-300"
                      ].join(" ")}
                      style={{ animationDelay: `${index * 45}ms` }}
                    >
                      {item.name}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => handleNavClick("/")}
                  className="flex w-full items-center justify-center gap-2 px-6 py-4 mt-4 rounded-2xl text-xl font-extrabold text-slate-900 bg-cyan-400 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-cyan-400/25"
                >
                  Hire Me
                </button>

                <div className="pt-4 text-center text-slate-200/60 text-base">
                  React, Node.js, Clean UI, Fast Delivery
                </div>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <style jsx>{`
        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(-18px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 4s ease infinite;
        }

        .animate-slideInRight {
          animation: slideInRight 0.35s ease-out both;
        }
      `}</style>
    </>
  );
};

export default Header;
