🏠 Household Service App v2

A full-stack household service booking and management platform that connects customers with service professionals through a structured, role-based workflow. The system supports service discovery, bookings, status tracking, and asynchronous background processing.

📌 Overview

The Household Service App enables users to book household services such as plumbing, electrical work, cleaning, and repairs. It is designed with multiple user roles, clear service workflows, and asynchronous backend processing to simulate a real-world service platform.

This project focuses on backend engineering, system design, and workflow orchestration, rather than just UI.

✨ Key Features
👥 Multi-Role System

Customer

Browse available services

Create service requests

Track booking history and status

Service Provider

View assigned bookings

Accept or reject service requests

Update service completion status

Admin

Manage users and services

Monitor system activity and bookings

🔁 Booking Workflow

Customer selects a service and submits a booking request

Backend stores request with initial status

Service provider responds to the request

Booking status updates throughout the service lifecycle

⚙️ Asynchronous Processing

Background tasks (such as notifications or delayed processing) handled using Celery

Redis used as a message broker

Improves responsiveness and scalability of the application

🧠 Backend Architecture

REST-based backend handling authentication, business logic, and workflows

Clear separation of concerns between API routes, database models, and background workers

Designed to be easily extendable for new services and features

🛠️ Tech Stack
Backend

Python

Flask – backend framework

Celery – background task processing

Redis – message broker

SQL Database – persistent storage

REST APIs

Frontend

HTML, CSS, JavaScript

Dynamic templates for user interaction

Tools & Practices

Role-based access control

Modular code structure

Asynchronous task queues

Scalable service design

📂 Project Structure (High-Level)
Household_service_app-v2/
│
├── backend/
│   ├── app.py              # Main Flask application
│   ├── models.py           # Database models
│   ├── routes/             # API routes
│   ├── celery_worker.py    # Background task worker
│   └── requirements.txt
│
├── frontend/
│   ├── templates/          # HTML templates
│   ├── static/             # CSS & JavaScript
│
├── README.md
└── .env.example

🚀 Getting Started
Prerequisites

Python 3.x

Redis

Virtual environment (recommended)

Installation
# Clone the repository
git clone https://github.com/saritakumari23/Household_service_app-v2.git
cd Household_service_app-v2

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r backend/requirements.txt

Run the Application
# Start Redis server
redis-server

# Start Flask backend
python backend/app.py

# Start Celery worker
celery -A backend.celery_worker worker --loglevel=info

📈 What This Project Demonstrates

Full-stack development with real-world workflows

Multi-role access control and booking logic

Asynchronous backend task handling

Clean system design and modular architecture

Readiness for scaling into a production service platform

🌱 Future Improvements

Payment gateway integration

Real-time notifications

Service provider rating & review system

Deployment with Docker & cloud services
