import {
  DoorOpen,
  Plus,
  X,
} from 'lucide-react'
import { useState } from 'react'

import useCreateAdminRoom from '../../../../hooks/useCreateAdminRoom'

import PhysicalRoomCard from '../PhysicalRoomCard'

const PhysicalRooms = ({
  roomTypeId,
  physicalRooms,
  maintenanceMutation,
  onMaintenanceToggle,
}) => {
  const rooms = physicalRooms ?? []
  const totalPhysicalRooms = rooms.length

  const createRoomMutation =
    useCreateAdminRoom()

  const [
    isCreateFormOpen,
    setIsCreateFormOpen,
  ] = useState(false)

  const [
    roomNumber,
    setRoomNumber,
  ] = useState('')

  console.log(
    '🟦 [PHYSICAL ROOMS] Rendering physical rooms:',
    {
      roomTypeId,
      count: totalPhysicalRooms,
      rooms,
      isCreateFormOpen,
      isCreating:
        createRoomMutation.isPending,
    },
  )

  const handleCreateRoom = (
    event,
  ) => {
    event.preventDefault()

    const normalizedRoomNumber =
      roomNumber.trim()

    console.log(
      '🟧 [PHYSICAL ROOMS] Create room submitted:',
      {
        roomTypeId,
        roomNumber:
          normalizedRoomNumber,
      },
    )

    if (!normalizedRoomNumber) {
      console.warn(
        '🟨 [PHYSICAL ROOMS] Room number is empty.',
      )

      return
    }

    createRoomMutation.mutate(
      {
        roomTypeId,
        roomNumber:
          normalizedRoomNumber,
      },
      {
        onSuccess: () => {
          console.log(
            '🟩 [PHYSICAL ROOMS] Room created successfully. Closing form.',
          )

          setRoomNumber('')
          setIsCreateFormOpen(false)
        },
      },
    )
  }

  const handleCancelCreate = () => {
    if (
      createRoomMutation.isPending
    ) {
      return
    }

    console.log(
      '🟦 [PHYSICAL ROOMS] Closing create room form.',
    )

    setRoomNumber('')
    setIsCreateFormOpen(false)
    createRoomMutation.reset()
  }

  const hasCreationError =
    createRoomMutation.isError

  return (
    <div className="mt-7 border-t border-stone-100 pt-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <DoorOpen
            size={17}
            strokeWidth={1.7}
            className="text-stone-400"
          />

          <p className="text-sm font-medium text-stone-800">
            Physical rooms
          </p>

          <p className="text-xs text-stone-400">
            {totalPhysicalRooms}{' '}
            {totalPhysicalRooms === 1
              ? 'room'
              : 'rooms'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            console.log(
              '🟦 [PHYSICAL ROOMS] Opening create room form.',
              {
                roomTypeId,
              },
            )

            createRoomMutation.reset()
            setIsCreateFormOpen(true)
          }}
          disabled={
            createRoomMutation.isPending
          }
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 transition-colors hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus
            size={14}
            strokeWidth={1.8}
          />

          Add room
        </button>
      </div>

      {isCreateFormOpen && (
        <form
          onSubmit={handleCreateRoom}
          className="mt-4 rounded-lg border border-stone-200 bg-stone-50 p-4"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label
                htmlFor={`room-number-${roomTypeId}`}
                className="block text-xs font-medium text-stone-700"
              >
                Room number
              </label>

              <input
                id={`room-number-${roomTypeId}`}
                type="text"
                inputMode="numeric"
                value={roomNumber}
                onChange={(event) =>
                  setRoomNumber(
                    event.target.value,
                  )
                }
                placeholder="e.g. 306"
                disabled={
                  createRoomMutation.isPending
                }
                autoFocus
                className="mt-1.5 w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 outline-none transition focus:border-stone-400 focus:ring-2 focus:ring-stone-200 disabled:cursor-not-allowed disabled:bg-stone-100"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={
                  createRoomMutation.isPending ||
                  !roomNumber.trim()
                }
                className="inline-flex items-center justify-center rounded-md bg-stone-900 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {createRoomMutation.isPending
                  ? 'Creating...'
                  : 'Create room'}
              </button>

              <button
                type="button"
                onClick={
                  handleCancelCreate
                }
                disabled={
                  createRoomMutation.isPending
                }
                className="inline-flex items-center justify-center gap-1.5 rounded-md border border-stone-200 bg-white px-3 py-2 text-xs font-medium text-stone-600 transition-colors hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X
                  size={13}
                  strokeWidth={1.8}
                />

                Cancel
              </button>
            </div>
          </div>

          {hasCreationError && (
            <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2">
              <p className="text-xs font-medium leading-5 text-red-700">
                {createRoomMutation.error?.message ||
                  'Failed to create physical room.'}
              </p>
            </div>
          )}
        </form>
      )}

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {rooms.map(
          (physicalRoom) => (
            <PhysicalRoomCard
              key={physicalRoom.id}
              physicalRoom={
                physicalRoom
              }
              maintenanceMutation={
                maintenanceMutation
              }
              onMaintenanceToggle={
                onMaintenanceToggle
              }
            />
          ),
        )}
      </div>
    </div>
  )
}

export default PhysicalRooms