# DriveNow — Car Rental System

A full-stack car rental platform: **Spring Boot** backend (Java, OOP, Lombok, ModelMapper, MySQL) + **React** frontend (component-wise structure, with an image slider on the login page).

## Project Structure

```
car-rental-system/
├── backend/     Spring Boot REST API
└── frontend/    React application
```

## Admin Access

A default admin account is seeded automatically the first time the backend starts (see `DataInitializer`):

- **Email:** `admin@drivenow.com`
- **Password:** `Admin@123`

Log in with these credentials on the normal Login page — since the account's role is `ADMIN`, it redirects to `/admin` instead of the customer dashboard, where you can add/edit/delete cars and view all bookings across every customer.

Change the seeded email/password/name in `backend/src/main/resources/application.properties` under `app.admin.*` before it's ever run once — after the first startup, the account already exists in the database and editing the properties won't change it (you'd need to update it directly in MySQL or delete the row).

Auth is JWT-based: `/api/auth/login` and `/api/auth/register` return a `token` which the frontend stores in `localStorage` and attaches to every request as `Authorization: Bearer <token>`. The backend enforces that only `ADMIN`-role tokens can create/update/delete cars or view the full bookings list — regular customers are rejected with a 403 if they try.

## Features

- User registration & login (passwords hashed with BCrypt, sessions via JWT)
- Role-based access: `CUSTOMER` vs `ADMIN`, enforced server-side
- Browse cars by category, view availability
- Book a car for a date range with automatic price calculation
- View and cancel your own bookings
- **Admin Dashboard**: add/edit/delete cars, view all bookings across all users

## OOP Design Notes

- `BaseEntity` (abstract) → `User`, `Car`, `Booking` demonstrate **inheritance**
- `UserService`, `CarService`, `BookingService` interfaces with `*Impl` classes demonstrate **abstraction & polymorphism**
- Lombok (`@Getter/@Setter/@Builder`) reduces boilerplate; ModelMapper converts between entities and DTOs so internal fields (like password hashes) never leak to the client

## Backend Setup

1. Make sure MySQL is running locally.
2. The connection is preconfigured in `backend/src/main/resources/application.properties`:
   - Database: `car_rental_db` (auto-created if it doesn't exist)
   - Username: `root`
   - Password: `2003825`

   Adjust the username if your MySQL root user is different.

3. Run the backend:
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   The API starts on `http://localhost:8080`.

### Key Endpoints

| Method | Endpoint                        | Description                |
|--------|----------------------------------|----------------------------|
| POST   | `/api/auth/register`            | Register a new user        |
| POST   | `/api/auth/login`               | Log in                     |
| GET    | `/api/cars`                     | List all cars               |
| GET    | `/api/cars/available`           | List available cars        |
| POST   | `/api/cars`                     | Add a car                  |
| PUT    | `/api/cars/{id}`                | Update a car                |
| DELETE | `/api/cars/{id}`                | Delete a car                |
| POST   | `/api/bookings`                 | Create a booking            |
| PATCH  | `/api/bookings/{id}/cancel`     | Cancel a booking            |
| GET    | `/api/bookings/user/{userId}`   | Get a user's bookings       |

Since there's no seed data yet, add a few cars via `POST /api/cars` (e.g. with Postman) before testing the frontend's car list — a sample body:

```json
{
  "brand": "Toyota",
  "model": "Corolla",
  "year": 2023,
  "category": "Sedan",
  "pricePerDay": 45.00,
  "imageUrl": "https://images.unsplash.com/photo-1502877338535-766e1452684a",
  "transmission": "Automatic",
  "seats": 5,
  "status": "AVAILABLE"
}
```

## Frontend Setup

```bash
cd frontend
npm install
npm start
```
Runs on `http://localhost:3000` and talks to the backend at `http://localhost:8080/api` (see `frontend/src/services/api.js`).

## Frontend Structure

```
src/
├── components/
│   ├── ImageSlider/   Auto-rotating image slider (used on Login/Register)
│   ├── Navbar/        Top navigation bar
│   ├── CarCard/        Car listing card
│   └── BookingForm/    Modal for creating a booking
├── pages/
│   ├── Login/
│   ├── Register/
│   ├── Cars/           Car browsing page
│   └── Dashboard/       User's bookings
└── services/api.js      Centralized axios calls
```

## Next Steps You Might Add

- JWT-based auth instead of localStorage user object (current setup is intentionally simple)
- Admin dashboard UI for managing cars
- Search/filter by date availability
- Pagination for the car list
