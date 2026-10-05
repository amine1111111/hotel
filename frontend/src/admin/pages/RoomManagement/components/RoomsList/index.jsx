import { BedDouble } from 'lucide-react'

import {
  Card,
  CardContent,
} from '../../../../../components/ui/card'

import useUpdateAdminRoomMaintenance from '../../../../hooks/useUpdateAdminRoomMaintenance'

import RoomTypeCard from '../RoomTypeCard'

const RoomsList = ({
  rooms,
  isLoading,
  error,
}) => {
  const maintenanceMutation =
    useUpdateAdminRoomMaintenance()

  console.log(
    '========== FRONTEND ADMIN: ROOMS MANAGEMENT =========='
  )

  console.log(
    'Rooms received by management component:',
    rooms,
  )

  console.log(
    'Rooms loading:',
    isLoading,
  )

  console.log(
    'Rooms error:',
    error,
  )

  console.log(
    '🟦 [ADMIN ROOMS UI] Maintenance mutation state:',
    {
      isPending:
        maintenanceMutation.isPending,
      error:
        maintenanceMutation.error,
      variables:
        maintenanceMutation.variables,
    },
  )

  const handleMaintenanceToggle = (
    physicalRoom,
  ) => {
    const nextMaintenance =
      !physicalRoom.maintenance

    console.log(
      '🟧 [ADMIN ROOMS UI] Maintenance toggle requested:',
      {
        roomId: physicalRoom.id,
        roomNumber:
          physicalRoom.roomNumber,
        currentMaintenance:
          physicalRoom.maintenance,
        nextMaintenance,
        status:
          physicalRoom.status,
      },
    )

    maintenanceMutation.mutate({
      roomId: physicalRoom.id,
      maintenance: nextMaintenance,
    })
  }

  if (isLoading) {
    console.log(
      'Frontend admin rooms are still loading',
    )

    return (
      <Card className="border-stone-200 bg-white shadow-sm">
        <CardContent className="flex min-h-64 items-center justify-center p-8">
          <div className="text-center">

            <div className="mx-auto h-8 w-8 animate-pulse rounded-full bg-stone-200" />

            <p className="mt-4 text-sm font-medium text-stone-700">
              Loading rooms...
            </p>

            <p className="mt-1 text-sm text-stone-500">
              Fetching room information.
            </p>

          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    console.error(
      'Frontend admin rooms error:',
      error,
    )

    return (
      <Card className="border-stone-200 bg-white shadow-sm">
        <CardContent className="flex min-h-64 items-center justify-center p-8">
          <div className="text-center">

            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
              <span className="text-sm font-semibold text-red-600">
                !
              </span>
            </div>

            <p className="mt-4 text-sm font-medium text-red-600">
              Failed to load rooms
            </p>

            <p className="mt-1 text-sm text-stone-500">
              {error.message}
            </p>

          </div>
        </CardContent>
      </Card>
    )
  }

  if (!rooms?.length) {
    console.log(
      'No room types received',
    )

    return (
      <Card className="border-stone-200 bg-white shadow-sm">
        <CardContent className="flex min-h-64 items-center justify-center p-8">
          <div className="text-center">

            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-stone-100">
              <BedDouble
                size={18}
                strokeWidth={1.7}
                className="text-stone-500"
              />
            </div>

            <p className="mt-4 text-sm font-medium text-stone-700">
              No rooms found
            </p>

            <p className="mt-1 text-sm text-stone-500">
              Room types will appear here when they are available.
            </p>

          </div>
        </CardContent>
      </Card>
    )
  }

  console.log(
    'Rendering room management cards:',
    rooms.length,
  )

  return (
    <div className="mx-auto w-full max-w-[80vw] space-y-6">

      {rooms.map((room) => (
        <RoomTypeCard
          key={room.id}
          room={room}
          maintenanceMutation={
            maintenanceMutation
          }
          onMaintenanceToggle={
            handleMaintenanceToggle
          }
        />
      ))}

    </div>
  )
}

export default RoomsList