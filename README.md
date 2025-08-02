# RBAC-Powered Admin Dashboard with JWT Authentication

A lightweight admin dashboard web application with login authentication and role-based access control (RBAC) using JWT tokens and mock data.

## Features

- **JWT Authentication**: Secure login with 10-minute token expiry
- **Role-Based Access Control**: Three roles (Admin, Editor, Viewer) with different permissions
- **Protected Routes**: Role-based route protection
- **Interactive Dashboard**: Cards for Orders, Users, Riders, and Settings
- **Mock Data**: No database required - uses in-memory mock data
- **Responsive Design**: Works on desktop and mobile devices

## Roles & Permissions

| Role | View | Edit | Delete | Settings Access |
|------|------|------|--------|-----------------|
| Viewer | ✅ | ❌ | ❌ | ❌ |
| Editor | ✅ | ✅ | ❌ | ❌ |
| Admin | ✅ | ✅ | ✅ | ✅ |

## Mock Users & Credentials

The application comes with three pre-configured users for testing:

| Email | Password | Role | Permissions |
|-------|----------|------|-------------|
| `admin@site.com` | `admin123` | Admin | Full access (View, Edit, Delete, Settings) |
| `editor@site.com` | `editor123` | Editor | View and Edit (Users, Orders, Riders) |
| `viewer@site.com` | `viewer123` | Viewer | View only |

## Sample Data

The application includes comprehensive mock data for testing:

### Orders Data
- Customer orders with status, amounts, and dates
- Sample orders: Pending, Delivered, Processing, Cancelled
- Order amounts ranging from $75 to $245

### Users Data
- Customer accounts with roles and status
- Sample users: Active and inactive customers
- Join dates and email addresses

### Riders Data
- Delivery personnel with ratings and status
- Sample riders: Available, Busy, Offline
- Ratings from 4.6 to 4.9, delivery counts

### Settings Data
- Application configuration (Admin only)
- Site name, theme, version, maintenance mode
- Session timeout and login attempt limits

## 📦 Mock Data

The dashboard uses in-memory mock data for simplicity and demo purposes. You can find the mock data in the backend or include it in a separate mock file for API simulation or frontend testing.

```js
const mockData = {
  orders: [
    { id: 1, customerName: "John Doe", orderNumber: "ORD-001", status: "Pending", amount: 150.00, date: "2024-01-15" },
    { id: 2, customerName: "Jane Smith", orderNumber: "ORD-002", status: "Delivered", amount: 89.99, date: "2024-01-14" },
    { id: 3, customerName: "Bob Johnson", orderNumber: "ORD-003", status: "Processing", amount: 245.50, date: "2024-01-13" },
  ],
  users: [
    { id: 1, name: "John Doe", email: "john@example.com", role: "customer", status: "active", joinDate: "2024-01-01" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "customer", status: "active", joinDate: "2024-01-02" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "customer", status: "inactive", joinDate: "2024-01-03" },
  ],
  riders: [
    { id: 1, name: "Mike Wilson", email: "mike@delivery.com", status: "available", rating: 4.8, totalDeliveries: 150 },
    { id: 2, name: "Sarah Davis", email: "sarah@delivery.com", status: "busy", rating: 4.9, totalDeliveries: 200 },
    { id: 3, name: "Tom Anderson", email: "tom@delivery.com", status: "offline", rating: 4.7, totalDeliveries: 120 },
  ],
  settings: {
    siteName: "RBAC Admin Dashboard",
    theme: "dark",
    version: "1.0.0",
    maintenanceMode: false,
    maxLoginAttempts: 5,
    sessionTimeout: 600
  }
};
```

## Project Structure

```
/client
  /src
    /components
      Card.css
      Card.jsx
      ProtectedRoute.jsx
    /pages
      Login.jsx
      Login.css
      Dashboard.jsx
      Dashboard.css
      Settings.jsx
      Settings.css
      NotAuthorized.jsx
      NotAuthorized.css
   /hooks
      useAuth.js
   App.jsx

/server
  /routes
    auth.js (JWT authentication with mock users)
    data.js (Mock data endpoints)
  /middleware
    auth.js (JWT + RBAC middleware)
  server.js
```

## Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn** package manager
- **Modern web browser** (Chrome, Firefox, Safari, Edge)

## Installation & Setup

### Step 1: Clone and Install Dependencies

