                    HOTEL DATABASE
                         │
             ┌───────────┴───────────┐
             │                       │
          RoomType              PhysicalRoom
             │                       │
             └───────────┬───────────┘
                         │
                    Reservations
                         │
              ┌──────────┴──────────┐
              │                     │
          CUSTOMER                ADMIN
              │                     │
      GET /api/rooms       GET /api/admin/rooms
              │                     │
              │             ┌───────┴────────┐
              │             │                │
              │         Room Types     Physical Rooms
              │                              │
              │                     Available / Occupied
              │                              │
              │                         Maintenance
              │
        Booking / Availability






        1. Verify the legacy backend/data/rooms.js

Before deleting it, search the backend for imports/references to it.

If nothing imports it → delete it.
If something still imports it → identify why before touching it.
2. Decide the Room Management data model

Before writing code, finalize how a physical room's state works:

Available → no active reservation, not maintenance
Occupied → currently inside an active reservation
Maintenance → manually disabled by admin

This likely requires adding a maintenance-related field to PhysicalRoom.

3. Add the admin API separately

Do not modify the existing customer GET /api/rooms contract.

Create an admin route such as:

/api/admin/rooms

protected by requireAdmin.

It should provide the Room Management page with:

room types
physical rooms
prices
capacities
physical-room status
relevant current reservation information
overview counts
4. Add safe admin mutations

Then define exactly what admins can change:

Room Type
├── edit price
├── edit capacity/details
└── possibly add/remove room type

Physical Room
├── add room
├── change room number
├── mark maintenance
├── remove maintenance
└── possibly remove room

We'll establish rules around reservations before implementing deletion/editing.

5. Add the backend Socket.IO events

Reuse the existing Socket.IO server.

For example, when a reservation changes, Room Management can update its room status without requiring a page refresh.

No second socket server.

6. Update useAdminRooms

Change it from:

getRooms()
↓
GET /api/rooms

to the dedicated admin API:

getAdminRooms()
↓
GET /api/admin/rooms

while keeping:

['admin', 'rooms']

as its React Query key.

7. Rebuild the Room Management UI

First:

Overview

25 Total
22 Available
2 Occupied
1 Maintenance

Then:

Room Types

Each room type shows its important information and physical rooms.

Then:

Physical Room Management

Each physical room gets a clear state and appropriate actions.

8. Test against the existing system

This is critical.

After implementation, verify:

Customer /rooms
Customer /rooms/:id
Availability
Booking
Reservation creation
Admin reservations
Confirm reservation
Cancel reservation
Reservation cleanup
Socket.IO updates
Room Management
Maintenance rooms not becoming bookable
Price changes reflected where intended
9. Only then clean up old code

After everything works:

remove unused backend/data/rooms.js
remove obsolete frontend debugging logs
remove obsolete code/comments
keep shared customer APIs stable