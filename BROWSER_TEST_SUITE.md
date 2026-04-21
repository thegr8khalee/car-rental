# Browser Test Suite: Inventory & Profitability System

This document outlines a manual test suite to verify the full functionality of the Inventory Management System, VIN Decoding, and Profitability Dashboard in the browser.

## **Prerequisites**
1.  **Server Status**: Ensure Backend and Frontend servers are running.
2.  **Authentication**: Log in with an **Admin** account.

---

## **Test Case 1: VIN Decoding & New Car Entry**
**Goal**: Verify that the VIN service retrieves data and creates a vehicle record correctly.

1.  **Navigate**: Go to **Listings** > Click **"Add Car"** (or "+" button).
2.  **Step 1 (Identity)**:
    *   **Action**: Enter a valid VIN (Use Sample: `1HGCM82633A004352` - 2003 Honda Accord).
    *   **Action**: Click the **"Decode"** button.
    *   **Verify**: The following fields auto-fill:
        *   Make: `Honda`
        *   Model: `Accord`
        *   Year: `2003` (or similar)
        *   Body Type: `Sedan`
        *   Fuel Type: `Gasoline`
    *   **Action**: Enter a **Stock Number** (e.g., `STK-TEST-001`).
    *   **Action**: Set **Status** to `Available`.
    *   **Action**: Enter **Price** (Retail Price): `5,000,000`.
3.  **Step 2 (Financials)**:
    *   **Action**: Enter **Cost Price**: `3,500,000`.
    *   **Action**: Enter **Reconditioning Cost**: `200,000`.
    *   **Action**: Fill other required fields (Mileage: `150000`, Color: `Black`).
4.  **Submit**:
    *   **Action**: Click **"Submit"** / **"Add Car"**.
    *   **Verify**: Success toast notification appears ("Car added successfully").
    *   **Verify**: You are redirected to the listings page (or form clears).

---

## **Test Case 2: Inventory Grid & Status Indicators**
**Goal**: Confirm that the new inventory fields are visible in the management grid.

1.  **Navigate**: Go to **Listings**.
2.  **Search**: Find the car created in Test Case 1 (`STK-TEST-001` or `Honda Accord`).
3.  **Verify UI**:
    *   **Stock Number**: A badge with `STK-TEST-001` should be visible next to the price.
    *   **Status Badge**: A **Green** "Available" badge should be displayed.

---

## **Test Case 3: Status Workflow & Audit Logic**
**Goal**: Verify that changing a car's status triggers updates.

1.  **Action**: Click the **Edit** button (Pencil icon) for the test car.
2.  **Update**:
    *   Change **Status** from `Available` to `Reserved`.
    *   Change **Price** from `5,000,000` to `5,200,000`.
3.  **Save**: Click **"Update Car"**.
4.  **Verify**:
    *   Return to **Listings**.
    *   The status badge should now be **Yellow** (or warning color) reading "Reserved".
    *   The price should reflect the new amount.

---

## **Test Case 4: Profitability Dashboard (Real-time Metrics)**
**Goal**: Confirm that inventory data correctly feeds into financial reports.

1.  **Navigate**: Click **"Profitability"** in the Admin Sidebar.
2.  **Verify Initial State**:
    *   **Gross Inventory Value**: Should include the `3,500,000` (Cost Price) of your active test car.
    *   **Projected Revenue**: Should include the `5,200,000` (Current List Price).
    *   **Realized Profit**: Should **NOT** include this car yet (as it is not sold).
    *   **Summary Count**: "Active/For Sale" count should include this car.

3.  **Simulate Sale**:
    *   Go back to **Listings** -> **Edit** the test car.
    *   Change **Status** to `Sold`.
    *   **Save**.

4.  **Verify "Sold" Impact**:
    *   Return to **Profitability Dashboard**.
    *   **Gross Inventory Value**: Should **decrease** (asset removed from active value).
    *   **Realized Profit**: Should **increase** by `1,500,000` (Price 5.2M - Cost 3.5M - Prep 200k).
    *   **Sold Count**: Should increment by 1.
    *   **Profit By Make**: The table should show an entry for "Honda" with the calculated profit.

---

## **Test Case 5: Error Handling (VIN)**
**Goal**: Ensure the system handles invalid inputs gracefully.

1.  **Navigate**: **Add Car**.
2.  **Action**: Enter an invalid VIN (e.g., `INVALID123`).
3.  **Action**: Click **"Decode"**.
4.  **Verify**: Error toast notification appears ("Failed to decode VIN" or "Invalid VIN").
5.  **Verify**: Form fields remain empty or unchanged.

---

## **Test Case 6: Data Integrity**
**Goal**: Verify that optional financial fields do not crash the view if missing.

1.  **Action**: Add a second car manually **without** clicking "Decode" and **without** entering a Stock Number or Cost Price.
2.  **Submit**.
3.  **Check Listings**: Should render correctly without the Stock # badge.
4.  **Check Profitability**: Should handle the missing cost (treat as 0) without crashing the dashboard.
