import React, { useEffect, useState } from 'react';
import '../styles/Main.css';
import tm1 from '../images/tm1.jpg';
import tm2 from '../images/tm2.jpg';
import tm3 from '../images/tm3.jpg';
import tm4 from '../images/tm4.png';
import tm5 from '../images/tm5.png';
import { initializeApp } from '../initializeThreeJSApp.js';

const Main = () => {
  const initialModules = [
    { title: 'Keplerian Orbits', description: `A Keplerian orbit describes the motion of an object (such as a planet or satellite) around a larger body under the influence of gravity, based on Kepler's laws of planetary motion. These orbits are typically elliptical, with the larger body (e.g., a star or planet) at one focus of the ellipse. The key parameters that define a Keplerian orbit are the semi-major axis, eccentricity, inclination, argument of periapsis, longitude of the ascending node, and true anomaly. These orbits are governed by two-body gravitational dynamics and are often used in simplified models of celestial mechanics.` },
    { title: 'Why are the Orbits Elliptical', description: `This elliptical shape arises from the inverse-square law of gravity (Newton's Law of Gravitation), which means the greater the distance, the weaker the attraction. Also, because of alteration in the gravitational pull as a planet moves around the orbit, the planet tends to move faster as it comes towards the sun (Perihelion), as well as it moves slower when it is further away from the sun (aphelion). Since the orbital motion of the planets is due to both the gravitational pull of the sun and the centrifugal force arising from the velocity of the planets, the orbital planes of the planets are elliptical orbits instead of circular orbits.` },
    { title: 'What is Calculus', description: `Calculus is a part of math that helps us understand change. It has two main ideas: Differentiation: This tells us how something changes at a specific moment. For example, if you're driving, differentiation helps find your speed at any point in time. Integration: This helps us add up small pieces to find the total. For example, if you know your speed, integration helps figure out how far you've traveled over time. In short, calculus helps us understand both how things change and how to add up those changes.` },
    { title: 'How the Orbit is Calculated', description: `Orbit propagation involves predicting an object's future position and velocity by solving differential equations derived from Newton's second law and gravity.` },
  ];

  const [modules] = useState(initialModules);
  const [clickedIndex, setClickedIndex] = useState(null);

  useEffect(() => {
    const container = document.getElementById('three-js-container');
    initializeApp(container);

    return () => {
      // Cleanup if needed
    };
  }, []);

  const handleModuleClick = (index) => {
    setClickedIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className="main">
      <section className="solar-system-placeholder">
        <div id="three-js-container" style={{ width: '100%', height: '100%' }}></div>
      </section>

      <section className="education-section">
        <h2>Education Module</h2>
        <div className="module-grid">
          {modules.map((module, index) => (
            <div className="module-container" key={index}>
              <div
                className={`module ${clickedIndex === index ? 'expanded' : ''}`} 
                onClick={() => handleModuleClick(index)}
              >
                <p className="module-title" style={{ fontSize: clickedIndex === index ? '1.5rem' : '1rem' }}>
                  {module.title}
                </p>
                {clickedIndex === index && (
                  <p className="module-description">{module.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="projects" className="projects-section">
        <h2>Challenge</h2>
        <p>
          This project is an interactive, web-based orrery that simulates the real-time orbits of planets and Near-Earth Objects (NEOs) like asteroids and comets. Using NASA data and Keplerian parameters, it calculates the positions of these celestial bodies relative to the Sun.
          <br /><br />
          The platform offers an engaging, educational experience where users can explore the solar system and learn about the potential risks posed by NEOs. By combining real scientific data with modern web technologies, it makes astronomy accessible and interactive, providing a fun and informative introduction to celestial mechanics.
        </p>
      </section>

      <section id="about" className="about-section">
        <h2>About Us</h2>
        <p>We are a passionate team of developers dedicated to creating awesome web applications!</p>
      </section>

      <section id="team" className="team-section">
        <h2>Meet Our Team</h2>
        <div className="team-members">
          <div className="team-member">
            <img src={tm1} alt="Matthew Chen" className="team-photo" />
            <p className="team-name">
              <a href="https://www.linkedin.com/in/matthew-chen-6582a2240" target="_blank" rel="noopener noreferrer">Matthew Chen</a>
            </p>
          </div>
          <div className="team-member">
            <img src={tm2} alt="Ken Ou" className="team-photo" />
            <p className="team-name">
              <a href="https://www.linkedin.com/in/ken-ou-6a0320254" target="_blank" rel="noopener noreferrer">Ken Ou</a>
            </p>
          </div>
          <div className="team-member">
            <img src={tm3} alt="Kostia Novosydliuk" className="team-photo" />
            <p className="team-name">
              <a href="https://www.linkedin.com/in/kostianvs" target="_blank" rel="noopener noreferrer">Kostia Novosydliuk</a>
            </p>
          </div>
          <div className="team-member">
            <img src={tm4} alt="Khang Nguyen" className="team-photo" />
            <p className="team-name">
              <a href="https://www.linkedin.com/in/mrkhangnguyen" target="_blank" rel="noopener noreferrer">Khang Nguyen</a>
            </p>
          </div>
          <div className="team-member">
            <img src={tm5} alt="Alexander Sotnikov" className="team-photo" />
            <p className="team-name">
              <a href="https://www.linkedin.com/in/alexander-sotnikov-uw-ce" target="_blank" rel="noopener noreferrer">Alexander Sotnikov</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Main;//edejk
