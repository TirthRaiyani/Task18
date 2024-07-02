# My Node.js Application

## Overview

This is a Node.js application using the following technologies and frameworks:
- Express.js for the server
- MongoDB for the database
- Mongoose for object data modeling (ODM)
- JWT for authentication
- Bcrypt for password hashing
- Jest for testing

## Requirements

### User Authentication
- User registration with hashed passwords
- User login with JWT authentication
- Protected routes with JWT middleware
- User roles (Admin and User)
- Only admins can create, update, and delete products

### Product Management
- CRUD (Create, Read, Update, Delete) operations for products
- Products should have a name, description, price, and quantity

## API Endpoints

### Authentication

#### Register User
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "userName": "string",
    "password": "string",
    "isAdmin": "number" // 1 for admin, 2 for user
  }
