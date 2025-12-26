// src/App.js
import React, { useEffect } from "react";
import "./App.css";
import AOS from "aos";
import "aos/dist/aos.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./Components/header";
import Home from "./Components/Home";
import About from "./Components/About";
import Portfolio from "./Components/Portfolio";
import Resume from "./Components/Resume";
import Skills from "./Components/Skills";
import Contact from "./Components/Certificate";
import ProjectDetails from "./Components/ProjectDetails";

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
          path="/portfolio"
          element={
            <LayoutWithHeader>
              <Portfolio />
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
    </BrowserRouter>
  );
}

export default App;
