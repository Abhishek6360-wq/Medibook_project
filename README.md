# 🏥 Medibook — Advanced Doctor Appointment & Clinic Management System

Medibook is an enterprise-grade, high-concurrency Doctor Appointment Booking and Clinic Management Platform built with **Node.js, Express, Sequelize, PostgreSQL, and React**.

The platform is designed with a **highly robust concurrency engine**, modular clean architecture, zero-config environment portability, and a fully automated media/database seeding pipeline. It consists of three main modules:
1. **Patient Booking Portal**: Search doctors by specialty, check live rolling calendar slots, book appointments, cancel bookings, pay via integrated Razorpay gateway, and update user profiles.
2. **Doctor Panel**: A dashboard for doctors to track upcoming bookings, cancel/complete appointments, and update their clinical details, fees, and real-time availability.
3. **Admin Control Panel**: An administrative portal to monitor business metrics, view live registration summaries, add new doctors, update credentials, and cancel appointments.

---

## 🚀 Advanced System Design & Interview Highlights

### 🛡️ 1. Concurrency Control (ACID Transaction & Row-Level locks)
* **Design Concept**: When multiple concurrent requests attempt to book the exact same time slot for a doctor, standard database setups suffer from **Race Conditions**, resulting in duplicate/double bookings.
* **Solution**: Implemented an atomic **PostgreSQL database transaction** using Sequelize. Upon checking slot availability, the system acquires a **row-level write lock** (`FOR UPDATE` in raw SQL, or `lock: transaction.LOCK.UPDATE` in Sequelize) on that specific Doctor's row:
  ```javascript
  const doc = await Doctor.findByPk(docId, { 
    transaction,
    lock: transaction.LOCK.UPDATE 
  });
  ```
* **Result**: Concurrent requests are forced to wait in a serialized PostgreSQL queue. Once the first request creates the appointment, appends the slot, and commits, the lock is released. The next request in line resumes, reads the updated slots map, identifies that the slot is now booked, and safely aborts with a graceful error.

### 📅 2. Separation of Concerns (Stateless Calendar Engine)
* **Design Concept**: UI rendering should remain decoupled from pure algorithmic calculations. 
* **Solution**: Extracted the rolling 7-day calendar slot generation logic into a pure, stateless utility function: `calculateAvailableSlots`.
* **Result**: The React frontend uses standard memoization (`useMemo`) to trigger the calculations, resulting in **zero unnecessary UI re-renders, highly simplified pages, and 100% unit-testable business logic**.

### 🌐 3. Zero-Config Portability (Dynamic Localhost Fallback)
* **Design Concept**: Manually swapping environment variables or hardcoding local ports vs production URLs when shifting between testing locally and deploying to production leads to deployment errors and slows down development.
* **Solution**: Built an automated **runtime origin detector** in both the Patient and Admin frontends:
  ```javascript
  const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const API_URL = isLocalhost ? 'http://localhost:4000' : import.meta.env.VITE_BACKEND_URL;
  ```
* **Result**: If the site is opened on a developer's machine (`localhost`), it automatically routes queries to your local server. If accessed on a public production cloud (like Render), it seamlessly communicates with the production cloud backend without any manual configuration required.

### 🐘 4. Clean-Slate Assets & Seeding Pipeline
* **Design Concept**: Seeding databases with hardcoded URLs or broken links ruins product demonstrations.
* **Solution**: Developed a high-performance custom seeder `seed.js` that:
  1. Performs atomic table truncations and resets auto-incrementing primary key sequences (`TRUNCATE TABLE ... RESTART IDENTITY CASCADE`), ensuring a clean, duplicate-free state.
  2. Integrates directly with Cloudinary's Node SDK, reading local high-res PNG image assets from the frontend source folder at runtime, uploading them to your active Cloudinary container, and returning secure cloud CDN links to the database.

---

## 🛠️ Tech Stack & Services

* **Backend Engine**: Node.js, Express.js (REST APIs, CORS security, custom error handlers)
* **Database & ORM**: PostgreSQL, Sequelize v6 (ACID transactions, migration management, relational constraints, JSONB data types)
* **Media Handling**: Cloudinary SDK (Direct cloud uploads, automated image folders)
* **Payments Integrations**: Razorpay Node SDK (Order creation, cryptographically verified signatures)
* **Frontend Apps**: React, TailwindCSS, Axios, Vite, Context API, React Toastify

