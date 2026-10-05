We should test the room-management lifecycle in this order:

Create a physical room under an existing room type.

Verify it appears in the frontend admin dashboard.

Verify it becomes available to the customer booking/availability system.

Test its maintenance state.

Create a reservation for it.

Test what happens when trying to delete it with an active/future reservation → should be blocked.


Complete/cancel the reservation as appropriate.


Test deleting the physical room when there are no active/future reservations but historical completed reservations exist.


Verify the physical room disappears while the historical reservation remains intact.