# Sports-Facility-Booking-Platform

Welcome to the Sports Facility Booking Platform! This project allows users to book sports facilities with ease. Below you will find all the necessary information to set up and use the application.

## Live URL

Access the live application at: [Sports Facility Booking Platform Live URL](https://assignment03-olive.vercel.app/)

## Features

- **User Signup:** Register new users with secure password hashing.
- **User Login:** Authenticate users and provide a JWT token for session management.
- **Facility Management (Admin Only):**
  - **Create Facility:** Admins can add new sports facilities.
  - **Update Facility:** Admins can update existing sports facilities.
  - **Delete Facility:** Admins can soft delete sports facilities.
- **Booking Management:**
  - **Get All Facilities:** Users can retrieve all available sports facilities.
  - **Check Availability:** Users can check the availability of time slots for booking on a specific date.
  - **Create Booking (User Only):** Users can book available facilities.
  - **View All Bookings (Admin Only):** Admins can view all bookings.
  - **View User Bookings (User Only):** Users can view their own bookings.
  - **Cancel Booking (User Only):** Users can cancel their bookings.
- **Error Handling:** Comprehensive error handling for all routes.
- **Authentication Middleware:** Ensures that only authenticated users can access certain routes.
- **No Data Found Response:** Handles cases where no matching data is found.

## Technology Stack

- **Programming Language:** TypeScript
- **Web Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** Bcrypt for password hashing
- **Environment Management:** dotenv for environment variables

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MongoDB
- npm (Node Package Manager)

### Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/jonycmtt/Sports-Facility-Booking-Platform.git

   cd Sports-Facility-Booking-Platform

   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Set up environment variables:**
   <br>
   Create a .env file in the root directory and add the following:

   ```makefile
   PORT=5000
   DATABASE_URL=your_mongodb_connection_string
   BCRYPT_SALT_ROUNDS=12
   DEFAULT_PASS=your_default_password
   JWT_ACCESS_SECRET=your_jwt_secret

   ```

4. **Run the application:**

   ```sh
   npm run start:dev
   ```
