/**
 * AAO facts: the structured, machine-readable version of who Chetan is.
 *
 * Used at build time by scripts/aao/build-aao.js to generate:
 *   - static HTML inside #root (so non-JS crawlers and agents can read the page)
 *   - <title>, meta description, canonical, Open Graph, Twitter tags
 *   - JSON-LD (Person, WebSite, ProfilePage, ItemList of projects)
 *   - /llms.txt, /llms-full.txt, /sitemap.xml
 * and at runtime by src/aao/webmcp.ts (WebMCP tools for browser agents).
 *
 * Keep this file consistent with knowledgeBase.js and the React components.
 * Agents cross-check facts, so one value per fact, everywhere.
 *
 * CommonJS on purpose: the repo root is CJS (see CLAUDE.md).
 */

const SITE_URL = 'https://chetanchandane.com';

const person = {
  name: 'Chetan Chandane',
  jobTitle: 'AI Engineer',
  headline: 'AI Engineer | Full Stack. Building production GenAI, end to end.',
  summary:
    'I design and ship agentic systems, RAG pipelines, and the products around them, from the model to the interface. ' +
    'MS in Computer Science from RIT. Previously at Excellus BCBS (C#/.NET, Angular, Azure on a HIPAA-regulated platform) ' +
    'and Vodafone Intelligent Solutions (Java/Spring Boot microservices, CI/CD, event-driven automation).',
  location: 'Rochester, NY, USA',
  openTo: 'Entry-level Software Engineer and AI Engineer roles. Open to relocation.',
  email: 'chetanchandane.ai@gmail.com',
  resumeUrl:
    'https://drive.google.com/file/d/1TKDmjTvnT6v5Tk6BVFpwcqPruIkYPq0i/view?usp=sharing',
  image: `${SITE_URL}/og-image.jpg`,
  education: [
    {
      name: 'Rochester Institute of Technology',
      degree: 'MS, Computer Science',
      dates: 'Aug 2023 to May 2026',
    },
    {
      name: 'University of Mumbai',
      degree: 'BTech, Information Technology',
      dates: '2016 to 2020',
    },
  ],
  experience: [
    {
      role: 'Full Stack Engineer Intern',
      org: 'Excellus Blue Cross Blue Shield',
      dates: 'Sep 2025 to May 2026',
      stack: 'C#/.NET 8, ASP.NET Core, Angular, Azure Functions, Azure Cognitive Search, Azure Pipelines',
    },
    {
      role: 'Machine Learning Engineer',
      org: 'Rochester Institute of Technology',
      dates: 'Dec 2024 to Jul 2025',
      stack: 'Python, ML workflows for a proteomics research team',
    },
    {
      role: 'Software Engineer',
      org: 'Vodafone Intelligent Solutions (Pune, India)',
      dates: 'Oct 2020 to Jun 2023',
      stack: 'Java, Spring Boot, REST, event-driven automation, Jenkins, ELK, AWS',
    },
  ],
  certifications: [
    'AWS Certified Solutions Architect - Associate',
    'AWS Certified Cloud Practitioner',
  ],
  knowsAbout: [
    'Retrieval-Augmented Generation (RAG)',
    'Agentic AI and multi-agent systems',
    'LLM evaluation (Ragas, LLM-as-judge)',
    'LangGraph',
    'Model Context Protocol (MCP)',
    'Distributed systems',
    'Apache Kafka',
    'Event-driven architecture',
    'Kubernetes',
    'AWS',
    'Azure',
    'Python',
    'TypeScript',
    'C#/.NET',
    'Java/Spring Boot',
    'React',
    'Angular',
  ],
  sameAs: [
    'https://github.com/chetanchandane',
    'https://www.linkedin.com/in/chetanchandane/',
    'https://medium.com/@chetanchandane013',
    'https://x.com/ChetanCh1080',
  ],
};

