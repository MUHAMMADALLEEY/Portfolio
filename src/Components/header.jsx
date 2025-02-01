import React, { useEffect } from 'react';

const Header = () => {
  useEffect(() => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('header nav a');
    const menuicon = document.querySelector("#menu-icon");
    const navbar = document.querySelector(".navbar");
    const header = document.querySelector('header');

    // Add null checks for DOM elements
    if (!menuicon || !navbar || !header) {
      console.error('Critical elements not found!');
      return;
    }

    // Header sticky effect & scroll event
    const handleScroll = () => {
      header.classList.toggle('sticky', window.scrollY > 100);

      // Close mobile menu on scroll
      menuicon.classList.remove("bx-x");
      navbar.classList.remove("active");

      // Section active state
      const top = window.scrollY;
      sections.forEach(sec => {
        const offset = sec.offsetTop - 100;
        const height = sec.offsetHeight;
        const id = sec.getAttribute('id');

        if (top >= offset && top < offset + height) {
          navLinks.forEach(link => link.classList.remove('active'));
          const targetLink = document.querySelector(`a[href="#${id}"]`);
          if (targetLink) targetLink.classList.add('active');
        }
      });
    };

    window.onscroll = handleScroll;

    // Mobile menu toggle
    const toggleMenu = () => {
      menuicon.classList.toggle("bx-x");
      navbar.classList.toggle("active");
    };

    menuicon.onclick = toggleMenu;

    // Cleanup on component unmount
    return () => {
      window.onscroll = null;
      menuicon.onclick = null;
    };
  }, []);

  return (
    <header className="header" data-aos="flip-left" data-aos-delay="50" data-aos-duration="1000">
      <a href="#" className="logo">M ALI</a>
      <div className="bx bx-menu" id="menu-icon"></div>
      <nav className="navbar">
        <a href="#home" className="active">Home</a>
        <a href="#about">About</a>
        <a href="#portfolio">Portfolio</a>
        <a href="#resume">Resume</a>
        <a href="#skills">Skills</a>
        <a href="#contact">Contact</a>

        <div className="active-nav"></div>
      </nav>
    </header>
  );
};

export default Header;
