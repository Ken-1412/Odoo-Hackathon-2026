# 🚀 AssetFlow – Enterprise Asset & Resource Management System

<div align="center">

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)
![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED)

**A modern Enterprise Resource Planning (ERP) platform for managing organizational assets, shared resources, maintenance workflows, and audits.**

</div>

---

# 📖 Overview

AssetFlow is a full-stack **Enterprise Asset & Resource Management System** developed during an **8-hour hackathon**.

The platform replaces spreadsheet-based asset tracking with a centralized ERP solution that enables organizations to efficiently manage physical assets, shared resources, maintenance requests, audits, and role-based workflows.

The application is designed with a scalable architecture and can be used by:

- 🏢 Companies
- 🎓 Universities
- 🏥 Hospitals
- 🏭 Manufacturing Industries
- 🏛 Government Organizations

---

# ✨ Features

### 🔐 Authentication

- Secure Login
- Employee Registration
- JWT Authentication
- Password Encryption (bcrypt)
- Role-Based Access Control
- Session Validation

---

### 👥 Organization Management

- Department Management
- Employee Directory
- Asset Categories
- Department Hierarchy
- Role Assignment

---

### 💻 Asset Management

- Asset Registration
- Asset Directory
- QR Code Support
- Asset Tag Generation
- Search & Filtering
- Asset Lifecycle Tracking
- Asset Documents
- Asset Images

---

### 🔄 Asset Allocation

- Employee Allocation
- Department Allocation
- Return Workflow
- Transfer Requests
- Approval Workflow
- Allocation History
- Conflict Detection

---

### 📅 Resource Booking

- Meeting Rooms
- Vehicles
- Equipment
- Laboratories

Features

- Calendar View
- Time Slot Booking
- Booking History
- Conflict Prevention
- Rescheduling
- Cancellation

---

### 🛠 Maintenance Management

- Raise Maintenance Requests
- Approval Workflow
- Technician Assignment
- Resolution Tracking
- Maintenance History

---

### 📋 Audit Management

- Audit Cycles
- Auditor Assignment
- Verification Workflow
- Discrepancy Reports
- Audit History

---

### 📊 Dashboard & Reports

- KPI Cards
- Asset Utilization
- Booking Analytics
- Maintenance Reports
- Department Reports
- Asset Aging
- Export Reports

---

### 🔔 Notifications

- Asset Assignment
- Booking Reminder
- Maintenance Updates
- Transfer Approval
- Audit Alerts
- Overdue Returns

---

### 📜 Activity Logs

Tracks

- User Actions
- Asset Changes
- Transfers
- Maintenance
- Audit Activities

---

# 🏗 System Architecture

```
                    Next.js Frontend
                           │
                    REST API (HTTP)
                           │
                    Express.js Backend
                           │
                      Prisma ORM
                           │
                     PostgreSQL
                           │
                      Persistent Data
```

---

# 🛠 Tech Stack

## Frontend

- Next.js 15
- TypeScript
- Tailwind CSS
- React Hook Form
- TanStack Query
- Framer Motion
- Recharts
- FullCalendar
- Zod

---

## Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT
- bcrypt
- Multer

---

## Database

- PostgreSQL
- Prisma ORM

---

## DevOps

- Docker
- Docker Compose

---

## Deployment

Frontend

- Vercel

Backend

- Railway / Render

Database

- Neon PostgreSQL

Storage

- Cloudinary

---

# 📂 Project Structure

```
AssetFlow

├── frontend
│   ├── public
│   ├── src
│   └── package.json
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middlewares
│   ├── repositories
│   ├── routes
│   ├── services
│   ├── types
│   ├── utils
│   ├── validators
│   ├── prisma
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── server.ts
│
├── docker-compose.yml
└── README.md
```

---

# 🗄 Database

The application uses **PostgreSQL** with **Prisma ORM**.

Main entities include:

- Users
- Departments
- Roles
- Assets
- Asset Categories
- Allocations
- Transfers
- Resources
- Bookings
- Maintenance Requests
- Audit Cycles
- Notifications
- Activity Logs

---

# 📈 Asset Lifecycle

```
Available
     │
     ▼
Allocated
     │
     ▼
Returned
     │
     ▼
Available

Alternative States

Available
 ├── Reserved
 ├── Under Maintenance
 ├── Lost
 ├── Retired
 └── Disposed
```

---

# 🔄 Business Workflow

```
Employee Login
      │
      ▼
Asset Registration
      │
      ▼
Asset Allocation
      │
      ▼
Resource Booking
      │
      ▼
Maintenance Request
      │
      ▼
Asset Transfer
      │
      ▼
Audit Cycle
      │
      ▼
Reports & Analytics
```

---

# 🔒 Security

- JWT Authentication
- Password Hashing
- Role-Based Authorization
- Protected APIs
- Input Validation
- Secure File Uploads
- Server-side Authorization

---

# 🚀 Installation

Clone the repository

```bash
git clone https://github.com/yourusername/AssetFlow.git
```

Go to the project

```bash
cd AssetFlow
```

Install frontend

```bash
cd frontend
npm install
```

Install backend

```bash
cd ../backend
npm install
```

Configure environment variables

```env
DATABASE_URL=
JWT_SECRET=
CLOUDINARY_URL=
```

Run Prisma migrations

```bash
npx prisma migrate dev
```

Seed database

```bash
npx prisma db seed
```

Run backend

```bash
npm run dev
```

Run frontend

```bash
npm run dev
```

---

# 📌 Future Enhancements

- AI Chat Assistant
- Predictive Maintenance
- QR Scanner
- Barcode Scanner
- RFID Tracking
- Mobile Application
- Email Notifications
- SMS Alerts
- OCR Invoice Upload
- IoT Integration

---



## 📄 License

This project is licensed under the **MIT License**.

Copyright © 2026 AssetFlow Team

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the **"Software"**), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

- The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED **"AS IS"**, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

<div align="center">

⭐ **If you found this project useful, consider giving it a star on GitHub!**

Built with ❤️ for **Odoo Hackathon 2026**

</div>

If you found this project useful, consider giving it a ⭐ on GitHub.

