import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  useLocation,
  useNavigate,
} from 'react-router-dom'

import BookingSummary from './components/BookingSummary'
import GuestInformation from './components/GuestInformation'
import ReservationSuccessModal from './components/ReservationSuccessModal'

const BookingRecap = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useTranslation('booking')

  const [reservation, setReservation] =
    useState(null)

  const bookingData = location.state

  if (!bookingData) {
    return (
      <main className="min-h-screen bg-background px-4 py-20 text-foreground sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-2xl font-semibold text-foreground">
            {t('recap.notFound')}
          </h1>

          <p className="mt-3 text-muted-foreground">
            {t('recap.expired')}
          </p>

          <button
            type="button"
            onClick={() => navigate('/rooms')}
            className="
              mt-8
              rounded-lg
              bg-primary
              px-6
              py-3
              text-sm
              font-medium
              text-primary-foreground
              transition
              hover:bg-secondary
              hover:text-secondary-foreground
            "
          >
            {t('recap.backToRooms')}
          </button>
        </div>
      </main>
    )
  }

  const {
    room,
    booking,
    pricePerNight,
    totalPrice,
  } = bookingData

  const handleReservationSuccess = (
    reservationData
  ) => {
    setReservation(reservationData)
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {t('recap.eyebrow')}
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {t('recap.title')}
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
            {t('recap.description')}
          </p>
        </div>

        <div
          className="
            grid
            grid-cols-1
            gap-6
            md:grid-cols-2
            md:items-start
          "
        >
          <div
            className="
              rounded-2xl
              border
              border-border
              bg-card
              p-6
              shadow-sm
              sm:p-8
            "
          >
            <BookingSummary
              room={room}
              booking={booking}
              pricePerNight={pricePerNight}
              totalPrice={totalPrice}
            />
          </div>

          <div
            className="
              rounded-2xl
              border
              border-border
              bg-card
              p-6
              shadow-sm
              sm:p-8
            "
          >
            <GuestInformation
              booking={booking}
              onSuccess={
                handleReservationSuccess
              }
            />
          </div>
        </div>
      </div>

      {reservation && (
        <ReservationSuccessModal
          reservation={reservation}
          room={room}
          pricePerNight={pricePerNight}
          totalPrice={totalPrice}
        />
      )}
    </main>
  )
}

export default BookingRecap