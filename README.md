# Community Clinic Appointment & Inventory System

A comprehensive clinic management system with portals for Admin, Doctor, Receptionist, Patient, and Pharmacist.

## Project Structure

- `backend/`: Node.js/Express backend with MySQL.
- `frontend/`: React/Vite frontend.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MySQL](https://www.mysql.com/)

## Setup Instructions

### 1. Database Setup

1. Create a MySQL database (e.g., `clinic_system`).
2. Update the database credentials in the backend environment variables.

### 2. Backend Setup

1. Open a terminal in the `backend/` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
   *Edit `.env` with your actual MySQL credentials and a secure JWT secret.*
4. Initialize the database and seed demo data:
   ```bash
   node init_db.js
   ```
5. Start the backend server:
   ```bash
   npm run dev
   ```
   *The server will run on [http://localhost:5000](http://localhost:5000).*

### 3. Frontend Setup

1. Open a terminal in the `frontend/` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The application will be available at [http://localhost:5173](http://localhost:5173).*

## Demo Login Credentials

- **Admin**: `admin@clinic.com` / `admin123`
- **Doctor**: `doctor@clinic.com` / `doctor123`
- **Pharmacist**: `pharmacist@clinic.com` / `pharma123`
- **Receptionist**: `reception@clinic.com` / `reception123`
- **Patient**: `patient@clinic.com` / `password123`

## Features

- **Admin**: User management, system-wide reports.
- **Doctor**: Manage appointments, patient medical records, write prescriptions.
- **Pharmacist**: View prescriptions, dispense medicine, manage inventory.
- **Receptionist**: Patient registration, book/reschedule appointments, billing.
- **Patient**: Dashboard, view own records and prescriptions, book appointments.
