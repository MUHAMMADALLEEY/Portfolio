import React from 'react'

const Home = () => {
  return (
    <>
  <section className="home" id="home" data-aos="fade-up" data-aos-offset="200" data-aos-delay="50"
        data-aos-duration="1000" data-aos-easing="ease-in-out" data-aos-mirror="true" data-aos-once="false"
        data-aos-anchor-placement="top-center">
        <div className="home-content">
            <h1 data-aos="fade-down-right" data-aos-delay="50" data-aos-duration="1000" data-aos-easing="ease-in-out">Hi
                i'm <spna>Muhammad Ali</spna>
            </h1>
            <div className="text-animate">
                <h3>FullStack Developer</h3>
            </div>
            <p>
                I’m a Full Stack Developer with expertise in both front-end and back-end technologies. I work with HTML,
                CSS, JavaScript, React, Node.js, and databases like Cloud Firestore and MongoDB. I build scalable web
                applications, and ensure smooth user experiences. I’m skilled at managing the full development lifecycle
                from design to deployment.
            </p>
            <div className="btn-box">
                <a href="./My Cv/aaaa.docx" className="btn">Download Cv</a>
                <a href="#contact" className="btn">Hire me</a>
            </div>

        </div>
        <div className="img-box">
            <img src="/images/file2.png" alt=""/>
            <span className="circle"></span>
        </div>

        <div className="home-sci">
            <a href="https://github.com/MUHAMMADALLEEY"><i className='bx bxl-github'></i></a>
            <a href="#"><i className='bx bxl-instagram'></i></a>
            <a href="https://www.linkedin.com/in/muhammad-a-105104253/"><i className='bx bxl-linkedin'></i></a>
        </div>

    </section>
    </>
  )
}

export default Home