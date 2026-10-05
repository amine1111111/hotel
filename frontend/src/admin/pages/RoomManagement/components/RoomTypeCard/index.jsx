import {
  Card,
  CardContent,
} from '../../../../../components/ui/card'

import PhysicalRooms from '../PhysicalRooms'
import RoomSpecs from '../RoomSpecs'

const formatPrice = (price) => {
  if (typeof price !== 'number') {
    return '—'
  }

  return `${price.toLocaleString('en-DZ')} DA`
}

const RoomTypeCard = ({
  room,
  maintenanceMutation,
  onMaintenanceToggle,
}) => {
  const physicalRooms =
    room.physicalRooms ?? []

  console.log(
    '🟦 [ROOM TYPE CARD] Rendering room type:',
    {
      id: room.id,
      name: room.name,
      category: room.category,
      pricePerNight:
        room.pricePerNight,
      physicalRoomCount:
        physicalRooms.length,
    },
  )

  return (
    <Card
      className="group overflow-hidden border-stone-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md"
    >
      <CardContent className="p-0">
        <div className="relative aspect-[16/7] w-full overflow-hidden bg-stone-100">
          <img
            src={room.roomCard}
            alt={room.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          <div className="absolute left-5 top-5 rounded-full border border-white/30 bg-white/80 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.12em] text-stone-700 backdrop-blur-md">
            {room.category}
          </div>

          <div className="absolute bottom-5 right-5 rounded-xl border border-white/30 bg-white/90 px-4 py-2.5 text-right shadow-sm backdrop-blur-md">
            <p className="text-sm font-semibold text-stone-900">
              {formatPrice(room.pricePerNight)}
            </p>

            <p className="text-[11px] text-stone-500">
              per night
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-stone-900 sm:text-2xl">
              {room.name}
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-500">
              {room.description}
            </p>
          </div>

          <RoomSpecs room={room} />

          <PhysicalRooms
            roomTypeId={room.id}
            physicalRooms={physicalRooms}
            maintenanceMutation={
              maintenanceMutation
            }
            onMaintenanceToggle={
              onMaintenanceToggle
            }
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default RoomTypeCard