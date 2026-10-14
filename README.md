# MediConnect

MediConnect is a MERN-stack healthcare appointment application with separate experiences for patients, doctors, and administrators. Patients can discover doctors and manage appointments, doctors can manage their schedules and appointments, and administrators can manage doctors and view appointment/dashboard information.

This version has been prepared for local development with the existing UI and styling retained. **Stripe and Razorpay online-payment integrations have been removed.** The appointment flow uses **Pay at clinic**; the application does not collect or process online payments.

## Contents

- [Features](#features)
- [Technology stack](#technology-stack)
- [Project structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Quick start](#quick-start)
- [Environment variables](#environment-variables)
- [Local URLs](#local-urls)
- [Application routes](#application-routes)
- [Backend API overview](#backend-api-overview)
- [Useful commands](#useful-commands)
- [Troubleshooting](#troubleshooting)
- [Security notes](#security-notes)
- [Payment behavior](#payment-behavior)

## Features

### Patient portal

- Browse the available doctors and filter by speciality.
- Register and sign in.
- View and update profile information.
- Book appointments with doctors.
- View and cancel appointments.
- Choose the **Pay at clinic** flow rather than online checkout.

### Doctor portal

- Doctor sign-in.
- View dashboard and appointment information.
- Manage appointment availability.
- Complete or cancel appointments.
- View and update doctor profile details.

### Admin portal

- Administrator sign-in.
- Dashboard and appointment overview.
- Add doctors and view the doctor list.
- Change doctor availability.
- View and cancel appointments.

### Application and development

- React frontends powered by Vite.
- Express REST API.
- MongoDB persistence through Mongoose.
- JWT-based authentication in the API.
- Optional Cloudinary configuration for image upload features.
- Stripe and Razorpay code and dependencies removed from this version.

## Technology stack

| Area | Technologies |
|---|---|
| Patient frontend | React, Vite, React Router, Axios, Tailwind CSS, React Toastify |
| Admin/doctor frontend | React, Vite, React Router, Axios, Tailwind CSS, React Toastify |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Authentication | JSON Web Tokens (JWT), bcrypt |
| Image uploads | Multer, Cloudinary (optional credentials) |

## Project structure

```text
mediconnect/
├── admin/                 # Admin and doctor portal (React + Vite)
│   ├── src/
│   ├── .env.example
│   └── package.json
├── backend/               # Express API and MongoDB models
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── .env.example
│   └── package.json
├── frontend/              # Patient-facing React application
│   ├── src/
│   ├── .env.example
│   └── package.json
├── README.md
└── SETUP.md
```

## Prerequisites

Install the following before running the project:

1. **Node.js 20 or newer** (npm is included with Node.js).
2. **MongoDB**, either a local MongoDB server or a MongoDB Atlas cluster.
3. Git (optional, if cloning the repository).

Cloudinary credentials are optional for features that upload images. The project does not require Stripe or Razorpay credentials.

## Quick start

Run each application in a separate terminal. Commands below work in PowerShell, Command Prompt, and most Unix-like shells; use the appropriate path syntax for your shell.

### 1. Extract the project

Extract the downloaded ZIP into a folder, for example `D:\mediconnect`.

### 2. Create the environment files

Copy each `.env.example` file to `.env` in the same directory:

**PowerShell** (run from the project root):

```powershell
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
Copy-Item admin/.env.example admin/.env
```

Review the values in each `.env` file as described in [Environment variables](#environment-variables). The `.env` files are local configuration and should not be committed.

### 3. Start MongoDB

For a local database, ensure the MongoDB service is running and listening at `mongodb://127.0.0.1:27017`. If using MongoDB Atlas, use your Atlas connection string in `backend/.env` and make sure the database user and network access are configured correctly.

### 4. Install backend dependencies and start the API

In Terminal 1:

```powershell
cd backend
npm install
npm run server
```

The backend defaults to port `4000`. The `server` script uses Nodemon for development reloads. To run without Nodemon, use `npm start`.

### 5. Install and start the patient frontend

In Terminal 2, from the project root:

```powershell
cd frontend
npm install
npm run dev
```

Vite normally serves the patient portal at `http://localhost:5173`.

### 6. Install and start the admin/doctor portal

In Terminal 3, from the project root:

```powershell
cd admin
npm install
npm run dev
```

Vite normally serves this portal at `http://localhost:5174`. If Vite selects another port because the default is occupied, use the URL printed in the terminal and update `CLIENT_URLS` in `backend/.env` if necessary.

### 7. Check the API

Open `http://localhost:4000/`. A successful response should display:

```text
API Working
```

Open `http://localhost:4000/test-db` to check whether Mongoose is connected to the configured database.

## Environment variables

### `backend/.env`

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Backend port; defaults to `4000`. |
| `MONGODB_URI` | Yes | MongoDB server/cluster URI. For local development, use `mongodb://127.0.0.1:27017`. |
| `DB_NAME` | No | Database name; defaults to `mediconnect`. The backend passes this separately to Mongoose. |
| `JWT_SECRET` | Yes for secure authentication | Private secret used to sign/verify authentication tokens. Set a long, random value. |
| `ADMIN_EMAIL` | Yes for configured admin login | Administrator email configured for the backend. |
| `ADMIN_PASSWORD` | Yes for configured admin login | Change the placeholder to a strong local admin password. |
| `CLIENT_URLS` | No | Comma-separated allowed frontend origins. Defaults to `http://localhost:5173,http://localhost:5174`. |
| `CLOUDINARY_NAME` | Optional | Cloudinary cloud name for image uploads. |
| `CLOUDINARY_API_KEY` | Optional | Cloudinary API key. |
| `CLOUDINARY_SECRET_KEY` | Optional | Cloudinary API secret. Keep private. |

Example local configuration:

```dotenv
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017
DB_NAME=mediconnect
JWT_SECRET=replace_with_a_long_random_secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change_this_admin_password
CLIENT_URLS=http://localhost:5173,http://localhost:5174
CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_SECRET_KEY=
```

Generate a stronger JWT secret instead of using the example value. In PowerShell, a random value can be generated with:

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### `frontend/.env`

```dotenv
VITE_BACKEND_URL=http://localhost:4000
```

This is the base URL used by the patient frontend to reach the backend API.

### `admin/.env`

```dotenv
VITE_BACKEND_URL=http://localhost:4000
```

This is the base URL used by the admin/doctor portal to reach the backend API.

Vite exposes variables prefixed with `VITE_` to browser-side code. **Never put passwords, database URIs, JWT secrets, or other private credentials in either frontend `.env` file.** Restart the relevant Vite server after changing environment variables.

## Local URLs

| Service | Default URL |
|---|---|
| Patient portal | `http://localhost:5173` |
| Admin/doctor portal | `http://localhost:5174` |
| Backend API | `http://localhost:4000` |
| API health response | `http://localhost:4000/` |
| Database connection check | `http://localhost:4000/test-db` |

## Application routes

### Patient portal

| Path | Purpose |
|---|---|
| `/` | Home page |
| `/doctors` | Browse doctors |
| `/doctors/:speciality` | Browse doctors by speciality |
| `/login` | Patient sign-in/registration |
| `/about` | About page |
| `/contact` | Contact page |
| `/my-profile` | Patient profile |
| `/my-appointments` | Patient appointments |
| `/appointment/:docId` | Doctor details and appointment booking |

### Admin/doctor portal

The admin/doctor portal has a shared sign-in entry at `/` and separate dashboard routes after authentication.

| Path | Purpose |
|---|---|
| `/` | Sign-in page |
| `/admin-dashboard` | Admin dashboard |
| `/all-appointments` | Admin appointment management |
| `/add-doctor` | Add a doctor |
| `/doctor-list` | Doctor list |
| `/doctor-dashboard` | Doctor dashboard |
| `/doctor-appointments` | Doctor appointment management |
| `/doctor-profile` | Doctor profile |

## Backend API overview

All endpoints below are relative to `http://localhost:4000`. Protected endpoints require the authentication token expected by the relevant middleware. Request bodies and upload fields should be checked against the corresponding controller before integrating another client.

### User endpoints (`/api/user`)

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/register` | Register a patient |
| `POST` | `/login` | Patient login |
| `GET` | `/get-profile` | Get the authenticated patient's profile |
| `POST` | `/update-profile` | Update patient profile; accepts an image upload |
| `POST` | `/book-appointment` | Book an appointment |
| `GET` | `/appointments` | List the patient's appointments |
| `POST` | `/cancel-appointment` | Cancel a patient's appointment |

### Doctor endpoints (`/api/doctor`)

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/login` | Doctor login |
| `GET` | `/list` | Public doctor listing |
| `POST` | `/cancel-appointment` | Cancel an appointment as a doctor |
| `GET` | `/appointments` | List the doctor's appointments |
| `POST` | `/change-availability` | Change doctor availability |
| `POST` | `/complete-appointment` | Mark an appointment complete |
| `GET` | `/dashboard` | Doctor dashboard data |
| `GET` | `/profile` | Doctor profile data |
| `POST` | `/update-profile` | Update doctor profile |

### Admin endpoints (`/api/admin`)

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/login` | Admin login |
| `POST` | `/add-doctor` | Add a doctor; accepts an image upload |
| `GET` | `/all-doctors` | List doctors |
| `POST` | `/change-availability` | Change doctor availability |
| `GET` | `/appointments` | List appointments for administration |
| `POST` | `/cancel-appointment` | Cancel an appointment as admin |
| `GET` | `/dashboard` | Admin dashboard data |

The backend also exposes `GET /` as a simple API response and `GET /test-db` as a database connection check.

## Useful commands

Run these from the relevant application directory after installing dependencies.

### Backend

```bash
npm start       # Start API using node
npm run server  # Start API using Nodemon
npm test        # Run Node's built-in test runner
```

### Patient frontend or admin/doctor portal

```bash
npm run dev     # Start Vite development server
npm run build   # Create a production build in dist/
npm run preview # Preview the production build locally
npm run lint    # Run ESLint
```

## Troubleshooting

### MongoDB connection fails

- Confirm the MongoDB service is running.
- Check `MONGODB_URI` and `DB_NAME` in `backend/.env`.
- For Atlas, check the database username/password, network access allowlist, and URI encoding for special characters in credentials.
- The database name is configured separately using `DB_NAME`; use a server URI such as `mongodb://127.0.0.1:27017` for local development.

### `Invalid namespace specified`

Check the MongoDB URI and database name. Do not append a database name to the URI and also treat the combined value as a database name. This version passes `MONGODB_URI` and `DB_NAME` separately to Mongoose.

### CORS / network errors in the browser

- Confirm the backend is running at the URL in each frontend `.env` file.
- Ensure `CLIENT_URLS` in `backend/.env` includes the exact frontend origins, separated by commas.
- Restart the backend after editing its environment file and restart Vite after editing a frontend environment file.

### Port already in use

Stop the process using the port or start Vite on a free port. If the frontend origin changes, update `CLIENT_URLS` accordingly.

### Image upload errors

Cloudinary credentials are optional for starting the application but are needed for upload functionality that relies on Cloudinary. Configure the three `CLOUDINARY_*` variables in `backend/.env` and restart the backend.

### Admin login does not work

Verify `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `backend/.env` and inspect the backend console for errors. Use a new strong password rather than the placeholder. The configured admin credentials are server-side values; do not put them in a frontend environment file.

### Payment gateway references

Stripe and Razorpay are not used in this version. No gateway keys are needed. Appointment payment is handled at the clinic; do not interpret an appointment record as evidence that an online payment has been processed.

## Security notes

- Never commit `.env` files, API keys, database credentials, or JWT secrets.
- `.env.example` files are templates only. Replace example passwords and secrets for your own environment.
- Use HTTPS, strong secrets, appropriate CORS origins, and secure deployment configuration in production.
- Do not expose `MONGODB_URI`, `JWT_SECRET`, `ADMIN_PASSWORD`, or Cloudinary secret keys to client-side code.
- Before deploying publicly, review authentication, authorization, validation, upload restrictions, error handling, and production logging.


## Development status

This package has received source-level fixes and backend JavaScript syntax checks. A complete end-to-end test against a configured MongoDB instance and successful production builds of both Vite applications should still be run in the target development environment after dependencies are installed.

## License

Check the repository's license and any third-party asset licenses before redistributing or deploying this project.
