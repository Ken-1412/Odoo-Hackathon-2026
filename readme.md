# AssetFlow
### Enterprise Asset & Resource Management System

> **Hackathon Project (8 Hours)**
>
> AssetFlow is a modern Enterprise Resource Planning (ERP) platform that digitizes the complete lifecycle of organizational assets and shared resources. The platform eliminates manual spreadsheets and paper-based tracking by providing centralized asset management, resource booking, maintenance workflows, audits, analytics, and role-based access control.

---

# Table of Contents

- Overview
- Problem Statement
- Objectives
- Features
- User Roles
- System Workflow
- Tech Stack
- System Architecture
- Folder Structure
- Database Design
- API Design
- Business Rules
- Asset Lifecycle
- Resource Booking Logic
- Maintenance Workflow
- Audit Workflow
- Dashboard & Analytics
- Notifications
- Security
- Future Scope
- Hackathon Development Plan
- Deployment

---

# Overview

Organizations such as companies, universities, hospitals, factories, and government agencies often struggle to efficiently manage physical assets like laptops, projectors, vehicles, furniture, meeting rooms, and other shared resources.

Traditional spreadsheet-based tracking leads to:

- Lost assets
- Double allocation
- Booking conflicts
- Maintenance delays
- Missing audit trails
- No centralized visibility

AssetFlow solves these problems through a centralized ERP platform that manages the complete lifecycle of every organizational asset.

---

# Problem Statement

Build an Enterprise Asset & Resource Management System capable of:

- Managing departments and employees
- Managing asset categories
- Registering organizational assets
- Tracking complete asset lifecycle
- Preventing duplicate allocations
- Booking shared resources
- Handling maintenance approval workflow
- Managing scheduled audits
- Providing reports and analytics
- Maintaining activity logs
- Sending notifications
- Role-based access control

---

# Objectives

The platform should enable organizations to:

- Digitally manage all physical assets
- Track ownership and responsibility
- Prevent conflicts automatically
- Improve resource utilization
- Simplify maintenance management
- Conduct structured audits
- Generate operational insights
- Maintain accountability

---

# Core Features

## Authentication

- Employee Signup
- Secure Login
- Forgot Password
- JWT Authentication
- Session Validation

Employees cannot assign their own roles.

Only Admin can promote users.

---

## Dashboard

Real-time overview including:

- Total Assets
- Available Assets
- Allocated Assets
- Under Maintenance
- Active Bookings
- Pending Transfers
- Upcoming Returns
- Overdue Returns
- Pending Maintenance Requests

Quick Actions

- Register Asset
- Book Resource
- Raise Maintenance Request

---

## Organization Setup

### Department Management

- Create Department
- Edit Department
- Deactivate Department
- Parent Department
- Department Head Assignment

### Asset Categories

Examples

- Electronics
- Furniture
- Vehicles
- Networking
- Meeting Rooms

Each category supports custom fields.

Example

Electronics

- Warranty
- Brand
- Model

Vehicle

- Registration Number
- Insurance
- Fuel Type

### Employee Directory

Stores

- Name
- Email
- Department
- Role
- Status

Admin can promote

Employee →

- Department Head
- Asset Manager

---

## Asset Management

Each asset contains

- Asset Tag
- Name
- Category
- Department
- Serial Number
- Acquisition Date
- Acquisition Cost
- Condition
- Current Status
- Current Holder
- QR Code
- Location
- Images
- Documents

Search Filters

- Asset Tag
- QR Code
- Category
- Department
- Status
- Location
- Serial Number

---

## Asset Allocation

Allocate assets to

- Employee
- Department

System validates

- Asset already allocated
- Asset under maintenance
- Asset retired
- Asset disposed

If already allocated

System blocks allocation

Instead offers

Transfer Request

---

## Transfer Workflow

```
Employee Requests Transfer

↓

Department Head Approval

↓

Asset Manager Approval

↓

Asset Reallocated

↓

History Updated
```

---

## Return Workflow

```
Employee Initiates Return

↓

Asset Manager Reviews

↓

Condition Check

↓

Status Updated

↓

Available Again
```

---

## Resource Booking

Book

- Meeting Rooms
- Vehicles
- Equipment
- Labs

Features

- Calendar View
- Time Slot Booking
- Conflict Detection
- Reminder Notifications
- Cancel Booking
- Reschedule Booking

Booking Status

- Upcoming
- Ongoing
- Completed
- Cancelled

---

## Maintenance

Employees can

Raise Maintenance Request

Workflow

```
Pending

↓

Approved

↓

Technician Assigned

↓

In Progress

↓

Resolved

↓

Available Again
```

Maintenance History retained forever.

---

## Audit Management

Create Audit Cycle

Assign Auditors

Audit Status

- Verified
- Missing
- Damaged

Automatically generates

Discrepancy Report

---

## Reports

Generate

- Department Allocation Report
- Asset Utilization
- Booking Heatmap
- Maintenance Report
- Asset Aging Report
- Upcoming Retirement
- Idle Assets
- Overdue Returns

Export

- PDF
- CSV

---

## Notifications

Examples

- Asset Assigned
- Transfer Approved
- Booking Confirmed
- Booking Reminder
- Maintenance Approved
- Maintenance Completed
- Audit Assigned
- Overdue Return
- Asset Returned

---

## Activity Logs

Tracks

Who

Did What

When

For Every Action

---

# User Roles

## Admin

