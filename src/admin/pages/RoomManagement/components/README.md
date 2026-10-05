# Room Management Components

Components for displaying and managing room types and physical rooms in the admin panel.

## Component Architecture

```
RoomsList (container)
    ↓
RoomTypeCard (room type display)
    ├── RoomSpecs (specifications)
    └── PhysicalRooms (physical rooms container)
            ↓
        PhysicalRoomCard (individual room control)
```

---

## RoomsList

**File**: `RoomsList/index.jsx`

**Type**: Container Component

**Purpose**: Top-level container that manages room display and maintenance mutation state.

### Responsibilities

1. **State Management**
   - Owns the `useUpdateAdminRoomMaintenance` mutation hook
   - All physical rooms share this single mutation instance

2. **Event Handling**
   - Defines `handleMaintenanceToggle(physicalRoom)` function
   - Passes handler down to child components

3. **UI States**
   - Loading: Animated spinner with message
   - Error: Red alert card with error details
   - Empty: "No rooms found" message with icon
   - Success: Renders room type cards

### Props

```typescript
{
  rooms: Array<RoomType>,     // Room types with physical rooms
  isLoading: boolean,         // Loading state
  error: Error | null         // Error object
}
```

### Maintenance Toggle Logic

```javascript
const handleMaintenanceToggle = (physicalRoom) => {
  const nextMaintenance = !physicalRoom.maintenance
  
  maintenanceMutation.mutate({
    roomId: physicalRoom.id,
    maintenance: nextMaintenance
  })
}
```

### Props Passed to Children

```javascript
<RoomTypeCard
  key={room.id}
  room={room}
  maintenanceMutation={maintenanceMutation}
  onMaintenanceToggle={handleMaintenanceToggle}
/>
```

---

## RoomTypeCard

**File**: `RoomTypeCard/index.jsx`

**Type**: Composite Component

**Purpose**: Displays a complete room type with image, details, specs, and physical rooms.

### Layout Structure

```
┌─────────────────────────────────────┐
│  [Room Image with overlay badges]   │
│  Category badge (top-left)          │
│  Price badge (bottom-right)         │
├─────────────────────────────────────┤
│  Room Name                          │
│  Description                        │
│                                     │
│  [RoomSpecs: Size | Guests | Bed]  │
│                                     │
│  [PhysicalRooms: List of rooms]    │
└─────────────────────────────────────┘
```

### Props

```typescript
{
  room: RoomType,                    // Room type data
  maintenanceMutation: Mutation,     // Shared mutation instance
  onMaintenanceToggle: Function      // Maintenance toggle handler
}
```

### Room Data Structure

```javascript
{
  id: "uuid",
  name: "Deluxe Suite",
  category: "LUXURY",
  pricePerNight: 25000,
  description: "Spacious suite with...",
  size: 45,
  maxGuests: 2,
  bedQuantity: 1,
  bedType: "king",
  roomCard: "/images/deluxe-suite.jpg",
  physicalRooms: [...]
}
```

### Features

- **Hover Effect**: Image scales to 103% on hover
- **Price Formatting**: Uses Algerian Dinar (DA) format
- **Gradient Overlay**: Bottom gradient for better text contrast
- **Responsive**: Adjusts padding and layout on different screens

---

## RoomSpecs

**File**: `RoomSpecs/index.jsx`

**Type**: Presentational Component (Read-only)

**Purpose**: Displays room specifications in a 3-column grid.

### Display Format

```
┌─────────────┬─────────────┬─────────────┐
│  📏 Size    │  👥 Guests  │  🛏️ Bed     │
│  45 m²      │  2          │  1 × king   │
└─────────────┴─────────────┴─────────────┘
```

### Props

```typescript
{
  room: {
    size: number,         // Square meters
    maxGuests: number,    // Maximum occupancy
    bedQuantity: number,  // Number of beds
    bedType: string      // Bed type (king, queen, twin, etc.)
  }
}
```

### Icons Used

- **Ruler**: Size specification
- **Users**: Guest capacity
- **BedDouble**: Bed information

### Styling

- Light gray background (`bg-stone-50`)
- White cards for each spec
- Uppercase labels with tracking
- Responsive grid (stacks on mobile)

---

## PhysicalRooms

**File**: `PhysicalRooms/index.jsx`

**Type**: Container Component

**Purpose**: Groups and displays all physical rooms for a room type.

### Layout

```
─────────────────────────────────────
🚪 Physical rooms              5 rooms
─────────────────────────────────────

[201] [202] [203] [204] [205]
```

### Props

```typescript
{
  physicalRooms: Array<PhysicalRoom>,
  maintenanceMutation: Mutation,
  onMaintenanceToggle: Function
}
```

### Grid Layout

- **Mobile**: 1 column
- **Small**: 2 columns
- **Large**: 3 columns
- **Extra Large**: 5 columns

### Features

- Section header with door icon
- Room count display
- Gap spacing between cards
- Responsive grid system

---

## PhysicalRoomCard

**File**: `PhysicalRoomCard/index.jsx`

**Type**: Interactive Component

