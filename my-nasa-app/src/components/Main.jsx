
import React, { useEffect } from 'react';
import '../styles/Main.css';
import tm1 from '../images/tm1.jpg';
import tm2 from '../images/tm2.jpg';
import tm3 from '../images/tm3.jpg';
import tm4 from '../images/tm4.png';
import tm5 from '../images/tm5.png';

import { initializeApp } from '../initializeThreeJSApp.js';


const Main = () => {
  useEffect(() => {
    const container = document.getElementById('three-js-container');
    initializeApp(container);

    return () => {
      
    };
  }, []);

  return (
    <div className="main">
      {/* Solar system display */}
      <section className="solar-system-placeholder">
        <div id="three-js-container" style={{ width: '100%', height: '100%' }}></div>
      </section>

      {/* Challenge/Projects Section */}
      <section id="projects" className="projects-section">
        <h2>Challenge</h2>
        <p>
          This project is an interactive, web-based orrery that simulates the real-time orbits of planets and Near-Earth Objects (NEOs) like asteroids and comets. Using NASA data and Keplerian parameters, it calculates the positions of these celestial bodies relative to the Sun.
          <br /><br />
          The platform offers an engaging, educational experience where users can explore the solar system and learn about the potential risks posed by NEOs. By combining real scientific data with modern web technologies, it makes astronomy accessible and interactive, providing a fun and informative introduction to celestial mechanics.
        </p>
      </section>

      {/* About Us Section */}
      <section id="about" className="about-section">
        <h2>About Us</h2>
        <p>We are a passionate team of developers dedicated to creating awesome web applications!</p>
      </section>

      {/* Team Section */}
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

export default Main;