// src/App.js
import React, { useEffect, lazy, Suspense } from "react";
import "./App.css";
import AOS from "aos";
import "aos/dist/aos.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./Components/header";

// ✅ Lazy-loaded components
const Home = lazy(() => import("./Components/Home"));
const About = lazy(() => import("./Components/About"));
const Portfolio = lazy(() => import("./Components/Portfolio"));
const Resume = lazy(() => import("./Components/Resume"));
const Skills = lazy(() => import("./Components/Skills"));
const Contact = lazy(() => import("./Components/Certificate"));
const ProjectDetails = lazy(() => import("./Components/ProjectDetails"));

const LayoutWithHeader = ({ children }) => (
  <>
    <Header />
    {children}
  </>
);

function App() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    document.title = "Muhammad Ali";
  }, []);

  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route
            path="/"
            element={
              <LayoutWithHeader>
                <Home />
              </LayoutWithHeader>
            }
          />

          <Route
            path="/about"
            element={
              <LayoutWithHeader>
                <About />
              </LayoutWithHeader>
            }
          />

          <Route
            path="/resume"
            element={
              <LayoutWithHeader>
                <Resume />
              </LayoutWithHeader>
            }
          />

          <Route
            path="/portfolio"
            element={
              <LayoutWithHeader>
                <Portfolio />
              </LayoutWithHeader>
            }
          />

          <Route
            path="/skills"
            element={
              <LayoutWithHeader>
                <Skills />
              </LayoutWithHeader>
            }
          />

          <Route
            path="/certificate"
            element={
              <LayoutWithHeader>
                <Contact />
              </LayoutWithHeader>
            }
          />

          <Route
            path="/projects/:slug"
            element={
              <LayoutWithHeader>
                <ProjectDetails />
              </LayoutWithHeader>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
