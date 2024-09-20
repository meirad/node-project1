# Business Card Management System

## Overview
A Node.js-based RESTful API for managing users and business cards with role-based access control.

## Technologies
- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT, bcryptjs
- **Validation**: Joi
- **Logging**: Morgan, Chalk

## API Endpoints

### User
- **Register**: `POST /users`
- **Login**: `POST /users/login`
- **Get All Users**: `GET /users` (Admin)
- **Get User**: `GET /users/:id` (Self/Admin)
- **Edit User**: `PUT /users/:id` (Self/Admin)
- **Delete User**: `DELETE /users/:id` (Self/Admin)

### Business Card
- **Get All Cards**: `GET /cards`
- **Get User Cards**: `GET /cards/my-cards` (User)
- **Create Card**: `POST /cards` (Business User)
- **Edit Card**: `PUT /cards/:id` (Creator)
- **Delete Card**: `DELETE /cards/:id` (Creator/Admin)

## Setup
1. Clone repository & install dependencies: `npm install`
3. Run: `npm start` (production).

## Additional Features
- **File Logging**: Log errors with status codes >= 400.

