# Complete Application Feature Specification

This document details every feature and logic module detected in the "Car Template" application source code. Use this for accurate pricing estimation.

## 🌟 Core Modules

### 1. Advanced Inventory Management
*   **Listing Engine**:
    *   CRUD (Create, Read, Update, Delete) for vehicles.
    *   **Automated Search & Filtering**: Advanced filtering by attributes (Make, Model, Price, Body Type).
    *   **Recommendation System**: "Related Cars" logic displayed on detailed views.
    *   **Stock Tracking**: Manages `sold` status vs `active` inventory.
*   **Review System**:
    *   **Granular Ratings**: Users rate vehicles on 4 specific metrics: **Interior, Exterior, Comfort, Performance**.
    *   **Aggregation**: Automatically calculates weighted overall scores.
*   **VIN Integration**: Dedicated endpoint to decode VIN numbers for auto-filling vehicle details.

### 2. CRM & Trade-In Workflow (Sell Your Car)
*   **Submission Portal**: Public-facing multi-step form for customers to sell their cars.
*   **Media Handling**: Supports multiple image uploads for vehicle condition verification (stored in Cloudinary).
*   **Negotiation Workflow**: A backend state machine for managing submissions:
    *   `New` -> `Offer Sent` -> `Accepted` -> `Rejected`.
*   **Data Collection**: Captures detailed mechanical condition, mileage, and service history.

### 3. Financial Intelligence (Backend)
*   **Profitability Analytics**:
    *   **Real-time Metrics**: Calculates Gross Inventory Value, Projected Revenue, and Realized Profit.
    *   **Performance Metrics**: Tracks "Average Markup %" and "Inventory Turnover Rate".
    *   **Brand Analysis**: Breakdown of profit margins by Vehicle Make (e.g., "Toyota" vs "BMW").
    *   **Sales Tracking**: Monitors "Days to Sell" to estimate holding costs.

### 4. Marketing & Content Engine
*   **Broadcast System**:
    *   **Newsletter Management**: Create rich-text email broadcasts with image support.
    *   **Zoho Mail Integration**: Built-in integration with Zoho for transactional email delivery.
    *   **Analytics**: Tracks success/failure rates of sent campaigns.
*   **CMS (Content Management System)**:
    *   **Blog Platform**: Full publishing platform for SEO content.
    *   **Interaction Tracking**: Counters for Blog Views to measure engagement.
    *   **Commenting System**: Authenticated commenting engine with status flags (Approved/Pending).

### 5. Administration & Security
*   **Role-Based Access Control (RBAC)**:
    *   Multi-tier admin access: `Super Admin`, `Editor`, and `Moderator` roles.
    *   Protected API routes ensuring only authorized staff can access sensitive financial data.
*   **Staff Management**: Interface to add/remove staff members and assign roles.
*   **Dashboard**: A comprehensive "Mission Control" viewing:
    *   Inventory health.
    *   Pending trade-in offers.
    *   Recent user signups and engagement stats.

## 🏗️ Technical Architecture & Integrations

| Validated Service | Purpose |
| :--- | :--- |
| **Supabase** | Authentication & Database Hosting (PostgreSQL) |
| **Cloudinary** | Enterprise-grade image optimization & hosting (Vehicles, Blog covers) |
| **Zoho Mail** | Transactional Infrastructure for Newsletters |
| **Tailwind CSS** | Responsive UI Design System |
| **Vite** | Frontend Build Tooling (High Performance) |
| **Sequelize** | ORM for complex SQL queries and relationships |

## 💰 Monetization / Value Drivers
*   **White-Label Ready**: `branding.config.json` allows instant rebranding (Colors, Logo, Contact Info) for reselling to different dealerships.
*   **SaaS Potential**: The combination of Inventory + CRM + Marketing modules makes this a "Dealership-in-a-Box" SaaS product, not just a website.
