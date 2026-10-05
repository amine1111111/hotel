import useRooms from "../../hooks/useRooms"

import RoomsHeader from "./components/RoomsHeader"
import RoomGrid from "./components/RoomGrid"

const Rooms = () => {
  const {
    data: rooms,
    isLoading,
    error,
  } = useRooms()

  if (isLoading) {
    return (
      <main className="w-full min-w-0 bg-[#f4eee7] px-5 py-10 text-[#2c2420] sm:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-[1600px]">
          <p className="text-sm text-[#77716b]">
            Loading rooms...
          </p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="w-full min-w-0 bg-[#f4eee7] px-5 py-10 text-[#2c2420] sm:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-[1600px]">
          <p className="text-sm text-[#77716b]">
            Failed to load rooms.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="w-full min-w-0 overflow-x-clip bg-[#f4eee7] text-[#2c2420] px-5 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto w-full max-w-[1600px] min-w-0">
        <RoomsHeader />
        <RoomGrid rooms={rooms} />
      </div>
    </main>
  )
}

export default Rooms