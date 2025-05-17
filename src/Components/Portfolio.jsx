import React from 'react';

const Portfolio = () => {
  const projects = [
    {
      title: "Agency",
      description: "Full-stack application built with React.js, Express, and MongoDB.",
      image: "/images/agency.PNG",
      alt: "Agency Project Screenshot"
    },
    {
      title: "Portfolio",
      description: "Responsive personal portfolio using React and modern libraries.",
      image: "/images/Portfolio.PNG",
      alt: "Portfolio Website Screenshot"
    },
    {
      title: "E-commerce Store",
      description: "Online store built with React and Firebase for authentication and data handling.",
      image: "/images/ecommerce.PNG",
      alt: "E-commerce Store Screenshot"
    },
    {
      title: "Snow Dream",
      description: "Creative site built with React.js and Framer Motion animations.",
      image: "/images/snowdream.png",
      alt: "Snow Dream Project Screenshot"
    },
    {
      title: "Notes App",
      description: "Notes-taking app built with Express.js and MongoDB.",
      image: "/images/notes.png",
      alt: "Notes App Screenshot"
    },
    {
      title: "Post App",
      description: "Blog-style post application using Express, MongoDB, and EJS templating.",
      image: "/images/auth.jpg",
      alt: "Post App Screenshot"
    }
  ];

  return (
    <section
      className="portfolio"
      id="portfolio"
      data-aos="fade-up"
      data-aos-offset="200"
      data-aos-delay="50"
      data-aos-duration="1000"
      data-aos-easing="ease-in-out"
      data-aos-mirror="true"
      data-aos-once="false"
      data-aos-anchor-placement="top-center"
    >
      <h2 className="heading">
        My <span>Portfolio</span>
      </h2>

      <div className="portfolio-grid">
        {projects.map((project, index) => (
          <div className="project-card" key={index}>
            <div className="project-image">
              <img src={project.image} alt={project.alt} />
            </div>
            <div className="project-info">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
            </div>
          </div>
        ))}
      </div>
      <span style={{
      cursor:"pointer",
        display:"flex",
        alignItems:"center",
        justifyContent:"flex-end",
        fontSize:"1.2rem",
      }}>
        For More info visit my Github and LinkedIn</span>
    </section>
  );
};

export default Portfolio;
