import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'

import useRoom from '../../hooks/useRoom'

import BookingForm from './components/BookingForm'

const Booking = () => {
  const [searchParams] = useSearchParams()
  const { t } = useTranslation('booking')

  const roomId = searchParams.get('room')

  const {
    data: room,
    isLoading,
    error,
  } = useRoom(roomId)

  if (isLoading) {
    return (
      <main className="min-h-screen w-full bg-background px-5 py-16 text-foreground sm:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-3xl">
          <p className="text-sm text-muted-foreground">
            {t('details.loading')}
          </p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen w-full bg-background px-5 py-16 text-foreground sm:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-3xl">
          <h1 className="text-3xl font-light tracking-tight sm:text-4xl">
            {t('details.loadError')}
          </h1>

          <p className="mt-3 text-sm text-muted-foreground">
            {error.message}
          </p>
        </div>
      </main>
    )
  }

  if (!room) {
    return (
      <main className="min-h-screen w-full bg-background px-5 py-16 text-foreground sm:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-3xl">
          <h1 className="text-3xl font-light tracking-tight sm:text-4xl">
            {t('details.notFound')}
          </h1>

          <p className="mt-3 text-sm text-muted-foreground">
            {t('details.notFoundDescription')}
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen w-full overflow-x-clip bg-background px-5 py-16 text-foreground sm:px-8 sm:py-20 lg:px-12 lg:py-24">
      <div className="mx-auto w-full max-w-3xl">
        <header className="mb-10">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {t('header.eyebrow')}
          </p>

          <h1 className="text-4xl font-light leading-none tracking-[-0.04em] sm:text-5xl lg:text-6xl">
            {t('header.title')}
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
            {t('header.description')}
          </p>
        </header>

        <div className="rounded-2xl bg-card p-5 shadow-sm sm:p-8">
          <BookingForm room={room} />
        </div>
      </div>
    </main>
  )
}

export default Booking