---

## 📂 Repository Directory Structure

```bash
code/backend/
├── config/                  # Database, Cloudinary & Migration Configuration
│   ├── database.js          # Sequelize connection instance mapping PG_URI
│   ├── cloudinary.js        # Cloudinary SDK client configuration 
│   └── migrate.js           # Umzug migration runner setup
│
├── controllers/             # Express API Request/Response Controllers
│   ├── admincontroller.js   # Handles admin logins, metrics, doctor additions
│   ├── doctorcontroller.js  # Handles doctor profiles, statuses, specific slots
│   └── usercontroller.js    # Handles user registers, appointments, payments
│
├── middlewares/             # Request Filters & Middleware
│   ├── authAdmin.js         # JWT validation for Admin panel requests
│   ├── authDoctor.js        # JWT validation for Doctor dashboard requests
│   ├── authUser.js          # JWT validation for Patient portal requests
│   └── multer.js            # Image parser extracting binary files from requests
│
├── migrations/              # Relational SQL Database Schema Files
│   └── 01_create_tables.js  # Atomic tables creation (Users, Doctors, Appointments)
│
├── models/                  # Sequelize Data Schemas
│   ├── index.js             # Associations exporter (relationships & FKs)
│   ├── User.js              # Patient schema mapping user profiles
│   ├── Doctor.js            # Doctor schema mapping clinical specifications
│   └── Appointment.js       # Appointment schema mapping booking history
│
├── routes/                  # Express REST Endpoint Mappings
│   ├── adminRoute.js        # /api/admin/* endpoints
│   ├── doctorRoute.js       # /api/doctor/* endpoints
│   └── userRoute.js         # /api/user/* endpoints
│
├── services/                # Core Business Logic Layer (ACID Transactions)
│   ├── adminService.js      # Handles doctor registers, metrics summaries
│   ├── doctorService.js     # Handles doctor dashboard calendars & updates
│   ├── userService.js       # Handles patient credentials validation
│   └── appointmentService.js# Handles bookings & cancellations (with Row Locks 🔒)
│
├── utils/                   # Shared Helper Utilities
│   ├── uploadToCloudinary.js# Media streams pipeline uploading to Cloudinary
│   └── transactionHelper.js # ACID transaction database locks helper (Interview ⚡)
│
├── .env                     # Local Environment Secret Configurations
├── package.json             # Backend dependencies list (Express, Sequelize, etc.)
├── server.js                # Express Server starter & Middlewares registration
├── seed.js                  # Atomic DB Reset & Cloudinary Media Upload pipeline
├── run-migrations.js        # Command execution line to trigger SQL migrations
├── check-db.js              # Diagnostic script to query local DB profiles
└── test-login.js            # Diagnostic script validating patient authentication

code/frontend/
├── src/
│   ├── api/                 # API Network Clients
│   │   └── api.js           # Axios base client with zero-config localhost fallback 🌐
│   │
│   ├── assets/              # Premium visual graphics & SVGs
│   │   ├── General_physician.svg, Gynecologist.svg, etc. (Specialty graphics)
│   │   ├── doc1.png to doc15.png (Clinical portraits uploaded to Cloudinary 🖼️)
│   │   └── assets.js        # Predefined specialties and doctor arrays mapping
│   │
│   ├── components/          # Shared declarative UI components
│   │   ├── banner.jsx       # Interactive promotional booking widgets
│   │   ├── navbar.jsx       # Session-aware top navigation utility
│   │   ├── footer.jsx       # Standard footer copyright details
│   │   └── specialtymenu.jsx# Specialty carousel catalog
│   │
│   ├── context/             # Global React State Controllers
│   │   └── appcontext.jsx   # Auth tokens, doctors data, profiles state
│   │
│   ├── pages/               # Patient booking pages
│   │   ├── home.jsx         # Landing page dashboard
│   │   ├── doctors.jsx      # Doctor directory filters
│   │   ├── appointments.jsx # Calendar rolling appointment slot selector 📅
│   │   ├── myappointments.jsx# Bookings manager & Razorpay billing triggers
│   │   ├── profile.jsx      # Profile editor with Multer file uploads
│   │   ├── about.jsx        # Company overview
│   │   ├── contacts.jsx     # Feedback submission screen
│   │   └── login.jsx        # Login & guest credentials panel
│   │
│   ├── utils/               # Pure logical functions
│   │   └── dateHelper.js    # Centralized 7-day rolling slots engine (Interview 📅)
│   │
│   ├── App.jsx              # Client router mappings & toaster registrations
│   ├── index.css            # Custom layout rules & scrollbar setups
│   └── main.jsx             # React DOM launcher

code/admin/
├── src/
│   ├── components/          # Reusable widgets
│   │   ├── navbar.jsx       # Portal session-aware side navigations
│   │   └── sidebar.jsx      # Management dashboard navigation triggers
│   │
│   ├── context/             # Global Administrative Context State
│   │   ├── admincontext.jsx # Admin doctor registrations, analytics, all bookings
│   │   └── doctorcontext.jsx# Doctor dashboard agendas, completions, cancellations
│   │
│   ├── pages/               # Administrative & Doctor Interface pages
│   │   ├── login.jsx        # Credentials gate (Admin / Doctor toggle)
│   │   │
│   │   ├── adminpages/      # Admin access only
│   │   │   ├── dashboard.jsx# Analytical graphics (patients, doctors count, etc.)
│   │   │   ├── adddoctor.jsx# Multipart form creating clinical profiles
│   │   │   ├── doctorslist.jsx# Status toggles (Availability) & delete buttons
│   │   │   ├── Allapointments.jsx# Master cancel & payment monitor lists
│   │   │   └── patientslist.jsx# Patient roster catalog
│   │   │
│   │   └── doctorpages/     # Doctor access only
│   │       ├── docdashboard.jsx# Daily patient agendas & earnings stats
│   │       ├── docprofile.jsx# Speciality, address, and fees editors
│   │       └── myappointments.jsx# Live patient verification & completions status
│   │
│   ├── App.jsx              # Portals routing system and guards configuration
│   ├── index.css            # Tailwind custom scroll bars & panel animations
│   └── main.jsx             # App launcher
```

