# Inventory & Sales Management System — Frontend

React frontend for **Project 5 – Inventory, Sales Order & Stock Movement System**.

This client provides the role-based user interface for inventory, customers, sales orders, stock receipts, stock movements, reports, dashboard statistics, and user management. It communicates with the Express/MongoDB backend through the API URL configured in the frontend environment file.

---

## Live Application

| Service | URL |
|---|---|
| Frontend (Vercel) | https://ideo-project-khaki.vercel.app/ |
| Backend (Render) | https://project-backend-1-nyty.onrender.com |
| Production API Base URL | https://project-backend-1-nyty.onrender.com/api |

Backend repository: https://github.com/itshamzadev/project-backend.git

---

## Technology Stack

- React 19
- Vite
- React Router
- Context API
- Native Fetch API
- CSS
- ESLint

> This frontend uses the browser `fetch()` API for backend requests. Axios is not used.

---

## User Roles

### Sales Staff

- View products and stock information.
- Manage customers.
- Create multi-item sales orders.
- View and track their own orders.
- Edit draft orders.
- Confirm allowed orders.
- Cancel draft orders or request cancellation where applicable.

### Warehouse Staff

- View products.
- View orders available to their role.
- Record stock receipts.
- View stock movement history.
- Process confirmed orders through the allowed workflow.

### Admin

- Access the complete dashboard.
- Manage products and categories.
- Manage customers and orders.
- Manage users and roles.
- Record/view stock receipts and stock movements.
- Approve or reject order cancellation requests.
- View sales and inventory reports.

---

## Demo Accounts

The backend seed script provides these demo users:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@example.com` | `admin123` |
| Sales Staff | `sales@example.com` | `sales123` |
| Warehouse Staff | `warehouse@example.com` | `warehouse123` |

> These accounts are intended for project demonstration and development only.

---

## Main Frontend Features

- Login with JWT-based session handling.
- Authentication state managed with React Context API.
- Token and user session restoration through `/auth/me`.
- Protected application routes.
- Role-based route protection.
- Forbidden and not-found pages.
- Responsive dashboard layout with sidebar/header navigation.
- Dashboard summary cards.
- Low-stock list.
- Orders grouped by status.
- Recent activity display.
- Product listing, search, filters, pagination, details, create/edit, and delete/deactivate actions where permitted.
- Category management for administrators.
- Customer listing, search, pagination, details, order history, create/edit, and delete actions where permitted.
- Dynamic multi-item sales-order form.
- Order search/filtering and pagination.
- Draft order editing.
- Order details and role-dependent status actions.
- Cancellation request, approval, and rejection UI according to role permissions.
- Stock receipt creation with multiple product rows.
- Stock receipt history.
- Stock movement history.
- Sales report page.
- Inventory report page.
- Admin user management.
- Reusable loading, empty, error, confirmation, modal, table, pagination, form, and status components.

---

## Frontend Routes

| Route | Access | Purpose |
|---|---|---|
| `/login` | Public | Login page |
| `/dashboard` | Authenticated | Dashboard |
| `/products` | Authenticated | Products list |
| `/products/:id` | Authenticated | Product details |
| `/categories` | Admin | Category management |
| `/customers` | Sales, Admin | Customer management |
| `/customers/:id` | Sales, Admin | Customer details and order history |
| `/orders` | Authenticated | Orders list |
| `/orders/new` | Sales, Admin | Create sales order |
| `/orders/:id/edit` | Sales, Admin | Edit draft order |
| `/orders/:id` | Authenticated | Order details |
| `/stock-receipts` | Warehouse, Admin | Stock receipts |
| `/stock-movements` | Warehouse, Admin | Stock movement history |
| `/reports/sales` | Admin | Sales reports |
| `/reports/inventory` | Admin | Inventory reports |
| `/users` | Admin | User management |
| `/forbidden` | Public | Unauthorized-role message |

Unknown URLs are handled by the frontend not-found page.

---

## Project Structure

```text
client/
├── src/
│   ├── components/
│   │   ├── categories/
│   │   ├── common/
│   │   ├── customers/
│   │   ├── dashboard/
│   │   ├── layout/
│   │   ├── orders/
│   │   ├── products/
│   │   ├── stock/
│   │   └── users/
│   ├── config/
│   │   └── env.js
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── layouts/
│   ├── pages/
│   ├── routes/
│   │   ├── AppRoutes.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── RoleRoute.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env.example
├── package.json
└── vite.config.js
```

---

## Environment Variables

Create a `.env` file inside the frontend `client` folder.

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

For the deployed backend:

```env
VITE_API_BASE_URL=https://project-backend-1-nyty.onrender.com/api
```

The value is read in:

```text
src/config/env.js
```

The application throws a configuration error if `VITE_API_BASE_URL` is missing.

> Do not commit local `.env` files containing environment-specific values. Keep `.env.example` in the repository as the configuration reference.

---

## Local Setup

### 1. Clone the frontend repository

```bash
git clone https://github.com/itshamzadev/project-frontend.git
cd project-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the API URL

