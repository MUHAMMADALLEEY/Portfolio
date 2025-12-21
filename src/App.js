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
import Contact from "./Components/Contact";

import ProjectDetails from "./Components/ProjectDetails";

function MainPage() {
  return (
    <>
      <Header />
      <Home />
      <About />
      <Portfolio />
      <Resume />
      <Skills />
      <Contact />
    </>
  );
}

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    });
    document.title = "Muhammad Ali";
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/projects/:slug" element={<ProjectDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
