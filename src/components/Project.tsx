import React from "react";
import mock01 from '../assets/images/mock01.png';
import mock02 from '../assets/images/mock02.png';
import mock04 from '../assets/images/mock04.png';
import aws_mock01 from '../assets/images/aws_mock01.png';
import ml_mock01 from '../assets/images/ml_mock01.png';
import ml_mock02 from '../assets/images/ml_mock02.png';
import aws_mock02 from '../assets/images/aws_mock02.png';
import triage_ai from '../assets/images/triage_ai.png';
import bhartix from '../assets/images/bhartix.jpg';
import doc_stream from '../assets/images/doc_stream.jpg';
import agent_gate from '../assets/images/agent_gate.png';
import rag_data_plane from '../assets/images/rag_data_plane.png';
// import mock08 from '../assets/images/mock08.png';
// import mock09 from '../assets/images/mock09.png';
// import mock10 from '../assets/images/mock10.png';
import '../assets/styles/Project.scss';

function Project() {
    return(
    <div className="projects-container" id="projects">
        <div className="section-head">
            <span className="eyebrow">Selected work</span>
            <h1>Personal Projects</h1>
        </div>
        <div className="projects-grid">
            {/* commercial / client work */}
            <div className="project">
                <a href="https://bhartix.com" target="_blank" rel="noreferrer"><img src={bhartix} className="zoom" alt="BhartiX website" width="100%"/></a>
                <a href="https://bhartix.com" target="_blank" rel="noreferrer"><h2>BhartiX — Export Trade Platform</h2></a>
                <p>A commercial website built end to end for a real client — BhartiX, a government-certified Indian agri-exporter. Product catalog, company profile, quote-request flows, and an admin portal, designed and shipped to production.</p>
                <p className="tech-stack"><span className="tech-label">Tech: </span>React · TypeScript · Vite · Responsive Web · SEO · Production</p>
            </div>
            {/* distributed AI systems */}
            <div className="project">
                <a href="https://github.com/chetanchandane/doc-stream" target="_blank" rel="noreferrer"><img src={doc_stream} className="zoom" alt="DocStream" width="100%"/></a>
                <a href="https://github.com/chetanchandane/doc-stream" target="_blank" rel="noreferrer"><h2>DocStream — Distributed AI Doc Pipeline</h2></a>
                <p>Event-driven, distributed document-intelligence platform: a FastAPI gateway streams documents over Kafka to scalable Python microservices that extract, embed, classify, and summarize, then serves grounded, cited RAG answers through a CQRS read API — with transactional outbox, idempotent consumers, and dead-letter retries.</p>
                <p className="tech-stack"><span className="tech-label">Tech: </span>Python · FastAPI · Kafka · Kubernetes · Helm · PostgreSQL · Qdrant · S3/MinIO · Claude · Prometheus</p>
            </div>
            {/* agentic AI / GenAI */}
            <div className="project">
                <a href="https://github.com/chetanchandane/rag" target="_blank" rel="noreferrer"><img src={mock04} className="zoom" alt="thumbnail" width="100%"/></a>
                <a href="https://github.com/chetanchandane/rag" target="_blank" rel="noreferrer"><h2>Clinical Trial Compliance RAG</h2></a>
                <p>Production RAG over FDA/ICH regulatory documents that answers compliance questions with fully source-cited answers. HyDE + hybrid BM25/dense search, RRF fusion, and Cohere reranking lift Context Precision +37% and Recall +24%; a Ragas CI gate blocks regressing deploys.</p>
                <p className="tech-stack"><span className="tech-label">Tech: </span>FastAPI · Claude · Qdrant · OpenAI Embeddings · BM25 · HyDE · Cohere Rerank · RRF · Ragas · LangSmith · GitHub Actions · Docker</p>
            </div>
            <div className="project">
                <a href="https://github.com/chetanchandane/rag-data-plane" target="_blank" rel="noreferrer"><img src={rag_data_plane} className="zoom" alt="rag-data-plane: multi-tenant RAG on AWS" width="100%"/></a>
                <a href="https://github.com/chetanchandane/rag-data-plane" target="_blank" rel="noreferrer"><h2>rag-data-plane: Multi-Tenant RAG on AWS <span className="wip-tag">Work in progress</span></h2></a>
                <p>Multi-tenant RAG ingestion and retrieval API on AWS, where tenant and role isolation is enforced by Postgres row-level security instead of application code. A CI leak matrix asks every eval question as six tenant and role personas and checks every returned chunk for cross-tenant canary tokens: 1,140 requests, 0 leaks. Ingestion runs through S3, SQS with a dead-letter queue, and idempotent Lambda workers. Resilience and load-testing slices are in progress.</p>
                <p className="tech-stack"><span className="tech-label">Tech: </span>Python · FastAPI · AWS Lambda · S3 · SQS · API Gateway · Neon Postgres · pgvector · Terraform · OpenTelemetry · GitHub OIDC</p>
            </div>
            <div className="project">
                <a href="https://github.com/chetanchandane/agent-gate" target="_blank" rel="noreferrer"><img src={agent_gate} className="zoom" alt="agent-gate: regression gate for LLM agents" width="100%"/></a>
                <a href="https://github.com/chetanchandane/agent-gate" target="_blank" rel="noreferrer"><h2>agent-gate: Regression Gate for LLM Agents</h2></a>
                <p>An improver LLM proposes edits to an agent's versioned policy files, and a deterministic gate accepts one only if it improves a dev set, breaks nothing in a protected safeguard set, holds on a hidden holdout set, and stays within cost and latency budgets. Lifted dev pass rate from 80% to 94% and safeguards from 83% to 100%, while rejecting 6 candidate edits, including 3 deliberately bad hand-written policies. Runs as a GitHub Actions check on every policy PR.</p>
                <p className="tech-stack"><span className="tech-label">Tech: </span>Python · LangGraph · Claude · OpenTelemetry · pytest · mypy · GitHub Actions · uv</p>
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
