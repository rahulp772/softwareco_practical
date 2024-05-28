# User and Role Management API

This Node.js application provides APIs for managing users and roles, including CRUD operations, login, signup, and various functionalities related to user and role management.

## Installation

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies: npm install
4. Set up environment variables as needed

## Usage
Start the server: npm start

Access the APIs using a tool like Postman or a web browser.

## Modules

### Role Module

The Role module includes the following fields:

- `roleName`: String (Name of the role)
- `accessModules`: Array of Strings (List of modules that can be accessed by the role)
- `createdAt`: Timestamp (Date and time when the role was created)
- `active`: Boolean (Status of the role - active or inactive)

### User Module

The User module includes basic user details and a reference to the Role module:

- `firstName`: String (First name of the user)
- `lastName`: String (Last name of the user)
- `email`: String (Email address of the user)
- `password`: String (Password of the user)
- `role`: ObjectId (Reference to the Role module)
- `createdAt`: Timestamp (Date and time when the user was created)
- `updatedAt`: Timestamp (Date and time when the user was last updated)

## API Endpoints

### User Endpoints

- `POST /api/auth/register`: Create a new user
- `POST /api/auth/login`: Authenticate user and generate access token
- `GET /api/users?search=&limit=10&page=1`: Get a list of users
- `PUT /api/users/:id`: Update a user (this route will be accessible with admin and superadmin role)
- `DELETE /api/users/:id`: Delete a user (this route will be accessible with admin and superadmin role)

### Role Endpoints

- `GET /api/roles`: Get a list of roles
- `POST /api/roles/create`: Create a new role (this route will be accessible with superadmin role only)
- `PUT /api/roles/:id`: Update a role (this route will be accessible with superadmin role only)
- `DELETE /api/roles/:id`: Delete a role (this route will be accessible with superadmin role only)

### Check User Access

- `GET /api/users/checkAccess`: Check whether a user has access to a particular module

### Update Users in Bulk

- `POST /api/users/bulkUpdate`: Update many users with the same data (this route will be accessible with admin and superadmin role)

### Update Users with Different Data

- `POST /api/users/bulkUpdateCustom`: Update many users with different data (this route will be accessible with admin and superadmin role)
