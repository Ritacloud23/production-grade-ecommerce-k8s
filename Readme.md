## Production-Grade E-Commerce App (K8s + CI/CD)
# Overview

This project demonstrates a production-style DevOps workflow for a containerized e-commerce backend deployed using Kubernetes and automated with GitHub Actions.

It includes:

Dockerized Node.js backend

GitHub Actions CI pipeline

Docker Hub image publishing

Kubernetes deployment manifests

Minikube local cluster testing

# Architecture

GitHub → GitHub Actions → Docker Hub → Kubernetes (Minikube)

Developer Push
      ↓
GitHub Actions CI
      ↓
Docker Image Build
      ↓
Push to Docker Hub
      ↓
Kubernetes Deployment
# Docker

Backend image:

nnedigital/ecommerce-backend:latest

Built automatically on every push to main.

# CI Pipeline

Workflow location:

.github/workflows/docker-build.yml

Pipeline steps:

Checkout code

Login to Docker Hub (via secrets)

Build backend image

Push image to Docker Hub

☸ Kubernetes Deployment

Kubernetes manifests located in:

k8s/

Includes:

backend-deployment.yaml

backend-service.yaml

db-deployment.yaml

db-service.yaml

Deploy with:

kubectl apply -f k8s/
# Local Testing (Minikube)

Start cluster:

minikube start

Deploy resources:

kubectl apply -f k8s/

Check pods:

kubectl get pods

Expose service:

minikube service backend-service
# Security Practices

.env excluded from Git

Docker secrets handled via GitHub Secrets

imagePullPolicy: Always

CI-based image publishing

# What This Project Demonstrates

CI automation

Containerization

Image versioning

Kubernetes deployments

DevOps debugging

Production-style workflow design

# Future Improvements

Add CD (auto-deploy after build)

Add Helm chart

Add Ingress + TLS

Add monitoring (Prometheus + Grafana)

Add image tagging strategy (v1, v2)