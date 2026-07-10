# 🏨 Hotel Booking API

A production-style REST API for managing hotel room bookings, built with **Node.js**, **Express**, **TypeScript**, and **PostgreSQL**.

## 🚀 Live Demo

> API Base URL: `http://localhost:5000`
> API Docs: `http://localhost:5000/api-docs`

---

## 📌 Features

- ✅ JWT Authentication with bcrypt password hashing
- ✅ Role-based access control (Admin / User)
- ✅ Full CRUD for Rooms, User, Guests, and Bookings
- ✅ Database transactions for booking logic
- ✅ Runtime validation with Zod
- ✅ Pagination and filtering on list endpoints
- ✅ Aggregate stats (revenue, occupancy rate, top room type)
- ✅ Centralized error handling with custom AppError class
- ✅ Request logging with Morgan
- ✅ Security headers with Helmet
- ✅ CORS configuration
- ✅ Rate limiting (100 requests / 15 min per IP)
- ✅ Interactive API documentation with Swagger

---

## 🛠️ Tech Stack

| Layer         | Technology                       |
| ------------- | -------------------------------- |
| Runtime       | Node.js                          |
| Framework     | Express.js                       |
| Language      | TypeScript                       |
| Database      | PostgreSQL                       |
| Auth          | JWT + bcrypt                     |
| Validation    | Zod                              |
| Documentation | Swagger UI                       |
| Security      | Helmet, CORS, express-rate-limit |
| Logging       | Morgan                           |

---

## 📂 Project Structure

```text
hotel-booking-api/
│
├── src/
│   ├── config/
│   │   ├── swagger.ts
|   |   └── db.ts
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── rooms.controller.ts
│   │   ├── guests.controller.ts
│   │   ├── bookings.controller.ts
│   │   ├── stats.controller.ts
│   │   └── contacts.controller.ts
│   │
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── validate.ts
│   │   └── errorHandler.ts
│   │
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── rooms.routes.ts
│   │   ├── guests.routes.ts
│   │   ├── bookings.routes.ts
│  │    ├── contacts.routes.ts
│   │   └── stats.routes.ts
│   │
│   ├── schemas/
│   │   ├── auth.schema.ts
│   │   ├── rooms.schema.ts
│   │   ├── guests.schema.ts
│   │  ├── guests.schema.ts
│   │   └── bookings.schema.ts
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   ├── utils/
│   │   ├── AppError.ts
│   │   └── pagination.ts
│   │
│   └── index.ts
│
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/hotel-booking-api.git
cd hotel-booking-api

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the root directory:
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=yourpassword
DB_NAME=hotel_booking
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
PORT=5000
CLIENT_URL=http://localhost:5173

### Database Setup

Run these SQL commands in PostgreSQL:

```sql
CREATE TABLE users (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100)  NOT NULL,
  email      VARCHAR(100)  NOT NULL UNIQUE,
  password   VARCHAR(255)  NOT NULL,
  role       VARCHAR(20)   NOT NULL DEFAULT 'user',
  created_at TIMESTAMP     DEFAULT NOW()
);

CREATE TABLE rooms (
  id           SERIAL PRIMARY KEY,
  room_number  VARCHAR(10)    NOT NULL UNIQUE,
  type         VARCHAR(50)    NOT NULL,
  price        DECIMAL(10,2)  NOT NULL,
  is_available BOOLEAN        NOT NULL DEFAULT true
);

CREATE TABLE guests (
  id    SERIAL PRIMARY KEY,
  name  VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(20)  NOT NULL
  user_id     INTEGER      NOT NULL REFERENCES users(id),
);

CREATE TABLE bookings (
  id          SERIAL PRIMARY KEY,
  room_id     INTEGER      NOT NULL REFERENCES rooms(id),
  guest_id    INTEGER      NOT NULL REFERENCES guests(id),
  check_in    DATE         NOT NULL,
  check_out   DATE         NOT NULL,
  total_price DECIMAL(10,2),
  status      VARCHAR(20)  NOT NULL DEFAULT 'confirmed'
);

CREATE TABLE contacts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(250),
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

```

### Run the Project

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start
```

---

## 📡 API Endpoints

### Auth

| Method | Endpoint             | Description         | Auth   |
| ------ | -------------------- | ------------------- | ------ |
| POST   | `/auth/register`     | Register new user   | Public |
| POST   | `/auth/login`        | Login and get token | Public |
| POST   | `/auth/:id/password` | update and get data | User   |

### Rooms

| Method | Endpoint           | Description               | Auth   |
| ------ | ------------------ | ------------------------- | ------ |
| GET    | `/rooms`           | Get all rooms (paginated) | Public |
| GET    | `/rooms/available` | Get available rooms       | Public |
| GET    | `/rooms/:id`       | Get room by ID            | Public |
| POST   | `/rooms`           | Create new room           | Admin  |
| PUT    | `/rooms/:id`       | Update room               | Admin  |
| DELETE | `/rooms/:id`       | Delete room               | Admin  |

### Guests

| Method | Endpoint      | Description                | Auth |
| ------ | ------------- | -------------------------- | ---- |
| GET    | `/guests`     | Get all guests (paginated) | User |
| GET    | `/guests/:id` | Get guest by ID            | User |
| POST   | `/guests`     | Register new guest         | User |
| PUT    | `/guests/:id` | Update guest               | User |
| DELETE | `/guests/:id` | Delete guest               | User |

### Contacts

| Method | Endpoint        | Description      | Auth  |
| ------ | --------------- | ---------------- | ----- |
| GET    | `/contacts`     | Get all contacts | admin |
| DELETE | `/contacts/:id` | Delete contacts  | admin |

### Bookings

| Method | Endpoint                   | Description Auth             |
| ------ | -------------------------- | ---------------------------- | ---- |
| GET    | `/bookings`                | Get all bookings (paginated) | User |
| GET    | `/bookings/:id`            | Get booking by ID            | User |
| GET    | `/bookings/guest/:guestId` | Get bookings by guest        | User |
| POST   | `/bookings`                | Create booking               | User |
| PUT    | `/bookings/:id/cancel`     | Cancel booking               | User |

### Stats

| Method | Endpoint | Description         | Auth  |
| ------ | -------- | ------------------- | ----- |
| GET    | `/stats` | Get dashboard stats | Admin |

### Health Check

| Method | Endpoint  | Description          |
| ------ | --------- | -------------------- |
| GET    | `/health` | Server health status |

---

## 🔐 Authentication

This API uses **JWT Bearer Token** authentication.

**Register and login to get your token:**

```bash
POST /auth/login
{
  "email": "dammar@email.com",
  "password": "123456"
}
```

**Use the token in all protected requests:**

**To get admin access — update role in database:**

```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

---

## 📊 Stats Response Example

```json
{
  "success": true,
  "message": "Stats fetched successfully!",
  "data": {
    "totalRooms": 20,
    "availableRooms": 14,
    "occupiedRooms": 6,
    "totalGuests": 50,
    "totalBookings": 36,
    "confirmedBookings": 30,
    "cancelledBookings": 6,
    "totalRevenue": 450000,
    "occupancyRate": 30,
    "topBookingRoom": "deluxe"
  }
}
```

---

## 📖 API Documentation

Interactive Swagger documentation available at:

- http://localhost:5000/api-docs

---

## 👨‍💻 Author

**Dammar Bhatt**

- GitHub: [dammar2171](https://github.com/dammar2171)
- LinkedIn: [Dammar Bhatt](https://www.linkedin.com/in/dammar-bhatt-0a41aa302/)

---

## 📄 License

MIT
