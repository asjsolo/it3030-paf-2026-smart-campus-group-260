# Core Features: Smart Campus System

This document outlines the core features and minimum requirements for the Smart Campus System project. Use this as a reference for development, documentation, or onboarding.

---

## Module A – Facilities & Assets Catalogue
- Maintain a catalogue of bookable resources: lecture halls, labs, meeting rooms, and equipment (projectors, cameras, etc.).
- Each resource includes key metadata: type, capacity, location, availability windows, and status (ACTIVE / OUT_OF_SERVICE).
- Support search and filtering (e.g., by type, capacity, and location).

## Module B – Booking Management
- Users can request a booking for a resource by providing date, time range, purpose, and expected attendees (where applicable).
- Bookings follow a workflow: **PENDING → APPROVED/REJECTED**. Approved bookings can later be **CANCELLED**.
- The system prevents scheduling conflicts for the same resource (overlapping time ranges).
- Admin users can review, approve, or reject booking requests with a reason.
- Users can view their own bookings; Admin can view all bookings (with filters).

## Module C – Maintenance & Incident Ticketing
- Users can create incident tickets for a specific resource/location with category, description, priority, and preferred contact details.
- Tickets can include up to 3 image attachments (evidence such as a damaged projector or error screen).
- Ticket workflow: **OPEN → IN_PROGRESS → RESOLVED → CLOSED** (Admin may also set **REJECTED** with reason).
- A technician (or staff member) can be assigned to a ticket and can update status and add resolution notes.
- Users and staff can add comments; comment ownership rules must be implemented (edit/delete as appropriate).

## Module D – Notifications
- Users receive notifications for booking approval/rejection, ticket status changes, and new comments on their tickets.
- Notifications are accessible through the web UI (e.g., notification panel).

## Module E – Authentication & Authorization
- Implement OAuth 2.0 login (e.g., Google sign-in).
- At minimum, support roles: **USER** and **ADMIN**. (Optional: TECHNICIAN / MANAGER for better design.)
- Secure endpoints using role-based access control and protect the front-end routes accordingly.

---
*This file summarizes the minimum requirements for the Smart Campus System as of April 2026.*
