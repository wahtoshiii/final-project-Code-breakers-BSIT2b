# Campus Service Hub | Final Project

## Team Information
* Group: Code:<Breakers> 
* Course & Section: BSIT-2B

---

## Project Description
This repository contains the full-stack system for the CAMPUS SERVICE HUB, a centralized digital platform designed to streamline campus services and student interactions. 

The project demonstrates a comprehensive ecosystem designed to manage campus operations, featuring:
- Secure role-based access for standard users, admins, and system owners
- A fully integrated order and product management system with full CRUD capabilities
- Integrated real-time chat functionality
- Interactive map features for campus navigation
- Responsive, intuitive user interfaces tailored for different user roles

---

## Key Features

### Complete Order & Product Management (CRUD)
A robust module where students can explore available services/items, add them to their cart, and track order statuses (`cart.html`, `order-status.html`). The system provides Admins and Owners with dedicated tools to manage product listings, update inventory, and handle fulfillments (`manage-products.html`).

### Campus Mapping & Navigation
Integrated map functionalities (`maps.html`, `maps.js`) to provide users with spatial awareness and navigation assistance across the campus.

### Integrated Chat System
A built-in chat interface (`chat.html`, `chat.js`) designed to provide instant communication, support, and engagement within the campus hub.

### Multi-Role Dashboards
Distinct, secure routing and dashboard environments tailored specifically for:
* Students/Users: Browsing, profiling, and ordering (`dashboard.html`, `explore.html`, `profile.html`)
* Admins: Operational management and oversight (`admin-dashboard.html`)
* Owners: High-level system control and analytics (`owner-dashboard.html`)

---

## System Architecture & Planning
The system was meticulously planned before development, with core documentation located in the `docs/planning/` directory:
* Data Flow Diagram (DFD)
* Entity Relationship Diagram (ERD)
* Use Case Diagram

---

## Tools & Technologies Used
* Frontend: HTML5, CSS3, JavaScript (Vanilla API integration and DOM manipulation)
* Backend: Node.js, Express.js (`server.js`)
* Database: MongoDB (with initialization via `seedUser.js`)
* Environment Management: `dotenv` (`.env`)
* Architecture: Client-Server architecture utilizing RESTful APIs

---

## Notes
This system serves as the final full-stack project of the Code:<Breakers> group, demonstrating complete integration from database modeling and server-side logic to dynamic frontend user experiences.