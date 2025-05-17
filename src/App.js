import React, { useEffect } from 'react';
import './App.css';
import AOS from 'aos'; // Import AOS
import 'aos/dist/aos.css'; // Import AOS CSS

import About from './Components/About';
import Contact from './Components/Contact';
import Header from './Components/header'
import Home from './Components/Home';
import Portfolio from './Components/Portfolio';
import Resume from './Components/Resume';
import Skills from './Components/Skills';

function App() {
  
  useEffect(() => {
    AOS.init({
      duration: 1000, 
      once: true
    });
        document.title = "Muhammad ALi";

  }, []);

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

export default App;
