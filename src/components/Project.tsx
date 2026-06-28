import React from "react";
import mock01 from '../assets/images/mock01.png';
import mock02 from '../assets/images/mock02.png';
import mock04 from '../assets/images/mock04.png';
import aws_mock01 from '../assets/images/aws_mock01.png';
import ml_mock01 from '../assets/images/ml_mock01.png';
import ml_mock02 from '../assets/images/ml_mock02.png';
import aws_mock02 from '../assets/images/aws_mock02.png';
import triage_ai from '../assets/images/triage_ai.png';
// import mock08 from '../assets/images/mock08.png';
// import mock09 from '../assets/images/mock09.png';
// import mock10 from '../assets/images/mock10.png';
import '../assets/styles/Project.scss';

function Project() {
    return(
    <div className="projects-container" id="projects">
        <h1>Personal Projects</h1>
        <div className="projects-grid">
            {/* agentic AI / GenAI */}
            <div className="project">
                <a href="https://github.com/chetanchandane/rag" target="_blank" rel="noreferrer"><img src={mock04} className="zoom" alt="thumbnail" width="100%"/></a>
                <a href="https://github.com/chetanchandane/rag" target="_blank" rel="noreferrer"><h2>Clinical Trial Compliance RAG</h2></a>
                <p>Production RAG over FDA/ICH regulatory documents that answers compliance questions with fully source-cited answers. HyDE + hybrid BM25/dense search, RRF fusion, and Cohere reranking lift Context Precision +37% and Recall +24%; a Ragas CI gate blocks regressing deploys.</p>
                <p className="tech-stack"><span className="tech-label">Tech: </span>FastAPI · Claude · Qdrant · OpenAI Embeddings · BM25 · HyDE · Cohere Rerank · RRF · Ragas · LangSmith · GitHub Actions · Docker</p>
            </div>
            <div className="project">
                <a href="https://www.github.com/chetanchandane/TriageAI" target="_blank" rel="noreferrer"><img src={triage_ai} className="zoom" alt="thumbnail" width="100%"/></a>
                <a href="https://www.github.com/chetanchandane/TriageAI" target="_blank" rel="noreferrer"><h2>Triage AI</h2></a>
                <p>Autonomous multi-agent system (cyclic LangGraph) that triages patient portal messages, grounding every decision in patient history and hospital policy. Hit 100% safety recall and 84% fewer false positives vs a keyword baseline across 189 labeled messages, traced over 640 runs in LangSmith.</p>
                <p className="tech-stack"><span className="tech-label">Tech: </span>LangGraph · Gemini 2.5 Pro · MCP · ChromaDB · Supabase · LangSmith · Streamlit · Pydantic</p>
            </div>
            <div className="project">
                <a href="https://www.github.com/chetanchandane/cloud-native-aws-application" target="_blank" rel="noreferrer"><img src={mock01} className="zoom" alt="thumbnail" width="100%"/></a>
                <a href="https://www.github.com/chetanchandane/cloud-native-aws-application" target="_blank" rel="noreferrer"><h2>Nutri AI</h2></a>
                <p>Serverless nutrition platform that analyzes food images and calculates nutrients using React, AWS services, and GPT-4o.</p>
                <p className="tech-stack"><span className="tech-label">Tech: </span>React · AWS Lambda · API Gateway · DynamoDB · Cognito · Rekognition · Textract · GPT-4o · Terraform</p>
            </div>
            <div className="project">
                <a href="https://github.com/chetanchandane/agentic-github2blog" target="_blank" rel="noreferrer"><img src={mock02} className="zoom" alt="thumbnail" width="100%"/></a>
                <a href="https://github.com/chetanchandane/agentic-github2blog" target="_blank" rel="noreferrer"><h2>Git2Blog Agentic AI</h2></a>
                <p>Automated pipeline built with LangGraph that analyzes GitHub repos, generates technical blog posts with AI, and publishes them directly to DEV.to</p>
                <p className="tech-stack"><span className="tech-label">Tech: </span>Python · FastAPI · LangGraph · LangChain · OpenAI · GitHub API · Dev.to API</p>
            </div>
            {/* AWS / Cloud */}
            <div className="project">
                <a href="https://github.com/chetanchandane/aws-ecr-docker" target="_blank" rel="noreferrer"><img src={aws_mock01} className="zoom" alt="thumbnail" width="100%"/></a>
                <a href="https://github.com/chetanchandane/aws-ecr-docker/" target="_blank" rel="noreferrer"><h2>AWS Containerized Blog</h2></a>
                <p>Developed a containerized WordPress and MySQL stack using Docker and implemented a secure deployment pipeline through AWS Elastic Container Registry (ECR)</p>
                <p className="tech-stack"><span className="tech-label">Tech: </span>Docker · WordPress · MySQL · AWS ECR</p>
            </div>
            <div className="project">
                <a href="https://github.com/chetanchandane/ansible-bash-terraform-automation" target="_blank" rel="noreferrer"><img src={aws_mock02} className="zoom" alt="thumbnail" width="100%"/></a>
                <a href="https://github.com/chetanchandane/ansible-bash-terraform-automation" target="_blank" rel="noreferrer"><h2>AWS SecureOps: End-to-End Infrastructure Automation</h2></a>
                <p>One-command provisioning, configuration, and secure secret injection into a cloud VM using Terraform, Ansible, Bash, and a Flask mock vault (CyberArk-style) for secret retrieval.</p>
                <p className="tech-stack"><span className="tech-label">Tech: </span>Terraform · Ansible · Bash · Flask · AWS EC2</p>
            </div>
            {/* ML + DS*/}
            <div className="project">
                <a href="https://github.com/chetanchandane/machine-learning-style-transfer" target="_blank" rel="noreferrer"><img src={ml_mock01} className="zoom" alt="thumbnail" width="100%"/></a>
                <a href="https://github.com/chetanchandane/machine-learning-style-transfer" target="_blank" rel="noreferrer"><h2>Deep Learning Image Synthesis (ML)</h2></a>
                <p>A deep learning implementation using the VGG19 CNN architecture to perform Neural Style Transfer, optimizing content and style loss functions via PyTorch</p>
                <p className="tech-stack"><span className="tech-label">Tech: </span>PyTorch · VGG19 · CNN · Neural Style Transfer</p>
            </div>
            <div className="project">
                <a href="https://github.com/chetanchandane/CSCI-720-BDA-Project-G1" target="_blank" rel="noreferrer"><img src={ml_mock02} className="zoom" alt="thumbnail" width="100%"/></a>
                <a href="https://github.com/chetanchandane/CSCI-720-BDA-Project-G1" target="_blank" rel="noreferrer"><h2>California Housing: A KDD Analytics Pipeline (ML)</h2></a>
                <p>An end-to-end data science project implementing the KDD process to analyze California housing trends through spatial outlier detection (DBSCAN/LOF), multi-cluster segmentation, and predictive regression modeling</p>
                <p className="tech-stack"><span className="tech-label">Tech: </span>Python · scikit-learn · Pandas · DBSCAN · LOF · Regression</p>
            </div>
        </div>
    </div>
    );
}

export default Project;