// Mirrors src/components/Project.tsx (same order, same links).
const projects = [
  {
    name: 'BhartiX: Export Trade Platform',
    url: 'https://bhartix.com',
    description:
      'A commercial website built end to end for a real client, BhartiX, a government-certified Indian agri-exporter. Product catalog, company profile, quote-request flows, and an admin portal, designed and shipped to production.',
    tech: ['React', 'TypeScript', 'Vite', 'SEO'],
  },
  {
    name: 'DocStream: Distributed AI Document Pipeline',
    url: 'https://github.com/chetanchandane/doc-stream',
    description:
      'Event-driven document-intelligence platform. A FastAPI gateway streams documents over Kafka to Python microservices that extract, embed, classify, and summarize, then serves grounded, cited RAG answers through a CQRS read API, with a transactional outbox, idempotent consumers, and dead-letter retries.',
    tech: ['Python', 'FastAPI', 'Kafka', 'Kubernetes', 'Helm', 'PostgreSQL', 'Qdrant', 'Claude', 'Prometheus'],
  },
  {
    name: 'Clinical Trial Compliance RAG',
    url: 'https://github.com/chetanchandane/rag',
    description:
      'Production RAG over FDA/ICH regulatory documents with fully source-cited answers. HyDE, hybrid BM25/dense search, RRF fusion, and Cohere reranking lift Context Precision by 37% and Recall by 24%; a Ragas CI gate blocks regressing deploys.',
    tech: ['FastAPI', 'Claude', 'Qdrant', 'BM25', 'HyDE', 'Cohere Rerank', 'Ragas', 'LangSmith'],
  },
  {
    name: 'rag-data-plane: Multi-Tenant RAG on AWS',
    url: 'https://github.com/chetanchandane/rag-data-plane',
    status: 'Work in progress',
    description:
      'Work in progress. Multi-tenant RAG ingestion and retrieval API on AWS, where tenant and role isolation is enforced by Postgres row-level security. A CI leak matrix asks every eval question as six tenant and role personas and checks every returned chunk for cross-tenant canary tokens: 1,140 requests, 0 leaks. Ingestion runs through S3, SQS with a dead-letter queue, and idempotent Lambda workers. Resilience and load-testing slices are in progress.',
    tech: ['Python', 'FastAPI', 'AWS Lambda', 'S3', 'SQS', 'Neon Postgres', 'pgvector', 'Terraform', 'OpenTelemetry'],
  },
  {
    name: 'agent-gate: Regression Gate for LLM Agents',
    url: 'https://github.com/chetanchandane/agent-gate',
    description:
      "An improver LLM proposes edits to an agent's versioned policy files, and a deterministic gate accepts one only if it improves a dev set, breaks nothing in a protected safeguard set, holds on a hidden holdout set, and stays within cost and latency budgets. Dev pass rate rose from 80% to 94% and safeguards from 83% to 100%, while 6 candidate edits were rejected, including 3 deliberately bad hand-written policies. Runs as a GitHub Actions check on every policy PR.",
    tech: ['Python', 'LangGraph', 'Claude', 'OpenTelemetry', 'pytest', 'GitHub Actions'],
  },
  {
    name: 'TriageAI: Agentic Clinical Triage',
    url: 'https://github.com/chetanchandane/TriageAI',
    description:
      'Multi-agent system (cyclic LangGraph) that triages patient portal messages, grounding every decision in patient history and hospital policy. 100% safety recall and 84% fewer false positives than a keyword baseline across 189 labeled messages, traced over 640 LangSmith runs.',
    tech: ['LangGraph', 'Gemini 2.5 Pro', 'MCP', 'ChromaDB', 'Supabase', 'LangSmith'],
  },
  {
    name: 'NutriAI: Cloud-Native Nutrition Assistant',
    url: 'https://github.com/chetanchandane/cloud-native-aws-application',
    description:
      'Serverless nutrition platform that analyzes food images and calculates nutrients using React, AWS services, and GPT-4o, provisioned with Terraform.',
    tech: ['React', 'AWS Lambda', 'API Gateway', 'DynamoDB', 'Cognito', 'Rekognition', 'Terraform'],
  },
  {
    name: 'Git2Blog Agentic AI',
    url: 'https://github.com/chetanchandane/agentic-github2blog',
    description:
      'LangGraph pipeline that analyzes GitHub repos, generates technical blog posts, and publishes them to DEV.to.',
    tech: ['Python', 'FastAPI', 'LangGraph', 'OpenAI', 'GitHub API'],
  },
  {
    name: 'AWS SecureOps: Infrastructure Automation',
    url: 'https://github.com/chetanchandane/ansible-bash-terraform-automation',
    description:
      'One-command provisioning, configuration, and secret injection into a cloud VM using Terraform, Ansible, Bash, and a Flask mock vault.',
    tech: ['Terraform', 'Ansible', 'Bash', 'Flask', 'AWS EC2'],
  },
  {
    name: 'AWS Containerized Blog',
    url: 'https://github.com/chetanchandane/aws-ecr-docker',
    description:
      'Containerized WordPress and MySQL stack with a deployment pipeline through AWS Elastic Container Registry.',
    tech: ['Docker', 'WordPress', 'MySQL', 'AWS ECR'],
  },
  {
    name: 'Deep Learning Image Synthesis',
    url: 'https://github.com/chetanchandane/machine-learning-style-transfer',
    description: 'Neural Style Transfer with a VGG19 CNN in PyTorch.',
    tech: ['PyTorch', 'VGG19'],
  },
  {
    name: 'California Housing: KDD Analytics Pipeline',
    url: 'https://github.com/chetanchandane/CSCI-720-BDA-Project-G1',
    description:
      'End-to-end KDD process with spatial outlier detection (DBSCAN/LOF), clustering, and regression modeling.',
    tech: ['Python', 'scikit-learn', 'Pandas'],
  },
];

module.exports = { SITE_URL, person, projects };
