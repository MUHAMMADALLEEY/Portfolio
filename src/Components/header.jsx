import React, { useEffect, useMemo, useRef, useState } from "react";

const Header = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const rafRef = useRef(null);

  const navItems = useMemo(
    () => [
      { name: "Home", href: "#home" },
      { name: "About", href: "#about" },
      { name: "Portfolio", href: "#portfolio" },
      { name: "Resume", href: "#resume" },
      { name: "Skills", href: "#skills" },
      { name: "Contact", href: "#contact" }
    ],
    []
  );

  useEffect(() => {
    const getSections = () =>
      Array.from(document.querySelectorAll("section[id]")).filter((s) => s.id);

    let sections = getSections();

    const onResize = () => {
      sections = getSections();
    };

    const updateActiveSection = () => {
      const y = window.scrollY;
      setIsScrolled(y > 40);

      const offset = 140;
      const pos = y + offset;

      let current = sections[0]?.id || "home";

      for (const section of sections) {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (pos >= top && pos < top + height) {
          current = section.id;
          break;
        }
      }

      setActiveSection(current);
    };

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        updateActiveSection();
        rafRef.current = null;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    updateActiveSection();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleNavClick = (href) => {
    setIsMobileMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        {/* Top glow line */}
        <div
          className={`pointer-events-none absolute inset-x-0 top-0 h-px transition-opacity duration-500 ${
            isScrolled ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-400/55 to-transparent" />
        </div>

        {/* Header bg */}
        <div
          className={[
            "transition-all duration-500",
            isScrolled
              ? "bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/50 shadow-2xl shadow-cyan-400/10"
              : "bg-transparent"
          ].join(" ")}
        >
          <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-20">
            <div className="flex items-center justify-between h-20">
              {/* Logo */}
              <a
                href="#home"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick("#home");
                }}
                className="relative group flex items-center gap-3"
                aria-label="Go to Home"
              >
                <div className="relative">
                  <span className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 animate-gradient inline-block">
                    M ALI
                  </span>
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-300 to-sky-400 group-hover:w-full transition-all duration-300" />
                </div>

                <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-700/60 bg-slate-900/30 text-slate-200/80 text-sm font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Available
                </span>
              </a>

              {/* Desktop nav */}
              <nav className="hidden lg:flex items-center gap-1">
                {navItems.map((item) => {
                  const isActive = activeSection === item.href.slice(1);

                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(item.href);
                      }}
                     className={[
  "relative px-5 py-3 text-lg font-semibold rounded-xl transition-all duration-300",
  isActive
    ? "text-black"
    : "text-slate-300 hover:text-cyan-300"
].join(" ")}

                      aria-current={isActive ? "page" : undefined}
                    >
                      <span className="relative z-10">{item.name}</span>

                      {!isActive && (
                        <span className="absolute inset-0 rounded-xl bg-slate-800/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      )}

                      {isActive && (
                       <span className="absolute inset-0 rounded-xl bg-slate-800/40" />

                      )}

                      {!isActive && (
                        <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-cyan-300 to-sky-400 group-hover:w-2/3 transition-all duration-300" />
                      )}
                    </a>
                  );
                })}
              </nav>

              {/* Desktop CTA */}
              <div className="hidden lg:flex items-center gap-3">
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick("#contact");
                  }}
                  className="group relative inline-flex items-center justify-center gap-2 px-9 py-3.5 rounded-xl text-lg font-extrabold transition-all duration-300 hover:scale-[1.04] hover:shadow-xl hover:shadow-cyan-400/30 overflow-hidden"
                >
                  <span className="absolute inset-0  -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <span className="backdrop-blur-xl border-b border-slate-800/50 shadow-2xl shadow-cyan-400/10 text-xl">Hire Me</span>
                  <svg
                    className="relative w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
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

                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick("#contact");
                  }}
                  className="inline-flex items-center justify-center w-12 h-12 rounded-xl border border-slate-700/60 bg-slate-900/30 text-slate-200 hover:border-cyan-400/40 hover:bg-slate-900/45 transition-all duration-300"
                  aria-label="Quick contact"
                  title="Quick contact"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h8m-8 4h6m2 4H6a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v8l-4 4z"
                    />
                  </svg>
                </a>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen((v) => !v)}
                className="lg:hidden relative w-11 h-11 flex items-center justify-center rounded-xl bg-slate-900/35 border border-slate-700/60 hover:border-cyan-400/40 transition-all duration-300"
                aria-label="Open menu"
                aria-expanded={isMobileMenuOpen}
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
            isMobileMenuOpen ? "max-h-[480px] opacity-100" : "max-h-0 opacity-0"
          ].join(" ")}
        >
          <div className="bg-slate-950/96 backdrop-blur-xl border-b border-slate-800/60">
            <div className="max-w-[1400px] mx-auto px-6 sm:px-8">
              <nav className="py-6 space-y-2">
                {navItems.map((item, index) => {
                  const isActive = activeSection === item.href.slice(1);

                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(item.href);
                      }}
                      className={[
                        "block px-6 py-3.5 rounded-2xl text-lg font-semibold transition-all duration-300 animate-slideInRight",
                        isActive
                          ? "bg-cyan-400 text-slate-900 shadow-lg shadow-cyan-400/20"
                          : "bg-slate-900/30 border border-slate-800/40 text-slate-200 hover:bg-slate-900/45 hover:border-cyan-400/30 hover:text-cyan-300"
                      ].join(" ")}
                      style={{ animationDelay: `${index * 45}ms` }}
                    >
                      {item.name}
                    </a>
                  );
                })}

                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick("#contact");
                  }}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 mt-4 rounded-2xl text-lg font-extrabold text-slate-900 bg-cyan-400 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-cyan-400/25"
                >
                  <span>Hire Me</span>
                  <svg
                    className="w-5 h-5"
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

        @keyframes popIn {
          from {
            opacity: 0;
            transform: scale(0.96);
          }
          to {
            opacity: 1;
            transform: scale(1);
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

        .animate-popIn {
          animation: popIn 0.25s ease-out;
        }

        .animate-slideInRight {
          animation: slideInRight 0.35s ease-out both;
        }
      `}</style>
    </>
  );
};

export default Header;
