# Inventory System Enhancement Plan

This plan details the steps to transform the current vehicle management system into a robust Inventory & Dealership Management System.

## Phase 1: Core Data Structure & Financials

### 1. Database Schema Updates (`Car` Model)
**Target File**: `backend/src/models/car.model.js`

We need to transition from a simple display model to a business asset model.

-   **New Fields**:
    -   `vin` (String, Unique, Index): Vehicle Identification Number.
    -   `stockNumber` (String, Unique, Index): Readable ID (e.g., "INV-1004").
    -   `costPrice` (Decimal): The acquisition cost of the vehicle.
    -   `reconditioningCost` (Decimal): Total spend on repairs/detailing.
    -   `location` (String/Enum): Current physical location (e.g., "Main Lot", "Showroom", "Storage").
    -   `status` (Enum): Replace the `sold` boolean with a workflow status:
        -   `acquired`: Just bought, not ready.
        -   `preparing`: In reconditioning/service.
        -   `available`: Ready for sale.
        -   `reserved`: Deposit taken.
        -   `sold`: Finalized.

### 2. Migration & Backfill
**Script**: `backend/src/scripts/migrate-inventory.js`
-   Create a script to add columns to the existing PostgreSQL table.
-   Migrate existing `sold: true` records to `status: 'sold'`.
-   Generate default `stockNumber` for existing cars (e.g., sequential numbers).

### 3. Backend Controller Logic
**Target File**: `backend/src/controllers/car.controller.js`
-   Update `createCar` and `updateCar` schemas to validate financials.
-   **Profit Calculation**: Add a computed field or endpoint to return `estimatedProfit` (`price` - `costPrice` - `reconditioningCost`).

---

## Phase 2: Smart Features & Automation

### 1. VIN Decoding Service
**Target File**: `backend/src/services/vin.service.js`
-   **Integration**: Use the free NHTSA vPIC API.
-   **Functionality**:
    -   Input: VIN string.
    -   Output: Normalized JSON with Make, Model, Year, Body Type, Engine, Drive Type.
-   **Endpoint**: `GET /api/admin/cars/decode/:vin`

### 2. Stock Number Generator
**Logic**: Auto-increment or Format-based generator (e.g., `{Year}-{Sequence}`).
-   Implement a hook in `Car` model `beforeCreate` to assign a stock number if one isn't provided.

### 3. Audit & History Logging
**New Model**: `backend/src/models/inventoryLog.model.js`
**Target**: Track *who* changed *what*.
-   **Schema**:
    -   `carId`: Reference to Car.
    -   `userId`: Reference to Admin user.
    -   `action`: "PRICE_CHANGE", "STATUS_CHANGE", "EXPENSE_ADDED".
    -   `details`: JSON diff of the change (Old Value vs New Value).
-   **Implementation**: Add middleware or utilize Sequelize hooks (`afterUpdate`) to write logs automatically.

---

## Phase 3: Frontend Admin Suite

### 1. Enhanced Car Form
**Target Components**: `AddCar.jsx`, `EditCar.jsx`
-   **VIN Decoder Input**: Input VIN -> Click "Decode" -> Auto-fill form fields.
-   **Financial Section**: Admin-only fields for Cost and Repairs (hidden from public API).
-   **Status Workflow**: Dropdown to move car through `Acquired` -> `Available` -> `Sold`.

### 2. Inventory Grid Update
**Target Component**: `AdminListings.jsx`
-   Add columns for **Stock #** and **Status** (Color-coded badges).
-   Add Quick Filters: "Needs Prep", "Reserved", "Low Margin".

### 3. Profitability Dashboard
**Target Component**: `AdminDashboard.jsx` (New Tab)
-   **Metrics**:
    -   Gross Inventory Value (Sum of Cost).
    -   Projected Revenue (Sum of Listing Price).
    -   Realized Profit (Last 30 days).
-   **Visuals**: Charts showing "Average Days to Sell" and "Profit by Make".

---

## Phase 4: Bulk Operations (Efficiency)

### 1. Bulk Import/Update
**API**: `POST /api/admin/cars/import`
-   Accept CSV upload.
-   Map CSV headers to database fields.
-   Run validation and batch insert.

### 2. Bulk Actions UI
-   Select multiple cars in the grid.
-   Actions: "Mark as Sold", "Update Location", "Print Window Stickers".

---

## Action Plan Checklist

- [x] **Step 1**: Update `Car` Model & Run Migration.
- [x] **Step 2**: Implement `VIN Decoding` Service.
- [ ] **Step 3**: Update Backend Controllers to handle new fields. (Partially done - validation logic updated)
- [ ] **Step 4**: Update Frontend `CarForm` with VIN Decode & Financials.
- [x] **Step 5**: Create `InventoryLog` for audit history.
