# Backend Server Documentation

This document explains the setup, architecture, and operation of the Node.js/Express backend for the group Code:<breakers> BSIT2b project.

## Routes Implemented
The API handles standard CRUD (Create, Read, Update, Delete) operations for users. All routes are prefixed with `/api/users`.

* **POST** `/api/users` 
  * Creates a new user in the database.
* **GET** `/api/users` 
  * Retrieves an array of all users currently saved in the database.
* **PUT** `/api/users/:id` 
  * Updates an existing user's information based on the ID passed in the URL.
* **DELETE** `/api/users/:id` 
  * Removes a specific user from the database based on the ID passed in the URL.

## Current Models
* **User Model** (`/models/User.js`)
  * This is a Mongoose Schema that defines the structure of the user documents stored in our MongoDB database. It maps incoming JSON data from our routes directly into database objects.

## Connection Setup
This server connects to a cloud-based MongoDB Atlas database. To set up the connection securely, you must configure your environment variables.

1. Create a file named exactly `.env` inside the `/backend` folder.
2. Add the following configuration to the file 
   ```env
   MONGO_URI=mongodb+srv://miscyrubio:mirandarubio06@it112websys.f1zk0pb.mongodb.net/
   PORT=5000