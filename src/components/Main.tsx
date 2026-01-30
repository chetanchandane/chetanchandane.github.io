import React from "react";
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import '../assets/styles/Main.scss';
import myProfilePic from '../assets/images/my-profile-pic.jpeg';
import medium from '../assets/images/medium.png';

function Main() {

  return (
    <div className="container">
      <div className="about-section">
        <div className="image-wrapper">
          <img src={myProfilePic} alt="Avatar" />
        </div>
        <div className="content">
          <div className="social_icons">
            <a href="https://github.com/chetanchandane" target="_blank" rel="noreferrer"><GitHubIcon/></a>
            <a href="https://www.linkedin.com/in/chetanchandane/" target="_blank" rel="noreferrer"><LinkedInIcon/></a>
            <a href="https://medium.com/@chetanchandane013" target="_blank" rel="noreferrer"><img src={medium} alt="Medium" style={{width: '30px', height: '30px'}} /></a>
          </div>
          <h1>Chetan Chandane</h1>
          <p>Software Engineer</p>

          <div className="mobile_social_icons">
            <a href="https://github.com/chetanchandane" target="_blank" rel="noreferrer"><GitHubIcon/></a>
            <a href="https://www.linkedin.com/in/chetanchandane/" target="_blank" rel="noreferrer"><LinkedInIcon/></a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;