Create `.env` from `.env.example` and set the backend URL:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 4. Start the development server

```bash
npm run dev
```

Open the local URL displayed by Vite in the terminal.

The backend must also be running and accessible at the API URL configured in `.env`.

---

## Available Scripts

```bash
npm run dev
```

Starts the Vite development server.

```bash
npm run build
```

Creates the production frontend build.

```bash
npm run preview
```

Previews the production build locally.

```bash
npm run lint
```

Runs ESLint against the frontend source.

---

## Authentication Flow

1. The user submits email and password on `/login`.
2. The frontend sends the credentials to `${VITE_API_BASE_URL}/auth/login`.
3. On success, the JWT token and user data are stored in browser local storage.
4. `AuthContext` restores an existing session by calling `/auth/me` with the bearer token.
5. `ProtectedRoute` blocks unauthenticated access.
6. `RoleRoute` prevents users from opening pages outside their allowed role.
7. Logout removes the stored token and user data.

Backend middleware remains responsible for enforcing actual API authorization; frontend route guards are an additional user-interface layer.

---

## Role-Based UI Examples

- **Admin:** categories, reports, users, cancellation decisions, and full management access.
- **Sales:** customers, new orders, draft editing, and sales-order actions permitted by the backend.
- **Warehouse:** stock receipts, stock movements, and permitted order-processing actions.

The navigation and pages are displayed according to the authenticated user's role.

---

## API Integration

All backend calls are built from one environment-based base URL:

```js
export const API_URL = import.meta.env.VITE_API_BASE_URL;
```

Examples used by the frontend include:

```text
/auth/login
/auth/me
/products
/categories
/customers
/orders
/stock-receipts
/stock-movements
/reports/dashboard
/reports/sales
/reports/inventory
/users
```

Detailed API/business-logic documentation belongs to the backend/root project documentation.

---

## Responsive & UX Features

The frontend includes:

- Desktop and mobile navigation.
- Reusable responsive tables.
- Pagination controls.
- Search inputs and filter controls.
- Loading indicators.
- Empty-state messages.
- API error messages.
- Confirmation dialogs before destructive actions.
- Status badges.
- Reusable form fields and select controls.
- Role-aware action buttons and navigation.

---

## Production Deployment

The frontend is deployed on **Vercel**:

https://ideo-project-khaki.vercel.app/

For production deployment, configure this environment variable in Vercel:

```env
VITE_API_BASE_URL=https://project-backend-1-nyty.onrender.com/api
```

After changing frontend environment variables, redeploy the application so Vite can include the new value in the production build.

---

## Suggested Demonstration Flow

For the final project demonstration:

1. Log in as **Admin** and show dashboard statistics.
2. Show products and category management.
3. Log in as **Sales Staff** and create/view a customer.
4. Create a multi-item sales order.
5. Open the order and demonstrate its allowed actions.
6. Log in as **Warehouse Staff** and show stock receipts/stock movements and order processing.
7. Log back in as **Admin** and show reports, user management, and cancellation approval/rejection if a request exists.
8. Demonstrate that a role cannot open a restricted frontend page.

---

## Submission Notes

Before final submission:

- Confirm `npm install` succeeds from a clean checkout.
- Confirm `npm run build` succeeds.
- Confirm the deployed frontend can reach the deployed backend.
- Confirm all three demo accounts can log in.
- Confirm role-restricted pages behave correctly.
- Make sure `.env`, `node_modules`, and `dist` are not included in the Git repository or final source submission.
- Keep `.env.example` in the repository.
- Add final application screenshots to the main/root project submission documentation if required by the instructor.

---

## Related Repository

Backend source:

https://github.com/itshamzadev/project-backend.git

---

## Project

**Project 5 – Inventory, Sales Order & Stock Movement System**  
MERN Stack Project Assignment
