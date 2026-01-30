import React from "react";
import mock01 from '../assets/images/mock01.png';
import mock02 from '../assets/images/mock02.png';
import aws_mock01 from '../assets/images/aws_mock01.png';
import ml_mock01 from '../assets/images/ml_mock01.png';
import ml_mock02 from '../assets/images/ml_mock02.png';
import aws_mock02 from '../assets/images/aws_mock02.png';
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
            {/* agentic AI */}
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
            {/* AWS */}
            <div className="project">
                <a href="https://github.com/chetanchandane/aws-ecr-docker" target="_blank" rel="noreferrer"><img src={aws_mock01} className="zoom" alt="thumbnail" width="100%"/></a>
                <a href="https://github.com/chetanchandane/aws-ecr-docker/" target="_blank" rel="noreferrer"><h2>AWS Containerized Blog</h2></a>
                <p>Developed a containerized WordPress and MySQL stack using Docker and implemented a secure deployment pipeline through AWS Elastic Container Registry (ECR)</p>
            </div>
            <div className="project">
                <a href="https://github.com/chetanchandane/ansible-bash-terraform-automation" target="_blank" rel="noreferrer"><img src={aws_mock02} className="zoom" alt="thumbnail" width="100%"/></a>
                <a href="https://github.com/chetanchandane/ansible-bash-terraform-automation" target="_blank" rel="noreferrer"><h2>AWS SecureOps: End-to-End Infrastructure Automation</h2></a>
                <p>Developed a containerized WordPress and MySQL stack using Docker and implemented a secure deployment pipeline through AWS Elastic Container Registry (ECR)</p>
            </div>
            {/* ML + DS*/}
            <div className="project">
                <a href="https://github.com/chetanchandane/machine-learning-style-transfer" target="_blank" rel="noreferrer"><img src={ml_mock01} className="zoom" alt="thumbnail" width="100%"/></a>
                <a href="https://github.com/chetanchandane/machine-learning-style-transfer" target="_blank" rel="noreferrer"><h2>Deep Learning Image Synthesis (ML)</h2></a>
                <p>A deep learning implementation using the VGG19 CNN architecture to perform Neural Style Transfer, optimizing content and style loss functions via PyTorch</p>
            </div>
            <div className="project">
                <a href="https://github.com/chetanchandane/CSCI-720-BDA-Project-G1" target="_blank" rel="noreferrer"><img src={ml_mock02} className="zoom" alt="thumbnail" width="100%"/></a>
                <a href="https://github.com/chetanchandane/CSCI-720-BDA-Project-G1" target="_blank" rel="noreferrer"><h2>California Housing: A KDD Analytics Pipeline (ML)</h2></a>
                <p>An end-to-end data science project implementing the KDD process to analyze California housing trends through spatial outlier detection (DBSCAN/LOF), multi-cluster segmentation, and predictive regression modeling</p>
            </div>
        </div>
    </div>
    );
}

export default Project;