**Purpose**: Individual physical room card with status display and maintenance toggle.

### Card Layout

```
┌─────────────────────────┐
│  201          ● Available│
│                         │
│  [🔧 Maintenance]       │
└─────────────────────────┘
```

### Props

```typescript
{
  physicalRoom: {
    id: string,
    roomNumber: string,
    status: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE",
    maintenance: boolean,
    currentReservation: Reservation | null
  },
  maintenanceMutation: Mutation,
  onMaintenanceToggle: Function
}
```

### Status Styling

Uses `getStatusStyles()` function:

```javascript
{
  AVAILABLE: {
    label: "Available",
    container: "border-green-200 bg-green-50",
    text: "text-green-700",
    dot: "bg-green-500"
  },
  OCCUPIED: {
    label: "Occupied",
    container: "border-blue-200 bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-500"
  },
  MAINTENANCE: {
    label: "Maintenance",
    container: "border-orange-200 bg-orange-50",
    text: "text-orange-700",
    dot: "bg-orange-500"
  }
}
```

### Maintenance Toggle Button

**States**:
- **Available → Maintenance**: Gray button, "Maintenance"
- **Maintenance → Available**: Orange button, "Remove maintenance"
- **Occupied**: Disabled, grayed out

**Validation**:
```javascript
const canToggleMaintenance = 
  physicalRoom.status === 'AVAILABLE' || 
  physicalRoom.status === 'MAINTENANCE'
```

**Loading State**:
```javascript
const isUpdating = 
  maintenanceMutation.isPending &&
  maintenanceMutation.variables?.roomId === physicalRoom.id
```

Shows "Updating..." text during mutation.

**Error Display**:
```javascript
const hasMaintenanceError = 
  maintenanceMutation.isError &&
  maintenanceMutation.variables?.roomId === physicalRoom.id
```

Shows error message only on the card that triggered the failed mutation.

### Button Tooltip

- **Available/Maintenance**: Shows toggle action
- **Occupied**: "Occupied rooms cannot be placed into maintenance."

### Features

- **Optimistic UI**: Shows loading immediately on click
- **Error Isolation**: Errors only shown on affected room
- **Visual Feedback**: Button color changes based on state
- **Status Indicator**: Colored dot next to status label

---

## Data Flow

### Maintenance Toggle Flow

```
User clicks maintenance button
    ↓
PhysicalRoomCard.onClick()
    ↓
onMaintenanceToggle(physicalRoom)
    ↓
RoomsList.handleMaintenanceToggle()
    ↓
maintenanceMutation.mutate({ roomId, maintenance })
    ↓
API: PUT /api/admin/rooms/:roomId/maintenance
    ↓
Backend updates database
    ↓
Socket.IO: emit 'roomMaintenanceUpdated'
    ↓
React Query invalidates ['admin', 'rooms']
    ↓
All components re-render with fresh data
```

### Mutation State Tracking

```javascript
// Component knows which room is being updated
const isThisRoomUpdating = 
  maintenanceMutation.isPending &&
  maintenanceMutation.variables?.roomId === thisRoom.id

// Component knows if this room's update failed
const thisRoomHasError = 
  maintenanceMutation.isError &&
  maintenanceMutation.variables?.roomId === thisRoom.id
```

---

## Component Responsibilities

| Component | Responsibility |
|-----------|---------------|
| RoomsList | State management, mutation ownership, UI states |
| RoomTypeCard | Layout composition, data distribution |
| RoomSpecs | Specification display (read-only) |
| PhysicalRooms | Physical rooms layout and grouping |
| PhysicalRoomCard | Interactive controls, validation, status display |

---

## Design Patterns

### 1. Single Mutation Instance
- Only `RoomsList` creates the mutation hook
- Shared across all physical room cards
- Prevents duplicate mutation instances

### 2. Prop Drilling
- Mutation and handler passed down 3 levels
- Keeps state management at container level
- Child components stay focused on presentation

### 3. Optimistic State Tracking
- Uses `mutation.variables.roomId` to identify pending room
- Each card checks if it's the one being updated
- Provides room-specific loading/error states

### 4. Status-Based Styling
- `getStatusStyles()` centralizes color logic
- Consistent color scheme across components
- Easy to extend with new statuses

### 5. Validation Before Action
- Business rules enforced in UI
- Clear feedback for disabled actions
- Prevents invalid API calls

---

## Styling Conventions

### Colors
- **Green**: Available, success states
- **Blue**: Occupied, in-use states
- **Orange**: Maintenance, warning states
- **Red**: Errors, destructive actions
- **Gray**: Disabled, neutral states

### Spacing
- Cards: `p-3` to `p-8` depending on size
- Gaps: `gap-2` to `gap-6` for grids
- Borders: `border-stone-200` for subtle separation

### Interactions
- Hover states on all interactive elements
- Disabled cursor for non-clickable items
- Smooth transitions (300ms default)

### Typography
- Headings: `font-semibold`, `tracking-tight`
- Labels: Uppercase with `tracking-[0.12em]`
- Body: `text-sm` to `text-base`, `text-stone-600`
