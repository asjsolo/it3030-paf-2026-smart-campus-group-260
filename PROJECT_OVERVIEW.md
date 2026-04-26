# Project Overview: Smart Campus System

## Purpose
This project is a Smart Campus System designed to streamline the reporting and management of campus-related incidents and resources. It provides a platform for users (such as students and staff) to report issues (e.g., hardware, network, facilities), attach images, and communicate with campus staff for resolution.

## Main Components

### Backend (Java, Spring Boot)
- **Incident Ticket Management:** Users can create, view, and update incident tickets describing campus issues.
- **Comments:** Users and staff can add comments to tickets for communication and updates.
- **Attachments:** Users can upload images or files related to a ticket (e.g., photos of broken equipment).
- **RESTful API:** Exposes endpoints for the frontend to interact with tickets, comments, and attachments.
- **Database Integration:** Uses JPA for data persistence (MySQL connector included).

### Frontend (React + Vite)
- **User Interface:** Provides a web interface for users to submit tickets, view status, and interact with staff.
- **Routing:** Uses React Router for navigation between different modules/pages.
- **Planned Features:** Modular structure for future expansion (e.g., more resource management, dashboards).

## How It Works
1. **User submits a ticket** describing an issue, optionally attaching images.
2. **Staff can view, update, and resolve tickets**, adding comments and resolution notes.
3. **All interactions** (tickets, comments, attachments) are managed via REST API endpoints.

## Technologies Used
- **Backend:** Java 21, Spring Boot, Spring Data JPA, MySQL
- **Frontend:** React, Vite, JavaScript, ESLint

## Intended Users
- Campus students, staff, and administrators seeking to efficiently report, track, and resolve campus issues.

---
*This file was generated automatically to summarize the codebase as of April 2026.*
