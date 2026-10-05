# Admin Pages

Main page components for the admin panel.

## Page Structure

```
pages/
├── index.jsx                    # Admin layout wrapper
├── Login/                       # Authentication page
├── Dashboard/                   # Reservations management
│   └── components/
│       └── ReservationsList/
└── RoomManagement/              # Room management
    └── components/
        ├── RoomsList/
        ├── RoomTypeCard/
        ├── PhysicalRooms/
        ├── PhysicalRoomCard/
        └── RoomSpecs/
```

---

## Pages Overview

### Admin Layout (index.jsx)

**Location**: `pages/index.jsx`

**Purpose**: Root layout wrapper for all admin pages. Provides consistent navigation and structure.

**Features**:
- Renders `<Outlet />` for nested routes
- Includes `<AdminNavigation />` component
- Sets up admin panel background and container

**Routes**:
```jsx
<Route path="/admin" element={<AdminLayout />}>
  <Route index element={<Dashboard />} />
  <Route path="rooms" element={<RoomManagement />} />
</Route>
```

---

### Login

**Location**: `pages/Login/index.jsx`

**Purpose**: Admin authentication page.

**Features**:
- Login form with email and password fields
- Sends credentials to `POST /api/admin/auth/login`
- Sets `admin_token` HTTP-only cookie on success
- Redirects to `/admin` after successful login
- Error handling for invalid credentials

**Form Fields**:
- Email (required)
- Password (required)

**Authentication Flow**:
1. User submits credentials
2. API validates against admin table
3. Backend generates JWT token
4. Token stored as HTTP-only cookie
5. Redirect to admin dashboard

---

### Dashboard

**Location**: `pages/Dashboard/index.jsx`

**Purpose**: Main admin landing page showing all reservations.

**Features**:
- Displays page header with title "Reservations"
- Fetches reservations via `useAdminReservations` hook
- Real-time updates via WebSocket
- Loading, error, and success states
- Delegates list rendering to `<ReservationsList />` component

**Data Flow**:
```
useAdminReservations()
    ↓
reservations[]
    ↓
<ReservationsList reservations={reservations} />
```

**UI States**:
- **Loading**: Shows "Loading reservations..." message
- **Error**: Red alert with error message
- **Success**: Renders reservations list

---

### RoomManagement

**Location**: `pages/RoomManagement/index.jsx`

**Purpose**: Admin interface for managing room types and physical rooms.

**Features**:

#### 1. Overview Cards
Displays 4 stat cards at the top:
- **Total Rooms**: Total physical rooms count
- **Available**: Rooms ready for booking (green)
- **Occupied**: Rooms with active reservations (blue)
- **Maintenance**: Rooms under maintenance (orange)

#### 2. Room Type Management
- Lists all room types as expandable cards
- Each card shows:
  - Room image
  - Name, category, price
  - Description
  - Specifications (size, guests, bed)
  - Physical rooms list

#### 3. Data Fetching
```jsx
const { data, isLoading, isError, error } = useAdminRooms()
const rooms = data?.rooms ?? []
const overview = data?.overview ?? null
```

#### 4. Component Hierarchy
```
RoomManagement
    ↓
RoomsList (container)
    ↓
RoomTypeCard (each room type)
    ├── RoomSpecs
    └── PhysicalRooms
            ↓
        PhysicalRoomCard (each physical room)
```

**Props Passed Down**:
- `rooms[]`: Array of room types
- `isLoading`: Loading state
- `error`: Error object

---

## Component Documentation

### Dashboard/ReservationsList

**Purpose**: Displays and manages the list of all reservations.

**Features**:
- Table or card view of reservations
- Status badges (Pending, Confirmed, Completed, Cancelled)
- Guest information display
- Room type and dates
- Status update buttons
- Real-time updates via WebSocket

**Status Management**:
```jsx
const mutation = useUpdateAdminReservationStatus()

const handleStatusChange = (reservationId, newStatus) => {
  mutation.mutate({ reservationId, status: newStatus })
}
```

**Status Colors**:
- **PENDING**: Yellow/Amber (awaiting confirmation)
- **CONFIRMED**: Green (confirmed by admin)
- **COMPLETED**: Gray (checked out)
- **CANCELLED**: Red (cancelled)

---

### RoomManagement Components

See detailed documentation in `RoomManagement/components/README.md`

**Quick Summary**:

- **RoomsList**: Container component managing mutation state
- **RoomTypeCard**: Displays room type with image, specs, and physical rooms
- **RoomSpecs**: Shows size, capacity, and bed info
- **PhysicalRooms**: Container for physical room cards
- **PhysicalRoomCard**: Interactive card with maintenance toggle

---

## Routing Structure

```
/admin/login              → Login (public)

/admin                    → AdminLayout (protected)
  ├── /admin              → Dashboard (reservations)
  └── /admin/rooms        → RoomManagement
```

**Protection**: All routes under `/admin` (except `/admin/login`) are wrapped in `<ProtectedRoute />` which checks for valid `admin_token` cookie.

---

## API Endpoints Used

### Dashboard
- `GET /api/admin/reservations` - Fetch all reservations
- `PUT /api/admin/reservations/:id/status` - Update reservation status

### Room Management
- `GET /api/admin/rooms` - Fetch rooms with physical rooms and overview
- `PUT /api/admin/rooms/:id/maintenance` - Toggle room maintenance

### Authentication
- `POST /api/admin/auth/login` - Admin login
- `GET /api/admin/auth/check` - Verify admin token

---

## WebSocket Events

Both pages listen to Socket.IO events for real-time updates:

**Dashboard**:
- `reservation:created`
- `reservation:statusUpdated`
- `reservation:cancelled`
- `reservation:expired`
- `reservation:completed`

**Room Management**:
- `roomMaintenanceUpdated` (future implementation)

---

## Common Patterns

### Loading States
```jsx
if (isLoading) {
  return <LoadingSpinner />
}
```

### Error States
```jsx
if (error) {
  return <ErrorCard message={error.message} />
}
```

### Empty States
```jsx
if (!data?.length) {
  return <EmptyState message="No reservations found" />
}
```

### Real-time Updates
All data is kept in sync via:
1. React Query for initial fetch
2. Socket.IO for real-time updates
3. Optimistic UI updates for immediate feedback
4. Query invalidation after mutations
