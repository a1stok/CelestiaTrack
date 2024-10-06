import React from 'react';
import '../styles/Header.css';  
import logo from '../images/logo.png'; 

const Header = () => {

  const smoothScrollTo = (target, scrollSpeed) => {
    const element = document.querySelector(target);
    if (element) {
      const totalScrollDistance = element.offsetTop;
      let currentScroll = window.pageYOffset;
      let step = 25; // This can be adjusted based on how fast you want the scroll
      const scrollInterval = setInterval(() => {
        if (currentScroll < totalScrollDistance) {
          currentScroll += step;
          window.scrollTo(0, currentScroll);
        } else {
          clearInterval(scrollInterval); 
        }
      }, scrollSpeed);
    }
  };

  const handleClick = (e, target, speed) => {
    e.preventDefault();
    smoothScrollTo(target, speed);
  };

  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="Logo" />
        <span className="logo-text">CelestiaTrack</span>
      </div>

      <nav className="nav">
        <a 
          href="#projects" 
          className="nav-link" 
          onClick={(e) => handleClick(e, '#projects', 20)} // Set different speed for Challenge
        >
          Challenge
        </a>
        <a 
          href="#about" 
          className="nav-link" 
          onClick={(e) => handleClick(e, '#about', 15)} // Set different speed for About Us
        >
          About Us
        </a>
        <a 
          href="#team" 
          className="nav-link" 
          onClick={(e) => handleClick(e, '#team', 10)} // Set different speed for Team
        >
          Team
        </a> 
      </nav>
    </header>
  );
}

export default Header;
