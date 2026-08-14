# CacheFlow

CacheFlow is a full-stack personal finance application designed to manage income, expenses, dashboard summaries, and financial reporting. The system follows a modular client-server architecture, with React as the frontend interface and Node.js with Express as the backend API layer.

## Project Summary

This project demonstrates a practical implementation of a finance management dashboard with secure user authentication, protected API routes, data persistence, and a responsive user experience. It is built to track daily financial transactions, surface key insights through aggregated dashboard data, and support exportable financial reports.

## Architecture Overview

### Frontend
- React + Vite for fast client-side rendering and build optimization
- Component-based UI architecture
- React Router for route-based navigation
- Axios for API communication
- Environment-based configuration using `VITE_API_BASE_URL`

### Backend
- Node.js with Express for REST API development
- MongoDB with Mongoose for data modeling and persistence
- JWT-based authentication middleware for protected endpoints
- CORS configuration for client-server communication
- Multer-based upload handling for profile images
- XLSX integration for Excel report generation

## Core Features

- Secure user signup and login flows
- JWT authentication and route protection
- Income tracking and management
- Expense tracking and management
- Dashboard analytics for financial overview
- Recent transaction listing
- Profile image upload support
- Excel download for financial records
- Responsive dashboard UI for day-to-day financial management

## Folder Structure

```text
CacheFlow/
├── BACKEND/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── .env
│   ├── package.json
│   ├── server.js
│   └── ...
├── FRONTEND/
│   ├── public/
│   ├── src/
│   ├── .env
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── ...
├── .gitignore
├── README.md
└── ...
```

## Tech Stack

### Frontend Stack
- React
- Vite
- JavaScript
- Axios
- React Router DOM
- Tailwind CSS
- ESLint

### Backend Stack
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- multer
- dotenv
- xlsx

## Security and Authentication

The application uses JSON Web Tokens for user authentication. Protected routes are enforced through middleware that verifies the bearer token and retrieves the authenticated user from the database before allowing access to protected resources.

Key security practices implemented in the project include:
- Password hashing with `bcryptjs`
- JWT verification on secured endpoints
- Roleless but protected personal-user-based access model
- Environment-based configuration for secrets and connection strings

## Environment Configuration

### Backend `.env`

```env
PORT=8000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/cacheflow
JWT_SECRET=your_secure_jwt_secret
CLIENT_URL=http://localhost:5173
```

### Frontend `.env`

```env
VITE_API_BASE_URL=http://localhost:8000
```

## Local Development Setup

### Prerequisites
- Node.js v18+
- npm or yarn
- MongoDB instance or MongoDB Atlas database

### 1. Clone the project

```bash
git clone <repository-url>
cd CacheFlow
```

### 2. Install backend dependencies

```bash
cd BACKEND
npm install
```

### 3. Install frontend dependencies

```bash
cd ../FRONTEND
npm install
```

### 4. Run the backend server

```bash
cd ../BACKEND
npm start
```

### 5. Run the frontend application

```bash
cd ../FRONTEND
npm run dev
```

The frontend should be available at:

```text
http://localhost:5173
```

The backend API should be available at:

```text
http://localhost:8000
```

## Available Scripts

### Backend

```bash
npm start
npm run dev
```

### Frontend

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Deployment Architecture

This project is designed to be deployed as a decoupled full-stack application:

- Frontend: Vercel
- Backend API: Render / Railway / DigitalOcean / any Node.js hosting platform
- Database: MongoDB Atlas

### Production Environment Variables

#### Frontend
```env
VITE_API_BASE_URL=https://your-backend-domain.com
```

#### Backend
```env
PORT=10000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/cacheflow
JWT_SECRET=your_production_secret
CLIENT_URL=https://your-frontend-domain.com
```

## API Responsibilities

The backend includes endpoint groups for:

- Authentication (`/api/v1/auth`)
- Income (`/api/v1/income`)
- Expenses (`/api/v1/expense`)
- Dashboard summary (`/api/v1/dashboard`)

These endpoints support CRUD-style operations for personal financial data and the associated reporting workflows.

## Data Model Highlights

The application uses MongoDB collections such as:
- `User`
- `Income`
- `Expense`

The `User` model stores personal information and hashed passwords, while the income and expense models support transaction tracking and aggregation for dashboard analytics.

## Operational Notes

- Sensitive values are stored in environment variables instead of hardcoded configuration.
- The backend includes graceful handling for malformed JSON requests.
- Static upload files are served from the `uploads` directory.
- Frontend API requests are centralized via a reusable Axios instance.

## Potential Improvements

- Add recurring transaction support
- Add category-based analytics and filters
- Implement dashboard charts with richer insights
- Add pagination and search for large transaction datasets
- Add unit and integration testing
- Add CI/CD pipelines for automated validation and deployment

## License

This project is licensed under the MIT License.

## Author

Built as a full-stack personal finance tracking application.

## Contact

For collaboration or technical inquiries, please contact the repository owner or use the project’s GitHub issue tracker.
