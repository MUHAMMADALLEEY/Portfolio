import React, { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Snowfall from "react-snowfall";
import { FiArrowLeft, FiExternalLink, FiGithub, FiX } from "react-icons/fi";
import { projects } from "../data/projects";

const ProjectDetails = () => {
  const { slug } = useParams();
  const [lightbox, setLightbox] = useState(null);

  const project = useMemo(
    () => projects.find((p) => p.slug === slug),
    [slug]
  );

  if (!project) {
    return (
      <main className="min-h-screen pt-20 bg-[#05060c] text-white flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold mb-4">Project not found</h1>
          <Link
            to="/#portfolio"
            className="inline-flex items-center px-6 py-3 bg-cyan-400 text-black font-extrabold rounded-xl"
          >
            Back to Portfolio
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen pt-20 overflow-hidden bg-gradient-to-br from-[#05060c] via-[#070b18] to-[#03050b] text-slate-200">
      {/* Snowfall */}
      <div className="absolute inset-0 z-[5] pointer-events-none">
        <Snowfall color="#82C3D9" snowflakeCount={120} />
      </div>

      {/* Page content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-20">
        {/* Top navigation bar */}
        <div className="flex items-center justify-between mb-10">
          <Link
            to="/#portfolio"
            className="inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200 font-semibold"
          >
            <FiArrowLeft /> Back to Portfolio
          </Link>

          <div className="flex gap-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-400 text-black font-extrabold rounded-xl"
              >
                Live <FiExternalLink />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900/40 border border-slate-700/60 rounded-xl font-extrabold"
              >
                Code <FiGithub />
              </a>
            )}
          </div>
        </div>

        {/* Hero card */}
        <div className="rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 p-8 sm:p-10 shadow-2xl mb-14">
          <span className="inline-block mb-4 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-200 font-bold text-sm">
            Case Study
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-5">
            {project.title}
          </h1>

          <p className="text-slate-300 text-lg sm:text-xl max-w-4xl leading-relaxed">
            {project.longDescription}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 rounded-full bg-slate-950/40 border border-slate-700/60 text-sm font-bold"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Gallery */}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-8">
          Gallery
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {project.images.map((src, idx) => (
            <button
              key={idx}
              onClick={() => setLightbox({ src, idx })}
              className="relative group rounded-2xl overflow-hidden border border-slate-700/50 bg-slate-950/30 hover:border-cyan-400/50 transition"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={src}
                  alt={`${project.title} screenshot ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur flex items-center justify-center p-6"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-w-5xl w-full rounded-2xl overflow-hidden bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-xl bg-black/60 text-white"
            >
              <FiX />
            </button>

            <img
              src={lightbox.src}
              alt="Preview"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      )}
    </main>
  );
};

export default ProjectDetails;