---

## 🚀 Local Installation & Setup

### 1. Database Setup
Create a new PostgreSQL database in pgAdmin or via terminal:
```sql
CREATE DATABASE medibook;
```

### 2. Backend Environment Setup
Create a `.env` file inside `code/backend/` and configure your credentials:
```env
PG_URI=postgres://<username>:<password>@localhost:5432/medibook
CLOUDINARY_NAME=dzyuyrctv
CLOUDINARY_API_KEY=435499983353741
CLOUDINARY_SECRET_KEY=efbOzF--l8sm8B6nfjNWP6B4LcY
ADMIN_EMAIL=at8984316@gmail.com
ADMIN_PASSWORD=This#ismy2025app
JWT_SECRET=LKGHTRJL
RAZORPAY_SECRET=8sZRXdCbQfVPg4efx7AByUBw
RAZORPAY_TEST_KEY=rzp_test_RZvetATc4fmYmv
CURRENCY=INR
```

### 3. Migrating and Seeding the Database
Run migrations and populate the database with all 15 doctors and custom Cloudinary assets:
```bash
cd code/backend
npm install

# Run Sequelize database migrations
npm run db:migrate

# Seed data (Clears old data & uploads images to Cloudinary)
npm run seed
```

### 4. Running the Applications
Start the backend server:
```bash
cd code/backend
npm start
```

Start the Patient Portal frontend:
```bash
cd code/frontend
npm install
npm run dev
```

Start the Admin Panel:
```bash
cd code/admin
npm install
npm run dev
```

---

## 💡 Guest Credentials (Perfect for Interviews)

### 🧑‍⚕️ Patient Portal
* **Email**: `guest@medibook.com`
* **Password**: `guestpassword123`

### 💼 Admin Panel
* **Email**: `at8984316@gmail.com`
* **Password**: `This#ismy2025app`

### 🩺 Doctor Panel
* **Email**: `doctor_guest@medibook.com`
* **Password**: `guestpassword123`

---

*Medibook represents state-of-the-art backend engineering and clean frontend design, ready for testing under heavy load conditions.*
