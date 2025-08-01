# Doctor Appointment Booking System

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Description

A NestJS backend application for a Doctor Appointment Booking System. This system allows users to view doctors, check available time slots, and book appointments.

## Features

- Get all doctors
- Get available time slots for a specific doctor
- Book appointments with doctors
- Swagger API documentation
- Data validation and error handling
- PostgreSQL database integration

## Business Rules

- A doctor cannot be double-booked
- No overlapping appointments for the same doctor

## Installation

```bash
$ npm install
```

## Database Configuration

The application is configured to use PostgreSQL. You can modify the database connection settings in `src/database/database.module.ts`.

Default configuration:
```
host: 'localhost'
port: 5432
username: 'postgres'
password: 'postgres'
database: 'doctor_booking'
```

You can override these settings using environment variables:
- DB_HOST
- DB_PORT
- DB_USERNAME
- DB_PASSWORD
- DB_NAME

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Seeding the Database

To populate the database with sample doctors and appointments:

```bash
$ npm run seed
```

## API Documentation

Swagger documentation is available at `/api` when the application is running.

## API Endpoints

### Doctors

- `GET /doctors` - Get all doctors
- `GET /doctors/:id` - Get a specific doctor
- `GET /doctors/:id/slots?date=2023-08-01` - Get available time slots for a doctor
- `POST /doctors` - Create a new doctor

### Appointments

- `POST /appointments` - Book a new appointment
- `GET /appointments` - Get all appointments
- `GET /appointments/:id` - Get a specific appointment
- `GET /appointments/doctor/:doctorId` - Get all appointments for a doctor
