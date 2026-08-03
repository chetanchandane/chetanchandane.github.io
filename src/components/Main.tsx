import React from "react";
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import '../assets/styles/Main.scss';
import medium from '../assets/images/medium.png';
import HeroDither from './HeroDither';
import LinkedInBadge from './LinkedInBadge';

const RESUME_URL = "https://drive.google.com/file/d/1TKDmjTvnT6v5Tk6BVFpwcqPruIkYPq0i/view?usp=sharing";

interface MainProps {
  onAskChetan?: () => void;
}

function Main({ onAskChetan }: MainProps) {
  return (
    <header className="hero" id="top">
      <HeroDither />
      <div className="hero__scrim" />
      <div className="hero__inner">
        <div className="eyebrow">AI Engineer · Full Stack</div>
        <h1 className="hero__name">
          Chetan<br />
          <em>Chandane</em>
        </h1>
        <p className="hero__role">Building production GenAI, end to end.</p>
        <p className="hero__lede">
          I design and ship agentic systems, RAG pipelines, and the products
          around them — from the model to the interface.
        </p>

        <div className="hero__cta">
          <a
            className="btn btn--primary"
            href={RESUME_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="View Resume (opens in a new tab)"
          >
            View Resume
            <OpenInNewIcon className="btn__icon" />
          </a>
          <button type="button" className="btn btn--ghost" onClick={onAskChetan}>
            <AutoAwesomeIcon className="btn__icon" />
            Ask my AI twin
          </button>
        </div>

        <div className="hero__socials">
          <a href="https://github.com/chetanchandane" target="_blank" rel="noreferrer" aria-label="GitHub"><GitHubIcon /></a>
          <LinkedInBadge>
            <a href="https://www.linkedin.com/in/chetanchandane/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedInIcon /></a>
          </LinkedInBadge>
          <a href="https://medium.com/@chetanchandane013" target="_blank" rel="noreferrer" aria-label="Medium"><img src={medium} alt="Medium" /></a>
          <a href="mailto:chetanchandane.ai@gmail.com" aria-label="Email"><EmailIcon /></a>
        </div>
      </div>
    </header>
  );
}

export default Main;
