import React, { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { projects } from "../data/projects";

const ProjectDetails = () => {
  const { slug } = useParams();

  const project = useMemo(
    () => projects.find((p) => p.slug === slug),
    [slug]
  );

  if (!project) {
    return (
      <div className="min-h-screen bg-[#05060c] text-white flex items-center justify-center p-10">
        <div className="text-center">
          <p className="text-3xl font-bold mb-4">Project not found</p>
          <Link to="/" className="text-cyan-300 hover:text-cyan-200 underline text-lg">
            Return to Portfolio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#05060c] via-[#070b18] to-[#03050b] text-slate-200">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        {/* Back Button */}
        <Link
          to="/#portfolio"
          className="inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200 font-semibold transition-colors group mb-10"
        >
          <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
          Back to Portfolio
        </Link>

        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
            {project.title}
          </h1>
          
          <p className="text-slate-300 text-xl sm:text-2xl leading-relaxed max-w-4xl">
            {project.longDescription}
          </p>
        </div>

        {/* Tech Stack & Links */}
        <div className="mb-16 p-8 rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-slate-700/50">
          <h2 className="text-sm uppercase tracking-wider text-cyan-300 font-bold mb-4">
            Technologies Used
          </h2>
          
          <div className="flex flex-wrap gap-3 mb-8">
            {project.tech.map((t) => (
              <span
                key={t}
                className="px-4 py-2 bg-gradient-to-br from-slate-800 to-slate-900 text-slate-100 text-sm font-bold rounded-full border border-cyan-500/20 shadow-lg"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-500 text-black font-extrabold overflow-hidden transition-all hover:shadow-2xl hover:shadow-cyan-500/50 hover:scale-105"
              >
                <span className="relative z-10 text-black">View Live Project</span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-300 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </a>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-xl border-2 border-slate-600/60 bg-slate-800/50 backdrop-blur-sm text-slate-100 font-extrabold hover:border-cyan-400/60 hover:bg-slate-800/70 transition-all"
              >
                GitHub Repository
              </a>
            )}
          </div>
        </div>

        {/* Screenshots Gallery */}
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-8">
            Project Gallery
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {project.images.map((src, idx) => (
              <div
                key={`${src}-${idx}`}
                className="group relative rounded-2xl overflow-hidden border border-slate-700/50 bg-slate-950/30 hover:border-cyan-500/50 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/10"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={src}
                    alt={`${project.title} screenshot ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://via.placeholder.com/900x560/0ea5e9/000000?text=" +
                        encodeURIComponent(project.title + " " + (idx + 1));
                    }}
                  />
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Spacer */}
        <div className="h-20"></div>
      </div>
    </main>
  );
};

export default ProjectDetails;