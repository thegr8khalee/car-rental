# Application Features Overview

This document outlines the current feature set of the Car Dealership Application, categorized by user role and functional area.

## 🚗 Customer / Public Features

### 1. Vehicle Inventory & Browsing
*   **Listings View**: Browse all available vehicles with pagination or infinite scroll.
*   **Search & Filtering**: Filter vehicles by various attributes (Make, Model, Price, Body Type, etc.).
*   **Vehicle Details**: Comprehensive view of a specific vehicle including specifications, pricing, and images.
*   **Compare Vehicles**: Ability to select multiple vehicles and compare their specifications side-by-side.
*   **Categorization**: Browse vehicles by categories (e.g., SUVs, Sedans) or Makes.

### 2. User Accounts
*   **Authentication**: Sign up and Login functionality (integrated with Supabase).
*   **Profile Management**: View and manage user profile details.
*   **Email Verification**: Flow for verifying user email addresses.

### 3. Services & Engagement
*   **Sell Your Car**: dedicated form for customers to submit details about their vehicle for sale or trade-in.
*   **Blog & News**: Read articles and news updates from the dealership.
*   **Comments**: Authenticated users can leave comments on blog posts.
*   **Contact**: General contact form for inquiries.

---

## 🛠️ Admin & Management Features

### 1. Dashboard & Analytics
*   **Admin Dashboard**: Central hub for viewing key metrics and recent activities.
*   **Profitability Tracking**: Tools to track financial performance (inferred from routes/controllers).

### 2. Inventory Management
*   **CRUD Operations**: Full ability to Add, Update, and Delete vehicle listings.
*   **VIN Decoding**: Automated fetching of vehicle details using VIN input.
*   **Image Management**: Upload and manage vehicle images (likely Cloudinary integration based on file list).

### 3. Content Management (CMS)
*   **Blog Management**: Create, edit, and delete blog posts.
*   **News Management**: Manage news updates.

### 4. Marketing & Communication
*   **Newsletters & Broadcasts**:
    *   Create and send newsletters/broadcasts to subscribers.
    *   View stats for sent broadcasts.
*   **Interactions**: View and manage customer inquiries/interactions.

### 5. Staff & Administration
*   **Staff Management**: Add and edit staff members.
*   **Role-Based Access**: Specialized routes and permissions for different admin roles (Super Admin, Editor, Moderator).
