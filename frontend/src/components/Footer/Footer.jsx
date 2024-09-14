import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons'; 
import './Footer.css'; 
// import {logob} from '../../assets/logob.png';

export default function Footer() {
  return (
    <footer className='footer-container'>
      <div className='footer-content'>
        <div className='social-icons'>
        {/* <img src={logob} alt="Tour Mate Logo" className="logo-image" />  */}
          <a href='https://facebook.com' className='text-white'>
            <FontAwesomeIcon icon={faFacebook} size="2x" />
          </a>
          <a href='https://twitter.com' className='text-white'>
            <FontAwesomeIcon icon={faTwitter} size="2x" />
          </a>
          <a href='https://instagram.com' className='text-white'>
            <FontAwesomeIcon icon={faInstagram} size="2x" />
          </a>
        </div>
      </div>
      <div className='footer-bottom'>
        &copy;{new Date().getFullYear()} TourMate.All rights reserved.
      </div>
    </footer>
  );
}