```bash
# Clone the repository (if not already done)
git clone <repository-url>
cd RBAC_Admin-Dashboard

# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### Step 2: Environment Configuration (Optional)

Create a `.env` file in the root directory for custom configuration:

```env
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=development
```

**Note**: If no `.env` file is provided, the application will use default values.

### Step 3: Start the Application

#### Option A: Start Both Frontend and Backend Together (Recommended)

```bash
# Start both server and client simultaneously
npm run dev
```

This will start:
- **Backend server** on `http://localhost:5000`
- **Frontend client** on `http://localhost:3000`

#### Option B: Start Frontend and Backend Separately

**Terminal 1 - Start Backend:**
```bash
# Start the server only
npm run server
```

**Terminal 2 - Start Frontend:**
```bash
# Start the client only
npm run client
```

### Step 4: Access the Application

1. **Open your browser** and navigate to `http://localhost:3000`
2. **Login** using any of the mock credentials above
3. **Test different roles** by logging in with different users

## Available Scripts

```bash
# Development (runs both server and client)
npm run dev

# Start server only
npm run server

# Start client only
npm run client

# Production build
npm run build

# Install client dependencies
npm run install-client
```

## API Endpoints

### Authentication
- `POST /api/login` - User login with email/password
- `GET /api/me` - Get current user info
- `POST /api/logout` - User logout
- `GET /api/users` - Get all users (admin only)

### Data Management
- `GET /api/data/:type` - Get data by type (orders, users, riders, settings)
- `PUT /api/data/:type/:id` - Update data (admin/editor only)
- `DELETE /api/data/:type/:id` - Delete data (admin only)
- `GET /api/dashboard/stats` - Get dashboard statistics

### Health Check
- `GET /api/health` - Server health status

## Testing Different Roles

### Viewer Role (`viewer@site.com`)
- Can view dashboard content
- Cannot edit or delete any data
- Cannot access Settings page
- Sees only "View" permissions

### Editor Role (`editor@site.com`)
- Can view all dashboard content
- Can edit Users, Orders, and Riders
- Cannot delete any data
- Cannot access Settings page
- Sees "Edit" permissions

### Admin Role (`admin@site.com`)
- Full access to all features
- Can view, edit, and delete all data
- Can access Settings page
- Can manage application configuration
- Sees "Edit | Delete" permissions

## Features

### Token Expiry and Auto-Logout
- JWT tokens expire after 10 minutes
- Automatic logout when token expires
- Token expiry warnings
- Secure token storage

### Role-Based UI
- Edit/Delete buttons only show for appropriate roles
- Settings page restricted to admin users
- Dynamic content based on user permissions
- Responsive design for all devices

### Interactive Dashboard
- Expandable cards for each data type
- Real-time statistics display
- Role-based action buttons
- Smooth animations and transitions

## Development

- **Backend**: Node.js with Express
- **Frontend**: React with modern hooks
- **Authentication**: JWT tokens
- **Data**: In-memory mock data (no database required)
- **Styling**: CSS3 with modern features

## Security Features

- JWT token authentication
- Role-based access control
- Rate limiting (100 requests per 15 minutes)
- CORS enabled
- Input validation
- Secure password handling (mock data)

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Kill existing processes
   pkill -f "node server/server.js"
   pkill -f "react-scripts"
   ```

2. **Dependencies Not Installed**
   ```bash
   # Reinstall dependencies
   rm -rf node_modules package-lock.json
   npm install
   cd client && npm install
   ```

3. **CORS Issues**
   - Ensure backend is running on port 5000
   - Check that frontend proxy is configured correctly

### Debug Mode

The application includes debug features:
- Console logging for card interactions
- Debug panel showing current expanded card
- Visual indicators for expanded cards

### React Hook Warnings

The application has been optimized to eliminate React Hook dependency warnings:
- All useEffect dependencies are properly declared
- useCallback is used to memoize functions
- No infinite re-render loops

## Deployment

### Backend Deployment
1. Set environment variables
2. Install dependencies: `npm install`
3. Start server: `npm start`

### Frontend Deployment
1. Build the app: `npm run build`
2. Serve the `build` folder

## Project Snapshots

<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/907de27c-c143-4676-a941-a1911f76ee6d" />
<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/d7efa621-85be-4d32-9b85-8ad69caa0237" />
<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/02fef733-334d-49de-acd4-c470ca50c6a7" />
<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/01faaeb7-f032-40a0-9621-f0adf81f0e34" />

