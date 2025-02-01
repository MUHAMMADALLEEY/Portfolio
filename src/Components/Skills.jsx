import React from 'react'
const Skills = () => {
  return (
    <>
    <section className="skills" id="skills">
        <h2 className="heading" data-aos="fade-down-right" data-aos-delay="50" data-aos-duration="1000">My
            <span>Skills</span></h2>
        <div className="skill-row" data-aos="zoom-out-down" data-aos-delay="50" data-aos-duration="1000">

            <div className="skill-column">
                <div className="skill-box">
                    <div className="skill-content">
                        <div className="progress">
                            <h3>Html <span>90%</span></h3>
                            <div className="bar"><span></span></div>
                        </div>

                        <div className="progress">
                            <h3>CSS <span>90%</span></h3>
                            <div className="bar"><span></span></div>
                        </div>

                        <div className="progress">
                            <h3>Tailwind <span>70%</span></h3>
                            <div className="bar"><span></span></div>
                        </div>

                        <div className="progress">
                            <h3>JavaScript <span>80%</span></h3>
                            <div className="bar"><span></span></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="skill-column">
                <div className="skill-box">
                    <div className="skill-content">
                        <div className="progress">
                            <h3>React js <span>80%</span></h3>
                            <div className="bar"><span></span></div>
                        </div>

                        <div className="progress">
                            <h3>Firebase <span>85%</span></h3>
                            <div className="bar"><span></span></div>
                        </div>

                        <div className="progress">
                            <h3>MongoDB <span>80%</span></h3>
                            <div className="bar"><span></span></div>
                        </div>

                        <div className="progress">
                            <h3>Express&Node <span>80%</span></h3>
                            <div className="bar"><span></span></div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </section>
    </>
  )
}

export default Skills