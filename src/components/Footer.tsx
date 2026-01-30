import React from "react";
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import '../assets/styles/Footer.scss'
import medium from '../assets/images/medium.png';

function Footer() {
  return (
    <footer>
      <div>
        <a href="https://github.com/chetanchandane" target="_blank" rel="noreferrer"><GitHubIcon/></a>
        <a href="https://www.linkedin.com/in/chetanchandane/" target="_blank" rel="noreferrer"><LinkedInIcon/></a>
        <a href="https://medium.com/@chetanchandane013" target="_blank" rel="noreferrer"><img src={medium} alt="Medium" style={{width: '27px', height: '27px'}} /></a>  
      </div>
      <p>A portfolio designed & built by <a href="https://github.com/chetanchandane" target="_blank" rel="noreferrer">Chetan Chandane</a> with 💜</p>
    </footer>
  );
}

export default Footer;