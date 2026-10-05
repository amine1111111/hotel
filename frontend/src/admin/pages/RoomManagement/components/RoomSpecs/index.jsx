import {
  BedDouble,
  Ruler,
  Users,
} from 'lucide-react'

const RoomSpecs = ({ room }) => {
  console.log(
    '🟦 [ROOM SPECS] Rendering room specifications:',
    {
      roomId: room?.id,
      size: room?.size,
      maxGuests: room?.maxGuests,
      bedQuantity: room?.bedQuantity,
      bedType: room?.bedType,
    },
  )

  return (
    <div className="mt-6 grid grid-cols-1 divide-y divide-stone-200 rounded-xl border border-stone-200 bg-stone-50 sm:grid-cols-3 sm:divide-x sm:divide-y-0">

      {/* Size */}
      <div className="flex items-center gap-3 p-4">

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white">
          <Ruler
            size={17}
            strokeWidth={1.7}
            className="text-stone-500"
          />
        </div>

        <div className="min-w-0">

          <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-stone-400">
            Size
          </p>

          <p className="mt-1 text-sm font-medium text-stone-900">
            {room.size} m²
          </p>

        </div>

      </div>

      {/* Capacity */}
      <div className="flex items-center gap-3 p-4">

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white">
          <Users
            size={17}
            strokeWidth={1.7}
            className="text-stone-500"
          />
        </div>

        <div className="min-w-0">

          <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-stone-400">
            Guests
          </p>

          <p className="mt-1 text-sm font-medium text-stone-900">
            {room.maxGuests ?? '—'}
          </p>

        </div>

      </div>

      {/* Bed */}
      <div className="flex items-center gap-3 p-4">

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white">
          <BedDouble
            size={17}
            strokeWidth={1.7}
            className="text-stone-500"
          />
        </div>

        <div className="min-w-0">

          <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-stone-400">
            Bed
          </p>

          <p className="mt-1 truncate text-sm font-medium capitalize text-stone-900">
            {room.bedQuantity ?? '—'} ×{' '}
            {room.bedType ?? '—'}
          </p>

        </div>

      </div>

    </div>
  )
}

export default RoomSpecs