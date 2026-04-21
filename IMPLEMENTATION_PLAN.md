# Implementation Plan for Completing the Sarkin Mota Automobile Webapp

This document outlines the steps required to address the remaining gaps in the application and bring it to a complete, production-ready state.

## 1. Dependency Cleanup

**Goal**: Remove unused dependencies to reduce bloat and potential security risks.

*   **Task**: Remove `mongoose` from `backend/package.json`.
*   **Reason**: The project uses Sequelize (SQL) for database management. `mongoose` (MongoDB) is listed but unused.

## 2. Backend Enhancements

### 2.1. User Management (Admin Dashboard)
**Goal**: Allow administrators to delete user accounts.

*   **File**: `backend/src/controllers/dashboard.controller.js`
    *   **Action**: Implement `deleteUser` function.
    *   **Logic**:
        *   Find user by ID.
        *   (Optional but recommended) Delete user instance from Supabase Auth (if possible with current keys, otherwise just local DB).
        *   Delete user record from local Postgres database.
*   **File**: `backend/src/routes/dashboard.routes.js`
    *   **Action**: Add `DELETE /users/:id` route protected by `protectAdminRoute` and `requireRole(['super_admin'])`.

### 2.2. Sell Submission Email Automation
**Goal**: Automatically send an email to the customer when an offer is made.

*   **File**: `backend/src/controllers/sellSubmissions.controller.js`
    *   **Action**: Implement the `TODO` in `sendOffer` function.
    *   **Implementation**:
        *   Import `createMessage` and `gmail` (or similar service) from `../services/gmail.service.js`.
        *   Construct a professional email template (HTML/Text) including the offer amount and car details.
        *   Send the email using the configured email service.

## 3. Frontend Implementation

### 3.1. Admin User Management
**Goal**: Connect the "Delete" button in the UI to the backend API.

*   **File**: `frontend/src/components/admin/AdminUsers.jsx`
    *   **Action**: Implement `handleDelete` function.
    *   **Logic**:
        *   Show confirmation dialog (e.g., `window.confirm` or a modal).
        *   Call `DELETE /api/admin/dashboard/users/:id`.
        *   On success, remove the user from the local state list to update UI without refresh.

### 3.2. Admin Staff Management
**Goal**: Connect the "Delete" button in the UI to the backend API.

*   **File**: `frontend/src/components/admin/AdminStaff.jsx`
    *   **Action**: Implement `handleDelete` function.
    *   **Logic**:
        *   Show confirmation dialog.
        *   Call `DELETE /api/admin/staff/:id`.
        *   On success, remove the staff member from the local state.

## 4. Verification & Testing

*   **Step 1**: Run `npm run test` in backend to ensure no regressions.
*   **Step 2**: Manual testing:
    *   Log in as Super Admin.
    *   Create a test user and delete them.
    *   Create a test staff member and delete them.
    *   Submit a "Sell your car" form as a user, then "Send Offer" as admin and verify email delivery (if credentials valid) or log output.
