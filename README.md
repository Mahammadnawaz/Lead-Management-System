# LeadFlow - Production-Ready Lead Management System

A robust, enterprise-grade Lead Management & CRM application built with Node.js, Express, MongoDB, and React.js (Vite + Tailwind CSS). Designed with modular architecture, strict input validation, JWT authentication, and interactive pipeline visualization.

---

## Key Features

1. **Secure JWT Authentication**:
   - User registration and login with bcryptjs password hashing (10 salt rounds).
   - Protected API routes using Bearer token verification.
   - Built-in session persistence with automatic redirect upon expiry.

2. **Full Lead Lifecycle CRUD**:
   - Complete field tracking: `Name`, `Email`, `Phone`, `Company`, `Service Interested`, `Status` (New, Contacted, Qualified, Converted, Lost), `Follow-up Date`, and `Notes`.
   - Strict server-side schema validation via `express-validator` and Mongoose schema constraints.

3. **Analytics Dashboard**:
   - High-level KPI grid: Total Leads, New, Contacted, Qualified, Converted, Lost, and Conversion Rate %.
   - Interactive data visualizations with Recharts (Bar Chart distribution and Pie Chart pipeline share).

4. **Search, Filter & Server-side Pagination**:
   - Instant search across lead name, email, phone, company, and service with debounced inputs.
   - Filter by status and created date range (`startDate` to `endDate`).
   - Server-side pagination with dynamic page controls.

5. **Modern UX/UI**:
   - Clean, professional Tailwind CSS dashboard design.
   - Toast notification feedback system for API successes and errors.
   - Accessible modal forms, quick-view detail cards, and destructive action confirm dialogs.
   - Zero-configuration in-memory database fallback if local MongoDB is not running.

---

## Tech Stack

- **Backend**: Node.js, Express.js (ES Modules), Mongoose, JWT, bcryptjs, express-validator, Morgan, CORS.
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React icons, Recharts, Axios.
- **Database**: MongoDB (Local or Atlas) with auto in-memory fallback (`mongodb-memory-server`).

---

## Demo Credentials

You can use the convenient **"Fill Demo Credentials"** button on the login screen or enter manually:

- **Email**: `admin@leadflow.com`
- **Password**: `Password123!`
