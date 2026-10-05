import { useTranslation } from 'react-i18next'

const BookingSummary = ({
  room,
  booking,
  pricePerNight,
  totalPrice,
}) => {
  const { t, i18n } = useTranslation('booking')
  const { t: tRooms } = useTranslation('rooms')

  const roomPath = `rooms.${room.id}`

  const roomName = tRooms(`${roomPath}.name`)
  const roomDescription = tRooms(
    `${roomPath}.description`
  )

  const formatDate = (date) => {
    const [year, month, day] = date.split('-')

    const dateObject = new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    )

    return dateObject.toLocaleDateString(
      i18n.language === 'fr' ? 'fr-FR' : 'en-GB',
      {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }
    )
  }

  return (
    <section>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground">
          {t('summary.title')}
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          {t('summary.description')}
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={room.images.roomCard}
            alt={roomName}
            className="
              h-full
              w-full
              object-cover
            "
          />
        </div>

        <div className="p-5">
          <h3 className="text-lg font-semibold text-foreground">
            {roomName}
          </h3>

          {roomDescription && (
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {roomDescription}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground/70">
            {t('summary.checkIn')}
          </p>

          <p className="mt-1 text-sm font-medium text-foreground">
            {formatDate(booking.checkIn)}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground/70">
            {t('summary.checkOut')}
          </p>

          <p className="mt-1 text-sm font-medium text-foreground">
            {formatDate(booking.checkOut)}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4 border-t border-border pt-6">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-muted-foreground">
            {t('summary.nights')}
          </span>

          <span className="text-sm font-medium text-foreground">
            {booking.nights}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-muted-foreground">
            {t('summary.adults')}
          </span>

          <span className="text-sm font-medium text-foreground">
            {booking.adults}
          </span>
        </div>

        {booking.children > 0 && (
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-muted-foreground">
              {t('summary.children')}
            </span>

            <span className="text-sm font-medium text-foreground">
              {booking.children}
            </span>
          </div>
        )}
      </div>

      <div className="mt-6 space-y-4 border-t border-border pt-6">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-muted-foreground">
            {t('summary.pricePerNight')}
          </span>

          <span className="text-sm font-medium text-foreground">
            {pricePerNight.toLocaleString()} DA
          </span>
        </div>

        <div className="flex items-end justify-between gap-4 border-t border-border pt-4">
          <span className="text-base font-medium text-foreground">
            {t('summary.total')}
          </span>

          <span className="text-xl font-semibold text-foreground">
            {totalPrice.toLocaleString()} DA
          </span>
        </div>
      </div>
    </section>
  )
}

export default BookingSummary