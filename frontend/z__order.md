
3. All frontend API communication

This is very important.

src/
└── api/
    ├── rooms.js
    ├── adminAuth.js
    └── adminReservations.js

This tells me exactly what requests the frontend makes to the backend.

4. Customer room data flow

Now follow the room data from API → React Query → UI.

src/
└── customer/
    ├── hooks/
    │   ├── useRooms.js
    │   └── useRoom.js
    │
    └── pages/
        ├── Rooms/
        │   ├── index.jsx
        │   └── components/
        │       ├── RoomCard/
        │       │   └── index.jsx
        │       ├── RoomGrid/
        │       │   └── index.jsx
        │       └── RoomsHeader/
        │           └── index.jsx
        │
        └── RoomDetails/
            ├── index.jsx
            └── components/
                ├── RoomInfo/
                │   └── index.jsx
                ├── RoomAmenities/
                │   └── index.jsx
                ├── RoomGallery/
                │   └── index.jsx
                └── BookRoom/
                    └── index.jsx

This gives me the complete room → room details → booking initiation chain.

5. Customer booking flow

This is essential because Room Management must not interfere with it.

src/
└── customer/
    └── pages/
        └── Booking/
            ├── index.jsx
            └── components/
                └── BookingForm/
                    └── index.jsx
6. Booking recap

Then:

src/
└── customer/
    └── pages/
        └── Booking/
            └── Recap/
                ├── index.jsx
                └── components/
                    ├── BookingSummary/
                    │   └── index.jsx
                    ├── GuestInformation/
                    │   └── index.jsx
                    └── ReservationSuccessModal/
                        └── index.jsx

This is especially important because this is where the reservation is likely actually submitted.

7. Confirmation / cancellation

Then inspect the rest of the reservation lifecycle:

src/
└── customer/
    └── pages/
        ├── Confirmation/
        │   └── index.jsx
        │
        └── Cancellation/
            └── index.jsx

If either has backend-related components/files, show those too.

8. Admin authentication

Before Room Management:

src/
└── admin/
    ├── socket.js
    │
    ├── components/
    │   └── ProtectedRoute/
    │       └── index.jsx
    │
    └── pages/
        └── Login/
            └── index.jsx

This establishes how admin authentication and the admin_token cookie are handled from the frontend.

9. Admin layout/navigation
src/
└── admin/
    ├── pages/
    │   └── index.jsx
    │
    └── components/
        └── AdminNavigation/
            └── index.jsx
10. Admin reservations

Before touching Room Management, I want the complete admin reservation side understood:

src/
└── admin/
    ├── hooks/
    │   ├── useAdminReservations.js
    │   └── useUpdateAdminReservationStatus.js
    │
    └── pages/
        └── Dashboard/
            ├── index.jsx
            └── components/
                └── ReservationsList/
                    └── index.jsx

This is important because room availability/status is currently derived from reservations on the backend.

11. Admin Room Management

Only now:

src/
└── admin/
    ├── hooks/
    │   └── useAdminRooms.js
    │
    └── pages/
        └── RoomManagement/
            ├── index.jsx
            └── components/
                └── RoomsList/
                    └── index.jsx

At this point I'll understand:

Database
   ↓
Backend RoomType / PhysicalRoom
   ↓
GET /api/rooms
   ↓
api/rooms.js
   ↓
useRooms / useRoom
   ↓
Customer Rooms
   ↓
Room Details
   ↓
Booking
   ↓
Recap
   ↓
Reservation
   ↓
Admin Reservations
   ↓
Admin Room Management

That's the chain we need before making architectural decisions.

12. Anything imported by the above

If, while inspecting those files, I encounter something like:

import { something } from '../../services/...'

or a shared component/hook that materially affects the backend flow, then we'll inspect that file too.

We don't need to inspect unrelated visual pages such as About, FAQ, Gallery, Privacy, etc.

Exact sequence to follow

For convenience, here's the sequence you can work through:

01. src/main.jsx
02. src/App.jsx
03. src/router.jsx

04. src/providers/QueryProvider.jsx
05. src/providers/index.jsx

06. src/lib/i18n.js
07. src/lib/utils.js

08. src/api/rooms.js
09. src/api/adminAuth.js
10. src/api/adminReservations.js

11. customer/hooks/useRooms.js
12. customer/hooks/useRoom.js

13. customer/pages/Rooms/index.jsx
14. customer/pages/Rooms/components/RoomCard/index.jsx
15. customer/pages/Rooms/components/RoomGrid/index.jsx
16. customer/pages/Rooms/components/RoomsHeader/index.jsx

17. customer/pages/RoomDetails/index.jsx
18. customer/pages/RoomDetails/components/RoomInfo/index.jsx
19. customer/pages/RoomDetails/components/RoomAmenities/index.jsx
20. customer/pages/RoomDetails/components/RoomGallery/index.jsx
21. customer/pages/RoomDetails/components/BookRoom/index.jsx

22. customer/pages/Booking/index.jsx
23. customer/pages/Booking/components/BookingForm/index.jsx

24. customer/pages/Booking/Recap/index.jsx
25. customer/pages/Booking/Recap/components/BookingSummary/index.jsx
26. customer/pages/Booking/Recap/components/GuestInformation/index.jsx
27. customer/pages/Booking/Recap/components/ReservationSuccessModal/index.jsx

28. customer/pages/Confirmation/index.jsx
29. customer/pages/Cancellation/index.jsx

30. admin/socket.js
31. admin/components/ProtectedRoute/index.jsx
32. admin/pages/Login/index.jsx

33. admin/pages/index.jsx
34. admin/components/AdminNavigation/index.jsx

35. admin/hooks/useAdminReservations.js
36. admin/hooks/useUpdateAdminReservationStatus.js
37. admin/pages/Dashboard/index.jsx
38. admin/pages/Dashboard/components/ReservationsList/index.jsx

39. admin/hooks/useAdminRooms.js
40. admin/pages/RoomManagement/index.jsx
41. admin/pages/RoomManagement/components/RoomsList/index.jsx

Don't worry if some files turn out to be empty or only presentational. We'll still establish whether they matter to the data flow.

And src/data/rooms.js should be inspected after this main API/data flow, because we need to determine whether it's still being used and whether it duplicates backend room data.

Start with src/main.jsx.