# MERN Task Manager

A full-stack **MERN (MongoDB, Express.js, React.js, Node.js) Task
Manager** application with user authentication, protected routes, task
CRUD operations, form validation, JWT-based authentication, Redux state
management, and responsive UI built with Tailwind CSS.

# 🚀 Features

# User Features

-   User Signup
-   User Login
-   User Logout
-   JWT-based authentication
-   Protected routes
-   Add tasks
-   View tasks
-   Edit/update tasks
-   Delete tasks
-   View user profile
-   Search/filter tasks
-   Redirect users appropriately after authentication

# Developer Features

-   React Hooks and custom `useFetch` hook
-   Redux and Redux Thunk for global authentication state
-   Axios API client
-   Frontend and backend validation
-   Toast notifications for success/error messages
-   JWT authentication middleware
-   Password hashing with bcrypt
-   MongoDB database with Mongoose
-   Express REST APIs
-   Responsive UI using Tailwind CSS
-   Custom loaders and tooltips
-   404 page for invalid routes
-   Production build support

------------------------------------------------------------------------

## 🛠️ Tech Stack

  Layer               Technology
  ------------------- -----------------------
  Frontend            React.js 18
  Styling             Tailwind CSS
  State Management    Redux, Redux Thunk
  HTTP Client         Axios
  Backend             Node.js, Express.js
  Database            MongoDB
  ODM                 Mongoose
  Authentication      JWT
  Password Security   bcrypt
  Notifications       React Toastify
  Development         Nodemon, Concurrently

------------------------------------------------------------------------

## 📁 Project Structure

``` text
Task-Manager/
│
├── backend/
│   ├── controllers/
│   │   ├── authControllers.js
│   │   ├── profileControllers.js
│   │   └── taskControllers.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── profileRoutes.js
│   │   └── taskRoutes.js
│   │
│   ├── middlewares.js/
│   │   └── index.js
│   │
│   ├── utils/
│   │   ├── token.js
│   │   └── validation.js
│   │
│   ├── app.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── validations/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── index.js
│   │
│   └── package.json
│
├── package.json
├── package-lock.json
└── README.md
```

------------------------------------------------------------------------

## ✅ Prerequisites

Make sure the following are installed:

-   Node.js
-   npm
-   MongoDB
-   Git
-   VS Code or another code editor

Check Node.js and npm:

``` bash
node -v
npm -v
```

Check MongoDB:

``` bash
mongosh
```

If MongoDB is installed through Homebrew on macOS:

``` bash
brew services start mongodb-community
```

------------------------------------------------------------------------

## ⚙️ Installation

### 1. Clone the repository

``` bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd Task-Manager
```

### 2. Install all dependencies

From the project root:

``` bash
npm run install-all
```

This installs dependencies for:

-   Root project
-   Frontend
-   Backend

------------------------------------------------------------------------

## 🔐 Environment Variables

Create:

``` text
backend/.env
```

Add your own environment variables.

Example:

``` env
MONGODB_URL=mongodb://127.0.0.1:27017/task-manager
ACCESS_TOKEN_SECRET=your_secure_secret_key
PORT=5001
```

### Important

Do **not** commit `.env` to GitHub.

Your `.env` file may contain passwords, database credentials, JWT
secrets, or other private information.

------------------------------------------------------------------------

## ▶️ Run the Application

From the project root:

``` bash
npm run dev
```

This starts both:

-   React frontend
-   Express backend

### Frontend

``` text
http://localhost:3000
```

### Backend

``` text
http://localhost:5001
```

### MongoDB

``` text
mongodb://127.0.0.1:27017
```

When everything is working, the backend terminal should show:

``` text
Backend is running on port 5001
Mongodb connected...
```

and the frontend should show:

``` text
Compiled successfully!
```

------------------------------------------------------------------------

## 🔌 API Configuration

The frontend Axios client is configured in:

``` text
frontend/src/api/index.jsx
```

Current configuration:

``` javascript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api",
});

export default api;
```

This means API requests such as:

``` text
/auth/signup
```

are sent to:

``` text
http://localhost:5001/api/auth/signup
```

------------------------------------------------------------------------

## 🔗 Backend API Endpoints

### Authentication

  Method   Endpoint             Description
  -------- -------------------- -------------------
  POST     `/api/auth/signup`   Create a new user
  POST     `/api/auth/login`    Login user

### Tasks

  Method   Endpoint               Description
  -------- ---------------------- ---------------------
  GET      `/api/tasks`           Get user's tasks
  GET      `/api/tasks/:taskId`   Get a specific task
  POST     `/api/tasks`           Create a task
  PUT      `/api/tasks/:taskId`   Update a task
  DELETE   `/api/tasks/:taskId`   Delete a task

### Profile

  Method   Endpoint         Description
  -------- ---------------- ----------------------------------
  GET      `/api/profile`   Get authenticated user's profile

Protected endpoints require a valid JWT in the request authorization
header.

------------------------------------------------------------------------

## 🖥️ Frontend Routes

  Route              Description
  ------------------ -------------------
  `/`                Home / dashboard
  `/signup`          User registration
  `/login`           User login
  `/tasks/add`       Add a new task
  `/tasks/:taskId`   Edit a task

------------------------------------------------------------------------


## 🧩 Authentication Flow

``` text
User
 │
 ├── Signup
 │     ↓
 │   POST /api/auth/signup
 │     ↓
 │   Express Controller
 │     ↓
 │   Password hashed with bcrypt
 │     ↓
 │   User stored in MongoDB
 │
 └── Login
       ↓
     POST /api/auth/login
       ↓
     Credentials verified
       ↓
     JWT generated
       ↓
     Token stored/used by frontend
       ↓
     Protected API requests
       ↓
     JWT middleware verifies token
```