# Campus Service Hub | Final Project

## Team Information & Contributions
* **Group:** Code:Breakers 
* **Course & Section:** BSIT-2B

### Members & Roles
* **Joshua Olarcos:** Project Manager
  * *Contribution:* Oversaw overall project development, delegated tasks, managed the team workflow, and assisted with backend architecture and integration.
* **Grace Ann Carilla:** Backend 
  * *Contribution:* Spearheaded server-side logic, routing using Node.js and Express.js, and established the RESTful API endpoints.
* **Jasmine Escala:** Frontend 
  * *Contribution:* Designed and developed the responsive, user-friendly interfaces and multi-role dashboards using HTML5, CSS3, and JavaScript.
* **Reyson:** Database Manager
  * *Contribution:* Managed MongoDB database modeling, schema creation, data relationships, and system initialization (via `seedUser.js`).
* **Lance:** GitHub Manager
  * *Contribution:* Handled version control, repository organization, branch merging, and oversaw the deployment process to Render.
* **Ansherina Rabino:** Tester
  * *Contribution:* Conducted rigorous Quality Assurance (QA) testing of the system's CRUD functionalities, secure routing, and cross-device responsiveness.

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

## Project Links & Materials
* **Live Deployment URL:** [Campus Service Hub on Render](https://final-project-code-breakers-bsit2b-v8yt.onrender.com)
* **Presentation:** [INSERT LINK TO YOUR POWERPOINT/PDF PRESENTATION HERE]
* **Documentation:** This README file serves as the primary technical documentation for the system.

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

## Installation & Setup (How to Clone)

To clone and run this project locally, follow these steps:

1. **Clone the repository:**
   Open your terminal and run the following command:
   ```bash
   git clone [INSERT YOUR REPOSITORY URL HERE]
   
Navigate to the project directory:

Bash
cd final-project-Code-breakers-BSIT2b


3. **Install dependencies:**
   Ensure you have Node.js installed, then run:
   ```bash
   npm install
   
Environment Variables:
Create a .env file in the root directory and add the necessary environment variables (e.g., your MongoDB connection string and Port number).

Database Initialization:
Run the provided seed script to initialize the database with default users/data:

Bash
node seedUser.js
Start the server:

Bash
node server.js

   The application will now be running on your local host (usually `http://localhost:3000` or whichever port is defined in your `.env`).

---

## Notes
This system serves as the final full-stack project of the Code:<Breakers> group, d
