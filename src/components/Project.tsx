import React from "react";
import mock01 from '../assets/images/mock01.png';
import mock02 from '../assets/images/mock02.png';
// import mock03 from '../assets/images/mock03.png';
// import mock04 from '../assets/images/mock04.png';
// import mock05 from '../assets/images/mock05.png';
// import mock06 from '../assets/images/mock06.png';
// import mock07 from '../assets/images/mock07.png';
// import mock08 from '../assets/images/mock08.png';
// import mock09 from '../assets/images/mock09.png';
// import mock10 from '../assets/images/mock10.png';
import '../assets/styles/Project.scss';

function Project() {
    return(
    <div className="projects-container" id="projects">
        <h1>Personal Projects</h1>
        <div className="projects-grid">
            <div className="project">
                <a href="https://www.github.com/chetanchandane/cloud-native-aws-application" target="_blank" rel="noreferrer"><img src={mock01} className="zoom" alt="thumbnail" width="100%"/></a>
                <a href="https://www.github.com/chetanchandane/cloud-native-aws-application" target="_blank" rel="noreferrer"><h2>Nutri AI</h2></a>
                <p>Serverless nutrition platform that analyzes food images and calculates nutrients using React, AWS services, and GPT-4o.</p>
            </div>
            <div className="project">
                <a href="https://github.com/chetanchandane/agentic-github2blog" target="_blank" rel="noreferrer"><img src={mock02} className="zoom" alt="thumbnail" width="100%"/></a>
                <a href="https://github.com/chetanchandane/agentic-github2blog" target="_blank" rel="noreferrer"><h2>Git2Blog Agentic AI</h2></a>
                <p>Automated pipeline built with LangGraph that analyzes GitHub repos, generates technical blog posts with AI, and publishes them directly to DEV.to</p>
            </div>
            {/* <div className="project">
                <a href="https://github.com/yujisatojr/submeowrine" target="_blank" rel="noreferrer"><img src={mock01} className="zoom" alt="thumbnail" width="100%"/></a>
                <a href="https://github.com/yujisatojr/submeowrine" target="_blank" rel="noreferrer"><h2>Submeowrine</h2></a>
                <p>Developed and released an Android mobile application using Java and Android Studio that runs a 2D shooting game.</p>
            </div> */}
        </div>
    </div>
    );
}

export default Project;