"""
Portfolio Knowledge Base
This file contains comprehensive information about the developer's skills, experience, and projects.
Used by the RAG chatbot to answer questions.
"""

PORTFOLIO_KNOWLEDGE = """
# Developer Profile

## About
A highly skilled full-stack developer and software architect specializing in modern web technologies, distributed systems, blockchain development, and AI/ML integration.

## Technical Skills

### Frontend Development
- React.js, Next.js 14, TypeScript, JavaScript
- TailwindCSS, GSAP animations
- Responsive design and modern UI patterns

### Backend Development
- Python (FastAPI, Flask)
- Node.js, Go, Rust
- RESTful APIs, WebSockets

### Blockchain & Web3
- Solidity, Ethereum, DeFi protocols
- Web3.js, Ethers.js
- Smart contract development

### Databases & Infrastructure
- PostgreSQL, MongoDB, Redis, Supabase
- Kafka message queuing
- Docker, CI/CD pipelines

### AI & Machine Learning
- OpenAI GPT integration
- Ollama and RAG systems
- LangChain

## Current Active Project

### E-commerce Scaling & UI Revamp for "EcoStride"
- Role: Lead Architect
- Stack: Next.js 14, TailwindCSS, Go microservices
- Status: Active Development (Sprint 4 of 8)
- Achievement: Improved page load speeds by 40%
- Deadline: Q2 2026

### Flo - Financial Management Platform
- Stack: Next.js 14, TypeScript, FastAPI, Python, Supabase
- Features: Transaction tracking, AI insights, budget management, warranty tracking
- AI Integration: OpenAI for insights, Ollama for RAG chatbot

## Completed Projects

### 1. Distributed Logging Pipeline
- Stack: Rust, Kafka, PostgreSQL
- Capability: 5 million events per second
- Status: Completed

### 2. DeFi Yield Aggregator
- Stack: Solidity, Web3.js, React
- Features: Automated yield optimization across Aave and Compound
- Status: Completed

### 3. Internal Auth Service
- Stack: Go, gRPC, Redis
- Features: SSO for 10+ microservices
- Status: Maintenance

## Key Technologies
TypeScript, Python, JavaScript, Go, Rust, Solidity, React, Next.js, TailwindCSS, FastAPI, PostgreSQL, Redis, Kafka, Docker, Ethereum, Web3.js, OpenAI, Ollama

## Professional Qualities
- Strong problem-solving abilities
- Quick learner and adaptable
- Experience with distributed systems and scalability
- Passionate about blockchain and AI/ML integration
"""

def get_knowledge_base() -> str:
    """Returns the portfolio knowledge base as a string."""
    return PORTFOLIO_KNOWLEDGE
