import React from "react";
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import '../assets/styles/Footer.scss'
import medium from '../assets/images/medium.png';
import LinkedInBadge from './LinkedInBadge';

function Footer() {
  return (
    <footer>
      <div>
        <a href="https://github.com/chetanchandane" target="_blank" rel="noreferrer"><GitHubIcon/></a>
        <LinkedInBadge><a href="https://www.linkedin.com/in/chetanchandane/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedInIcon/></a></LinkedInBadge>
        <a href="https://medium.com/@chetanchandane013" target="_blank" rel="noreferrer"><img src={medium} alt="Medium" style={{width: '27px', height: '27px'}} /></a>
        <a href="mailto:chetanchandane.ai@gmail.com" aria-label="Email"><EmailIcon/></a>
      </div>
      <p>A portfolio designed &amp; built by <a href="https://github.com/chetanchandane" target="_blank" rel="noreferrer">Chetan Chandane</a> with <span className="footer-heart">♥</span></p>
    </footer>
  );
}

export default Footer;