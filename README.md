# 🏠 Household Service App v2

A full-stack household service booking and management platform that connects customers with service professionals through a structured, role-based workflow. The application is designed to simulate a real-world service ecosystem with asynchronous backend processing and scalable architecture.

---

## 📌 Overview

**Household Service App v2** allows users to discover and book household services such as plumbing, electrical work, cleaning, and repairs.  
The system supports multiple user roles, clear booking workflows, and background task execution to ensure responsiveness and reliability.

This project focuses strongly on **backend engineering, system design, workflow orchestration, and scalability**, rather than only UI.

---

## ✨ Key Features

### 👥 Multi-Role System

#### 👤 Customer
- Browse available household services  
- Create service booking requests  
- Track booking status and history  

#### 🧑‍🔧 Service Provider
- View assigned service requests  
- Accept or reject bookings  
- Update service progress and completion status  

#### 🛠️ Admin
- Manage users and services  
- Monitor platform activity and bookings  

---

## 🔁 Booking Workflow

1. Customer selects a service and submits a booking request  
2. Backend stores the request with an initial status  
3. Service provider reviews and responds to the request  
4. Booking status updates throughout the service lifecycle  

---

## ⚙️ Asynchronous Processing

- Background tasks (e.g., notifications, delayed operations) handled using **Celery**
- **Redis** used as a message broker
- Improves system responsiveness and scalability

---

## 🧠 Backend Architecture

- REST-based backend for authentication, business logic, and workflows  
- Clear separation of concerns between:
  - API routes
  - Database models
  - Background workers
- Easily extendable for new services and features

---

## 🛠️ Tech Stack

### Backend
- **Python**
- **Flask** – Backend framework
- **Celery** – Background task processing
- **Redis** – Message broker
- **SQL Database** – Persistent storage
- **REST APIs**

### Frontend
- HTML, CSS, JavaScript  
- Dynamic templates for user interaction  

### Tools & Practices
- Role-based access control  
- Modular and maintainable code structure  
- Asynchronous task queues  
- Scalable service-oriented design  

---


Household_service_app-v2/
│
├── backend/
│ ├── app.py # Main Flask application
│ ├── models.py # Database models
│ ├── routes/ # API routes
│ ├── celery_worker.py # Background task worker
│ └── requirements.txt
│
├── frontend/
│ ├── templates/ # HTML templates
│ └── static/ # CSS & JavaScript
│
├── README.md
└── .env.example


---

## 🚀 Getting Started

### Prerequisites
- Python 3.x  
- Redis  
- Virtual environment (recommended)

---

### Installation

#### Clone the repository
```bash
git clone https://github.com/saritakumari23/Household_service_app-v2.git
cd Household_service_app-v2

python -m venv venv
source venv/bin/activate     # Linux / macOS
venv\Scripts\activate        # Windows
pip install -r backend/requirements.txt
redis-server
python backend/app.py
celery -A backend.celery_worker worker --loglevel=info


📈 What This Project Demonstrates

Full-stack development with real-world service workflows

Multi-role access control and booking lifecycle management

Asynchronous backend task handling

Clean system design and modular architecture

Readiness for scaling into a production-grade platform

🌱 Future Improvements

Payment gateway integration

Real-time notifications (WebSockets)

Service provider rating & review system

Dockerization and cloud deployment


## 📂 Project Structure (High-Level)

