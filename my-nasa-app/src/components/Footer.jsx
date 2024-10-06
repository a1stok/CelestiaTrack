// src/components/Footer.jsx

import React from 'react';
import '../styles/Footer.css'; 

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} CelestiaTrack. All rights reserved.</p>
        <ul>
          <li><a href="#privacy">Privacy Policy</a></li>
          <li><a href="#terms">Terms of Service</a></li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
