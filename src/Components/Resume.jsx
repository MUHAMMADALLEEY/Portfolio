import React, { useEffect } from 'react';

const Resume = () => {
  useEffect(() => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('header nav a');
    const menuicon = document.querySelector("#menu-icon");
    const navbar = document.querySelector(".navbar");
    const header = document.querySelector('header');

    if (!menuicon || !navbar || !header) {
      console.error('Critical elements not found!');
      return;
    }

    const handleScroll = () => {
      header.classList.toggle('sticky', window.scrollY > 100);

      menuicon.classList.remove("bx-x");
      navbar.classList.remove("active");

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

    const toggleMenu = () => {
      menuicon.classList.toggle("bx-x");
      navbar.classList.toggle("active");
    };

    menuicon.onclick = toggleMenu;

    return () => {
      window.onscroll = null;
      menuicon.onclick = null;
    };
  }, []);

  const handleResumeClick = (index) => {
    const resumeBtns = document.querySelectorAll('.resume-btn');
    const resumeDetails = document.querySelectorAll('.resume-detail');

    resumeBtns.forEach((btn) => btn.classList.remove('active'));
    resumeDetails.forEach((detail) => detail.classList.remove('active'));

    if (resumeBtns[index]) resumeBtns[index].classList.add('active');
    if (resumeDetails[index]) resumeDetails[index].classList.add('active');
  };

  return (
    <>
      <section className="resume active" id="resume" data-aos="fade-down" data-aos-easing="linear" data-aos-duration="1500">
        <div className="resume-container">
          <div className="resume-box">
            <h2>Why Hire Me</h2>
            <button
              style={{ marginTop: '1rem' }}
              className="resume-btn active"
              onClick={() => handleResumeClick(0)}
            >
              Experience
            </button>
            <button
              className="resume-btn"
              onClick={() => handleResumeClick(1)}
            >
              Education
            </button>
            <button
              className="resume-btn"
              onClick={() => handleResumeClick(2)}
            >
              About Me
            </button>
          </div>

          <div className="resume-box">
            <div className="resume-detail experience active">
              <h2 className="heading">My <span>Experience</span></h2>
              <p className="desc">
                I am a passionate and driven professional with a strong focus on delivering tailored solutions. I thrive in collaborative environments, bringing a calm and positive energy that fosters trust and encourages open communication, helping me build strong, lasting relationships.
              </p>
              <div className="resume-list">
                <div className="resume-items">
                  <p className="year">2025 - present</p>
                  <h3>Web Developer</h3>
                  <p className="company">&Build</p>
                  <p>Created responsive, user-friendly interfaces and optimized website performance.</p>
                </div>

                <div className="resume-items">
                  <p className="year">2024</p>
                  <h3>React Developer</h3>
                  <p className="company">Remote</p>
                  <p>Built dynamic, responsive web applications using React.js and related libraries.</p>
                </div>

                <div className="resume-items">
                  <p className="year">2024 - Sep</p>
                  <h3>Backend Developer</h3>
                  <p className="company">Remote</p>
                  <p>Designed and implemented backend APIs, Firebase, and database management solutions.</p>
                </div>
              </div>
            </div>

            <div className="resume-detail education">
              <h2 className="heading">My <span>Education</span></h2>
              <p className="desc">
                A passion for continuous learning, with a strong academic background. I am committed to applying my expertise to every project I undertake.
              </p>
              <div className="resume-list">
                <div className="resume-items">
                  <p className="year">2020 - 2024</p>
                  <h3>BSCS</h3>
                  <p className="company">Riphah International University</p>
                  <p>Expertise in Programming, Web development, and Problem-solving.</p>
                </div>

                <div className="resume-items">
                  <p className="year">2018 - 2020</p>
                  <h3>ICS</h3>
                  <p className="company">Punjab College Gojra</p>
                  <p>Gained knowledge of how computers work at the backend, and more.</p>
                </div>

                <div className="resume-items">
                  <p className="year">2024</p>
                  <h3>React Developer</h3>
                  <p className="company">Remote</p>
                  <p>Cleared all concepts of React in my learning journey.</p>
                </div>
              </div>
            </div>

            <div className="resume-detail about">
              <h2 className="heading" style={{ marginLeft: '2rem' }}>
                About <span>Me</span>
              </h2>
              <p className="desc" style={{ marginLeft: '.5rem' }}>
                I am a passionate and driven professional with a strong focus on delivering tailored solutions. I thrive in collaborative environments, bringing a calm and positive energy that fosters trust and encourages open communication, helping me build strong, lasting relationships.
              </p>
              <div className="resume-list" style={{ marginLeft: '2rem' }}>
                <div className="resume-items">
                  <p>Name: <span>Muhammad Ali</span></p>
                </div>
                <div className="resume-items">
                  <p>Gender: <span>Male</span></p>
                </div>
                <div className="resume-items">
                  <p>Age: <span>23 years</span></p>
                </div>
                <div className="resume-items">
                  <p>Status: <span>Single</span></p>
                </div>
                <div className="resume-items">
                  <p>City: <span>Faisalabad</span></p>
                </div>
                <div className="resume-items">
                  <p>Nationality: <span>Pakistan</span></p>
                </div>
                <div className="resume-items">
                  <p>Experience: <span>2+ Years</span></p>
                </div>
                <div className="resume-items">
                  <p>Full-Time: <span>Available</span></p>
                </div>
                <div className="resume-items">
                  <p>Freelance: <span>Available</span></p>
                </div>
                <div className="resume-items">
                  <p>Phone: <span>+92 3137149438</span></p>
                </div>
                <div className="resume-items">
                  <p>E-mail: <span>muhammadali43800@gmail.com</span></p>
                </div>
                <div className="resume-items">
                  <p>Languages: <span>English, Urdu</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Resume;
