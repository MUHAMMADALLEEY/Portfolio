import React from 'react'
const Portfolio = () => {
  return (
    <>
    <section className="portfolio" id="portfolio" data-aos="fade-up" data-aos-offset="200" data-aos-delay="50"
    data-aos-duration="1000" data-aos-easing="ease-in-out" data-aos-mirror="true" data-aos-once="false"
    data-aos-anchor-placement="top-center">
        <h2 className="heading">My <span>Portfolio</span></h2>

        <div className="portfolio-grid">
            <div className="project-card">
                <div className="project-image">
                    <img src="/images/Pokemon.PNG" alt="Project 1 Screenshot"/>
                </div>
                <div className="project-info">
                    <h3>Pokemon Platform</h3>
                    <p>Pokemon APi Platform with React.js</p>
                </div>
            </div>

            <div className="project-card">
                <div className="project-image">
                    <img src="/images/Portfolio.PNG" alt="Project 2 Screenshot"/>
                </div>
                <div className="project-info">
                    <h3>Portfolio</h3>
                    <p>Portfolio website using React js and React Libraries.</p>
                </div>
            </div>

            <div className="project-card">
                <div className="project-image">
                <img
  src="/images/notes.png"
  style={{ backgroundSize: 'cover' }}
  alt="Project 2 Screenshot"
/>
                </div>
                <div className="project-info">
                    <h3>Notes App</h3>
                    <p>Notes App with Express and Mongo DB.</p>
                </div>
            </div>
            <div className="project-card">
                <div className="project-image">
                    <img src="/images/auth.jpg" alt="Project 2 Screenshot"/>
                </div>
                <div className="project-info">
                    <h3>Post App</h3>
                    <p>Post Uploaded app with Express and Mongo DB and also use Ejs. </p>
                </div>
            </div>
            

        </div>
    </section>
    </>
  )
}
export default Portfolio