import { Wrench } from 'lucide-react'

const getStatusStyles = (status) => {
  switch (status) {
    case 'AVAILABLE':
      return {
        label: 'Available',
        container:
          'border-green-200 bg-green-50',
        text: 'text-green-700',
        dot: 'bg-green-500',
      }

    case 'OCCUPIED':
      return {
        label: 'Occupied',
        container:
          'border-blue-200 bg-blue-50',
        text: 'text-blue-700',
        dot: 'bg-blue-500',
      }

    case 'MAINTENANCE':
      return {
        label: 'Maintenance',
        container:
          'border-orange-200 bg-orange-50',
        text: 'text-orange-700',
        dot: 'bg-orange-500',
      }

    default:
      return {
        label: 'Unknown',
        container:
          'border-stone-200 bg-stone-50',
        text: 'text-stone-600',
        dot: 'bg-stone-400',
      }
  }
}

const PhysicalRoomCard = ({
  physicalRoom,
  maintenanceMutation,
  onMaintenanceToggle,
}) => {
  const statusStyles =
    getStatusStyles(physicalRoom.status)

  const isUpdating =
    maintenanceMutation.isPending &&
    maintenanceMutation.variables?.roomId ===
      physicalRoom.id

  const hasMaintenanceError =
    maintenanceMutation.isError &&
    maintenanceMutation.variables?.roomId ===
      physicalRoom.id

  const canToggleMaintenance =
    physicalRoom.status === 'AVAILABLE' ||
    physicalRoom.status === 'MAINTENANCE'

  console.log(
    '🟦 [PHYSICAL ROOM CARD] Rendering physical room:',
    {
      roomNumber: physicalRoom.roomNumber,
      status: physicalRoom.status,
      maintenance: physicalRoom.maintenance,
      currentReservation:
        physicalRoom.currentReservation,
      isUpdating,
      hasMaintenanceError,
      canToggleMaintenance,
    },
  )

  return (
    <div
      className={`rounded-lg border px-3 py-2.5 ${statusStyles.container}`}
    >

      <div className="flex items-center justify-between gap-3">

        <span className="text-sm font-medium text-stone-800">
          {physicalRoom.roomNumber}
        </span>

        <span
          className={`inline-flex items-center gap-1.5 text-xs font-medium ${statusStyles.text}`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${statusStyles.dot}`}
          />

          {statusStyles.label}
        </span>

      </div>

      {/* Maintenance control */}
      <button
        type="button"
        onClick={() =>
          onMaintenanceToggle(physicalRoom)
        }
        disabled={
          !canToggleMaintenance ||
          maintenanceMutation.isPending
        }
        title={
          physicalRoom.status === 'OCCUPIED'
            ? 'Occupied rooms cannot be placed into maintenance.'
            : physicalRoom.maintenance
              ? 'Remove room from maintenance'
              : 'Place room into maintenance'
        }
        className={`mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-md border px-2 py-1.5 text-[11px] font-medium transition-colors ${
          physicalRoom.maintenance
            ? 'border-orange-200 bg-white text-orange-700 hover:bg-orange-100'
            : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-100'
        } disabled:cursor-not-allowed disabled:opacity-50`}
      >
        <Wrench
          size={13}
          strokeWidth={1.8}
        />

        {isUpdating
          ? 'Updating...'
          : physicalRoom.maintenance
            ? 'Remove maintenance'
            : 'Maintenance'}
      </button>

      {/* Show an error only on the room that caused it. */}
      {hasMaintenanceError && (
        <div className="mt-2 rounded-md border border-red-200 bg-red-50 px-2 py-1.5">
          <p className="text-[10px] font-medium leading-4 text-red-700">
            {maintenanceMutation.error?.message ||
              'Failed to update room maintenance.'}
          </p>
        </div>
      )}

    </div>
  )
}

export default PhysicalRoomCard