import React, { useEffect, useMemo, useState } from "react";
import emailjs from "emailjs-com";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    subject: "",
    message: ""
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [smoothMouse, setSmoothMouse] = useState({ x: 0, y: 0 });
  const [magnet, setMagnet] = useState({ x: 0, y: 0 });

  // UPDATED: stable orbs, cyan theme
  const orbs = useMemo(
    () =>
      [...Array(16)].map((_, i) => ({
        id: i,
        size: Math.random() * 420 + 180,
        left: Math.random() * 100,
        top: Math.random() * 100,
        color: ["#22d3ee", "#38bdf8", "#3b82f6", "#e2e8f0"][i % 4],
        delay: i * 0.55,
        duration: Math.random() * 18 + 26,
        blur: Math.random() * 35 + 75,
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
        opacity: Math.random() * 0.32 + 0.1,
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
        delay: Math.random() * 6 + i * 1.15,
        duration: Math.random() * 1.6 + 1.4,
        length: Math.random() * 220 + 180,
        opacity: Math.random() * 0.28 + 0.2
      })),
    []
  );

  const floatEmojis = useMemo(() => {
    const list = ["📩", "✨", "🚀", "💻", "🔥", "🧠", "⭐", "🎯", "🛠️", "🎨", "💡", "🤝", "📅"];
    return [...Array(20)].map((_, i) => ({
      id: i,
      emoji: list[i % list.length],
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 18 + 14,
      rotate: Math.random() * 70 - 35,
      delay: Math.random() * 5,
      duration: Math.random() * 18 + 18,
      opacity: Math.random() * 0.16 + 0.06
    }));
  }, []);

  const confetti = useMemo(() => {
    const colors = ["#a855f7", "#ec4899", "#22d3ee", "#60a5fa", "#34d399"];
    return [...Array(28)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 8 + 6,
      delay: Math.random() * 0.25,
      duration: Math.random() * 1.1 + 1.1,
      color: colors[i % colors.length]
    }));
  }, []);

  useEffect(() => {
    setIsVisible(true);

    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 14;
      const y = (e.clientY / window.innerHeight - 0.5) * 14;
      setMouse({ x, y });
    };

    window.addEventListener("mousemove", onMove, { passive: true });

    if (process.env.REACT_APP_EMAILJS_USER_ID) {
      emailjs.init(process.env.REACT_APP_EMAILJS_USER_ID);
    }

    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      setSmoothMouse((prev) => {
        const dx = mouse.x - prev.x;
        const dy = mouse.y - prev.y;
        return { x: prev.x + dx * 0.07, y: prev.y + dy * 0.07 };
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [mouse]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const validate = () => {
    if (!formData.name.trim()) return "Please enter your name.";
    if (!formData.email.trim()) return "Please enter your email.";
    if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) return "Please enter a valid email.";
    if (!formData.subject.trim()) return "Please enter a subject.";
    if (!formData.message.trim()) return "Please write your message.";
    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const err = validate();
    if (err) {
      setErrorMessage(err);
      setTimeout(() => setErrorMessage(""), 4500);
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    const templateParams = {
      name: formData.name,
      email: formData.email,
      mobile: formData.mobile,
      subject: formData.subject,
      message: formData.message
    };

    emailjs
      .send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        templateParams,
        process.env.REACT_APP_EMAILJS_USER_ID
      )
      .then(
        () => {
          setIsSubmitted(true);
          setIsLoading(false);
          setFormData({ name: "", email: "", mobile: "", subject: "", message: "" });
          setTimeout(() => setIsSubmitted(false), 4500);
        },
        () => {
          setErrorMessage("Failed to send the message. Please try again later.");
          setIsLoading(false);
          setTimeout(() => setErrorMessage(""), 5000);
        }
      );
  };

  const handleMagnetMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) * 0.18;
    const y = (e.clientY - (rect.top + rect.height / 2)) * 0.18;
    setMagnet({ x, y });
  };

  const resetMagnet = () => setMagnet({ x: 0, y: 0 });

  const contactInfo = useMemo(
    () => [
      {
        label: "Email",
        value: "muhammadali43800@gmail.com",
        hint: "Best for detailed requests",
        color: "from-purple-500 to-pink-500",
        emoji: "📧",
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        )
      },
      {
        label: "Phone",
        value: "+92 3137149438",
        hint: "Fast response on call or WhatsApp",
        color: "from-cyan-500 to-blue-500",
        emoji: "📱",
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
        )
      },
      {
        label: "Location",
        value: "Faisalabad, Pakistan",
        hint: "Timezone: PKT",
        color: "from-green-500 to-emerald-500",
        emoji: "📍",
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )
      }
    ],
    []
  );

  return (
    <section
      className="relative w-full min-h-screen flex items-center justify-center px-6 sm:px-8 lg:px-20 py-20 overflow-hidden"
      id="contact"
    >
      {/* UPDATED: black background like the others */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#05060c] via-[#070b18] to-[#03050b]" />

      {/* Animated blob mesh */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.58]"
        style={{
          transform: `translate3d(${smoothMouse.x * 1.0}px, ${smoothMouse.y * 1.0}px, 0)`,
          transition: "transform 0.12s ease-out"
        }}
      >
        <div className="absolute -top-52 -left-52 w-[940px] h-[940px] rounded-full bg-purple-500/10 blur-3xl animate-blobA" />
        <div className="absolute top-10 -right-56 w-[980px] h-[980px] rounded-full bg-pink-500/10 blur-3xl animate-blobB" />
        <div className="absolute -bottom-56 left-1/3 w-[980px] h-[980px] rounded-full bg-cyan-500/10 blur-3xl animate-blobC" />
      </div>

      {/* Soft aurora */}
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
                "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.55) 35%, rgba(34,211,238,0.45) 70%, rgba(255,255,255,0) 100%)",
              filter: "drop-shadow(0 0 10px rgba(34,211,238,0.18))"
            }}
          />
        ))}
      </div>

      {/* Floating emojis */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatEmojis.map((e) => (
          <div
            key={e.id}
            className="absolute animate-emojiFloat select-none"
            style={{
              left: `${e.left}%`,
              top: `${e.top}%`,
              fontSize: `${e.size}px`,
              opacity: e.opacity,
              filter: "drop-shadow(0 0 14px rgba(34,211,238,0.14))",
              ["--r"]: `${e.rotate}deg`,
              animationDelay: `${e.delay}s`,
              animationDuration: `${e.duration}s`
            }}
          >
            {e.emoji}
          </div>
        ))}
      </div>

      {/* UPDATED: cyan grid, parallax */}
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

      <div className="relative z-10 w-full max-w-[1300px]">
        {/* Header */}
        <div
          className={`text-center mb-14 sm:mb-16 transition-all duration-1000 transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
          }`}
        >
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight inline-block text-white">
            Contact{" "}
            <span
              className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 animate-gradient"
              style={{ backgroundSize: "220% 220%" }}
            >
              Me
            </span>{" "}
            <span className="inline-block animate-bounceSoft">📩</span>
          </h2>

          <div className="h-1 w-44 bg-gradient-to-r from-cyan-400 via-sky-500 to-transparent mx-auto mt-6 rounded-full animate-pulse-slow" />
          <div className="mt-3 w-56 h-[1px] mx-auto opacity-60 bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent animate-pulseLine" />

          <p className="text-slate-200/80 text-base sm:text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
            Tell me about your project. I’ll reply with a clear plan, timeline, and next steps. ✨
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left side */}
          <div
            className={`lg:col-span-5 transition-all duration-1000 delay-200 transform ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-20"
            }`}
          >
            <div className="bg-slate-900/45 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-7 sm:p-8 shadow-2xl shadow-black/25 overflow-hidden relative">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/8 animate-borderGlow" />

              <h3 className="text-3xl font-extrabold text-white">
                Let’s talk <span className="inline-block animate-miniWiggle">🤝</span>
              </h3>
              <p className="text-slate-200/75 mt-2 leading-relaxed">
                Share your goal, features, and deadline. If you have a reference website, send it too.
              </p>

              <div className="mt-7 grid grid-cols-1 gap-4">
                {contactInfo.map((info, index) => (
                  <div
                    key={info.label}
                    className="group relative bg-slate-900/35 border border-slate-700/55 rounded-2xl p-6 overflow-hidden transition-all duration-400 hover:border-cyan-400/30 hover:shadow-xl hover:shadow-cyan-400/10"
                    style={{ animationDelay: `${index * 0.08}s` }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${info.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      <div className="absolute -inset-y-10 -left-24 w-24 rotate-12 bg-white/10 blur-md group-hover:translate-x-[420px] transition-transform duration-700" />
                    </div>

                    <div className="relative flex items-start gap-4">
                      <div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${info.color} flex items-center justify-center shadow-lg shrink-0`}
                      >
                        <div className="text-white">{info.icon}</div>
                      </div>

                      <div className="min-w-0">
                        <div className="text-slate-300 text-sm font-semibold flex items-center gap-2">
                          <span>{info.label}</span>
                          <span className="text-slate-200/80">{info.emoji}</span>
                        </div>
                        <div className="text-white text-lg font-extrabold break-words mt-1">{info.value}</div>
                        <div className="text-slate-200/60 text-sm mt-1">{info.hint}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-gradient-to-br from-cyan-500/10 to-sky-500/10 border border-cyan-400/20 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-60 pointer-events-none animate-softSheen">
                  <div className="absolute -inset-y-10 -left-32 w-28 rotate-12 bg-white/10 blur-md" />
                </div>

                <div className="text-white font-extrabold text-lg">
                  Quick note <span className="inline-block animate-sparklePop">✨</span>
                </div>
                <div className="text-slate-200/80 mt-2 leading-relaxed">
                  I can build React frontends, Node APIs, and full-stack apps, clean UI, smooth animations, and scalable
                  code.
                </div>
              </div>
            </div>
          </div>

          {/* Right side: form */}
          <div
            className={`lg:col-span-7 transition-all duration-1000 delay-300 transform ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-20"
            }`}
          >
            <div className="bg-slate-900/45 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-7 sm:p-10 shadow-2xl shadow-black/25 overflow-hidden relative">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/8 animate-borderGlow2" />

              <div className="flex items-start justify-between gap-4 mb-8">
                <div>
                  <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
                    Send a message <span className="inline-block animate-miniWiggle">💬</span>
                  </h3>
                  <p className="text-slate-200/70 mt-2">I usually reply quickly, especially during PKT daytime. ⚡</p>
                </div>

                <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/35 border border-slate-700/55 text-slate-200 font-extrabold">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
                  <span>Available</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6" onMouseMove={handleMagnetMove} onMouseLeave={resetMagnet}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field
                    label="Your Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Muhammad Ali"
                    required
                    emoji="👤"
                  />
                  <Field
                    label="Your Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@email.com"
                    required
                    emoji="📧"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field
                    label="Mobile (optional)"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="+92 3xx xxxxxxx"
                    emoji="📱"
                  />
                  <Field
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Project inquiry"
                    required
                    emoji="📝"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-2">
                    Message <span className="text-slate-200/80">💡</span>
                  </label>

                  <div className="relative group">
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={7}
                      placeholder="Tell me what you want to build, features, deadline, and any reference links."
                      className="w-full px-6 py-4 bg-slate-900/35 border border-slate-700/55 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/10 transition-all duration-300 resize-none"
                      required
                    />

                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/8 to-sky-500/8" />
                      <div className="absolute -inset-y-10 -left-28 w-24 rotate-12 bg-white/10 blur-md group-hover:translate-x-[560px] transition-transform duration-700" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-start gap-4">
                  {/* UPDATED: primary button cyan, magnet preserved */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative inline-flex items-center justify-center gap-3 px-10 py-4 bg-cyan-400 text-black rounded-2xl font-extrabold text-base sm:text-lg overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:shadow-cyan-400/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      transform: `translate3d(${magnet.x}px, ${magnet.y}px, 0)`,
                      transition: "transform 0.18s ease-out"
                    }}
                  >
                    <span className="absolute inset-0 bg-white/18 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.18),transparent_55%)]" />
                    </span>

                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        <span className="relative">Sending...</span>
                      </>
                    ) : (
                      <>
                        <span className="relative flex items-center gap-2">
                          Send Message <span className="inline-block animate-miniWiggle">🚀</span>
                        </span>
                        <svg
                          className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </button>

                  {isSubmitted && (
                    <div className="relative w-full">
                      <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        {confetti.map((c) => (
                          <span
                            key={c.id}
                            className="absolute top-0 animate-confetti"
                            style={{
                              left: `${c.left}%`,
                              width: `${c.size}px`,
                              height: `${c.size}px`,
                              backgroundColor: c.color,
                              borderRadius: "2px",
                              animationDelay: `${c.delay}s`,
                              animationDuration: `${c.duration}s`,
                              transform: `translate3d(0,0,0) rotate(${Math.random() * 180}deg)`
                            }}
                          />
                        ))}
                      </div>

                      <div className="flex items-center gap-2 px-6 py-3 bg-green-500/10 border border-green-500/40 rounded-2xl text-green-300 animate-fadeInUp">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Message sent successfully! 🎉</span>
                      </div>
                    </div>
                  )}

                  {errorMessage && (
                    <div className="flex items-center gap-2 px-6 py-3 bg-red-500/10 border border-red-500/40 rounded-2xl text-red-300 animate-fadeInUp">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="text-xs sm:text-sm text-slate-200/60">Tip, add your budget and deadline for a faster, more accurate reply. 📅</div>
                </div>
              </form>

              <div className="pointer-events-none absolute -bottom-24 left-1/2 -translate-x-1/2 w-[520px] h-[220px] rounded-full bg-cyan-400/10 blur-3xl animate-pulse-slow" />
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

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(18px);
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
            opacity: 0.55;
            transform: scale(1);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.06);
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

        @keyframes miniWiggle {
          0%,
          100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(10deg);
          }
        }

        @keyframes bounceSoft {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        @keyframes borderGlow {
          0%,
          100% {
            box-shadow: 0 0 0 rgba(34, 211, 238, 0);
          }
          50% {
            box-shadow: 0 0 48px rgba(34, 211, 238, 0.12);
          }
        }

        @keyframes borderGlow2 {
          0%,
          100% {
            box-shadow: 0 0 0 rgba(34, 211, 238, 0);
          }
          50% {
            box-shadow: 0 0 56px rgba(34, 211, 238, 0.12);
          }
        }

        @keyframes softSheen {
          0% {
            transform: translateX(-120%);
            opacity: 0.25;
          }
          50% {
            opacity: 0.35;
          }
          100% {
            transform: translateX(140%);
            opacity: 0.25;
          }
        }

        @keyframes confetti {
          0% {
            transform: translate3d(0, 0, 0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translate3d(0, 120px, 0) rotate(220deg);
            opacity: 0;
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

        .animate-fadeInUp {
          animation: fadeInUp 0.55s ease-out both;
        }

        .animate-gradient {
          animation: gradient 4.5s ease infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4.5s ease-in-out infinite;
        }

        .animate-pulseLine {
          animation: pulseLine 2.8s ease-in-out infinite;
        }

        .animate-scan {
          animation: scan 9s ease-in-out infinite;
        }

        .animate-sparkle-drift {
          animation: sparkle-drift ease-in-out infinite;
          will-change: transform, opacity;
        }

        .animate-emojiFloat {
          animation: emojiFloat ease-in-out infinite;
          will-change: transform;
        }

        .animate-shoot {
          animation: shoot linear infinite;
        }

        .animate-miniWiggle {
          animation: miniWiggle 1.5s ease-in-out infinite;
        }

        .animate-bounceSoft {
          animation: bounceSoft 1.9s ease-in-out infinite;
        }

        .animate-borderGlow {
          animation: borderGlow 4.6s ease-in-out infinite;
        }

        .animate-borderGlow2 {
          animation: borderGlow2 4.8s ease-in-out infinite;
        }

        .animate-softSheen {
          animation: softSheen 3.2s ease-in-out infinite;
        }

        .animate-confetti {
          animation: confetti ease-out forwards;
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

const Field = ({ label, name, value, onChange, placeholder, type = "text", required = false, emoji }) => {
  return (
    <div>
      <label className="block text-slate-300 font-semibold mb-2">
        {label} <span className="text-slate-200/80">{emoji}</span> {required ? <span className="text-sky-300">*</span> : null}
      </label>

      <div className="relative group">
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full px-6 py-4 bg-slate-900/35 border border-slate-700/55 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/10 transition-all duration-300"
        />

        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/7 to-sky-500/7" />
          <div className="absolute -inset-y-10 -left-28 w-24 rotate-12 bg-white/10 blur-md group-hover:translate-x-[520px] transition-transform duration-700" />
        </div>
      </div>
    </div>
  );
};

export default Contact;
