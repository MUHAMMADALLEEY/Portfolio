import React from 'react'

const About = () => {
  return (
    <>
     <section className="about" id="about">
        <h2 className="heading" data-aos="fade-right" data-aos-delay="50" data-aos-duration="1000">
            About <span>Me</span>
            <span className="animate scroll" style={{ '--i': 1 }}></span>
            </h2>
        <div className="about-img">
            <img src="/images/file2.png" alt=""/>
            <span className="circle-spin"></span>
        </div>
        <div className="about-content" data-aos="fade-left" data-aos-delay="50" data-aos-duration="1000">
            <h3>FullStack Developer</h3>
            <p>I am Muhammad Ali a Full Stack web Developer , a true architect of the digital world, embodies a
                versatile and comprehensive skill set, capable of designing, building, and maintaining end-to-end web
                applications. They are the bridge between elegant design and robust functionality, seamlessly weaving
                together the front-end user experience with the back-end infrastructure that powers it all. </p>

        </div>
        <div className="btn-box btns">
            <a href="#resume" className="btn">Read More</a>
        </div>
    </section>
    </>
  )
}

export default About