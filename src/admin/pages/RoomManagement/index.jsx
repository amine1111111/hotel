import {
  BedDouble,
  CheckCircle2,
  CircleAlert,
  DoorOpen,
} from 'lucide-react'

import useAdminRooms from '../../hooks/useAdminRooms'
import RoomsList from './components/RoomsList'

const RoomManagement = () => {
  console.log('========== FRONTEND ADMIN: ROOM MANAGEMENT PAGE ==========')

  const {
    data,
    isLoading,
    isError,
    error,
  } = useAdminRooms()

  const rooms = data?.rooms ?? []
  const overview = data?.overview ?? null

  console.log(
    'Frontend admin room management response:',
    data,
  )

  console.log(
    'Frontend admin room management loading:',
    isLoading,
  )

  console.log(
    'Frontend admin room management error:',
    error,
  )

  console.log(
    'Frontend admin room type count:',
    rooms.length,
  )

  console.log(
    'Frontend admin room overview:',
    overview,
  )

  if (isError) {
    console.error(
      '🟥 Frontend admin room management failed:',
      error,
    )
  }

  if (!isLoading && !isError && rooms.length === 0) {
    console.warn(
      '🟨 Frontend admin room management returned no room types',
    )
  }

  // Overview cards use the values calculated by the admin API.
  const overviewCards = [
    {
      label: 'Total Rooms',
      value: overview?.totalPhysicalRooms ?? 0,
      icon: BedDouble,
      iconBackground: 'bg-stone-100',
      iconColor: 'text-stone-600',
    },
    {
      label: 'Available',
      value: overview?.availableRooms ?? 0,
      icon: CheckCircle2,
      iconBackground: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      label: 'Occupied',
      value: overview?.occupiedRooms ?? 0,
      icon: DoorOpen,
      iconBackground: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Maintenance',
      value: overview?.maintenanceRooms ?? 0,
      icon: CircleAlert,
      iconBackground: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
  ]

  console.log(
    '🟦 [ADMIN ROOMS UI] Overview cards:',
    overviewCards,
  )

  return (
    <section className="space-y-8">

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-stone-900">
          Room Management
        </h1>

        <p className="mt-1 text-sm text-stone-500">
          Manage room types and monitor physical room status.
        </p>
      </div>

      {/* Room overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {overviewCards.map((card) => {
          const Icon = card.icon

          return (
            <div
              key={card.label}
              className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">

                <div>
                  <p className="text-sm font-medium text-stone-500">
                    {card.label}
                  </p>

                  <p className="mt-3 text-3xl font-semibold tracking-tight text-stone-900">
                    {isLoading ? '—' : card.value}
                  </p>
                </div>

                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.iconBackground}`}
                >
                  <Icon
                    size={19}
                    strokeWidth={1.7}
                    className={card.iconColor}
                  />
                </div>

              </div>
            </div>
          )
        })}

      </div>

      {/* Room type cards */}
      <RoomsList
        rooms={rooms}
        isLoading={isLoading}
        error={error}
      />

    </section>
  )
}

export default RoomManagement