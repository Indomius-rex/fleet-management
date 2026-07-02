<<<<<<< HEAD
# Fleet Management System

A Fleet Management System built using Node.js, Express.js, MongoDB, JWT Authentication, and React.

## Features

### Authentication
- User Registration
- User Login
- JWT Authentication
- Password Hashing using bcrypt
- Protected Routes

### Vehicle Management
- Create Vehicle
- View Vehicles
- Update Vehicle
- Delete Vehicle

### Search, Sorting & Pagination
- Search by Make
- Search by Model
- Search by Color
- Search by VIN
- Sort Vehicles
- Paginated Results

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs

### Frontend
- React
- Vite
- Tailwind CSS
- Axios

## Installation

### Clone Repository

```bash
git clone <repository-url>
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

## Environment Variables

Create a `.env` file inside backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

## Test User

Email:

```text
admin@test.com
```

Password:

```text
123456
```

## Sample API Endpoints

### Register

POST

```text
/api/auth/register
```

### Login

POST

```text
/api/auth/login
```

### Vehicles

```text
GET    /api/vehicles
POST   /api/vehicles
PUT    /api/vehicles/:id
DELETE /api/vehicles/:id
```
![alt text](image.png)
## Screenshots

Screenshots are available in the screenshots folder.

## Author

Mustafa
=======
# fleet-management
>>>>>>> 957ac419f96e96438d2b8b996b223269296f5cb2