Permissions

- Manage Departments
- Manage Categories
- Manage Employees
- Assign Roles
- View Analytics
- Create Audit Cycles
- Full System Access

---

## Asset Manager

Permissions

- Register Assets
- Allocate Assets
- Approve Transfers
- Approve Maintenance
- Approve Returns

---

## Department Head

Permissions

- View Department Assets
- Approve Department Transfers
- Book Resources
- View Department Reports

---

## Employee

Permissions

- View Own Assets
- Raise Maintenance Request
- Book Resources
- Request Transfers
- Request Returns

---

# Asset Lifecycle

```
Available

↓

Allocated

↓

Returned

↓

Available
```

Alternative flows

```
Available

↓

Maintenance

↓

Available
```

```
Available

↓

Lost
```

```
Available

↓

Retired
```

```
Available

↓

Disposed
```

Every state transition is validated.

---

# Business Rules

## Allocation Rules

- One asset can belong to only one employee at a time.
- Double allocation is prohibited.
- Retired assets cannot be allocated.
- Maintenance assets cannot be allocated.

---

## Booking Rules

Bookings cannot overlap.

Example

```
9:00 — 10:00

Booked

9:30 — 10:30

Rejected

10:00 — 11:00

Accepted
```

---

## Maintenance Rules

Only Asset Manager approves maintenance.

Asset automatically changes

Available

↓

Under Maintenance

↓

Available

---

## Audit Rules

Only active assets can be audited.

Closing audit automatically updates

Missing

↓

Lost

---

# System Workflow

```
Signup

↓

Employee

↓

Admin Assigns Role

↓

Register Assets

↓

Allocate Assets

↓

Book Resources

↓

Maintenance

↓

Transfers

↓

Returns

↓

Audit

↓

Reports

↓

Notifications
```

---

# Suggested Tech Stack

## Frontend

- Next.js 15
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- TanStack Query
- React Hook Form
- Zod
- Recharts
- FullCalendar

---

## Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- Redis
- JWT
- Bcrypt
- Multer
- Cloudinary

---

## Deployment

Frontend

Vercel

Backend

Railway / Render

Database

Neon PostgreSQL

Redis

Upstash

Storage

Cloudinary

---

# Folder Structure

```
assetflow

│

├── frontend

│   ├── app

│   ├── components

│   ├── features

│   │

│   ├── assets

│   ├── booking

│   ├── maintenance

│   ├── dashboard

│   ├── audit

│   ├── reports

│   ├── hooks

│   ├── services

│   └── utils

│

├── backend

│   ├── controllers

│   ├── routes

│   ├── middleware

│   ├── services

│   ├── validations

│   ├── prisma

│   ├── jobs

│   ├── websocket

│   └── utils

│

└── README.md
```

---

# Database Tables

- Users
- Departments
- AssetCategories
- Assets
- AssetHistory
- Allocations
- Transfers
- Bookings
- MaintenanceRequests
- AuditCycles
- AuditItems
- Notifications
- ActivityLogs

---

# API Modules

## Authentication

- Login
- Signup
- Forgot Password
- Refresh Token

## Departments

- Create
- Update
- Delete
- List

## Categories

- CRUD

## Assets

- Register
- Update
- Delete
- Search

## Allocation

- Allocate
- Return
- Transfer

## Booking

- Create
- Cancel
- Update

## Maintenance

- Raise
- Approve
- Resolve

## Audit

- Create Cycle
- Assign Auditor
- Submit Audit

## Reports

- Dashboard
- Utilization
- Maintenance
- Export

---

# Dashboard Widgets

- Asset Distribution
- Maintenance Overview
- Department Summary
- Booking Calendar
- Recent Activities
- Upcoming Returns
- Notifications
- KPI Cards

---

# Security

- JWT Authentication
- Password Hashing
- Role Based Access Control
- Protected APIs
- Input Validation
- Secure File Uploads
- Server-side Authorization

---

# Future Enhancements

- QR Scanner
- Barcode Scanner
- AI Chat Assistant
- Predictive Maintenance
- IoT Integration
- RFID Tracking
- Mobile Application
- Email Notifications
- SMS Alerts
- WebSocket Live Updates
- OCR Invoice Upload
- AI Asset Recommendation

---

# 8 Hour Hackathon Development Plan

## Hour 1

- Setup Project
- Authentication
- Database Schema

---

## Hour 2

- Organization Setup
- Roles
- Employee Directory

---

## Hour 3

- Asset Registration
- Asset Directory

---

## Hour 4

- Allocation
- Transfers
- Returns

---

## Hour 5

- Booking Module
- Calendar

---

## Hour 6

- Maintenance
- Notifications

---

## Hour 7

- Dashboard
- Reports
- Charts

---

## Hour 8

- UI Polish
- Testing
- Deployment
- Presentation

---

# What Makes AssetFlow Different

- Enterprise-grade Workflow
- Real role hierarchy
- Conflict prevention
- Complete asset lifecycle
- ERP-inspired architecture
- Audit-ready history
- Scalable modular design
- Modern responsive UI
- Dashboard-first experience
- Production-ready folder structure

---

# Team Vision

AssetFlow is designed to modernize organizational asset management by replacing fragmented spreadsheets and manual processes with a centralized, intelligent, and scalable ERP platform. Our goal is to build a system that improves accountability, transparency, operational efficiency, and decision-making while providing an intuitive experience for every user role.
