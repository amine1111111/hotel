import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import useRoom from '../../hooks/useRoom'

import RoomGallery from './components/RoomGallery'
import RoomInfo from './components/RoomInfo'
import RoomAmenities from './components/RoomAmenities'
import BookRoom from './components/BookRoom'

const RoomDetails = () => {
  const { id } = useParams()
  const { t } = useTranslation('rooms')

  const {
    data: room,
    isLoading,
    error,
  } = useRoom(id)

  if (isLoading) {
    return (
      <main className="px-5 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p>{t('details.loading')}</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="px-5 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-semibold text-stone-900">
            {t('details.loadError')}
          </h1>

          <p className="mt-2 text-sm text-stone-500">
            {error.message}
          </p>
        </div>
      </main>
    )
  }

  if (!room) {
    return (
      <main className="px-5 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-semibold text-stone-900">
            {t('details.notFound')}
          </h1>
        </div>
      </main>
    )
  }

  return (
    <main className="px-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <RoomGallery room={room} />

        <RoomInfo room={room} />

        <RoomAmenities
          amenities={room.amenities}
        />

        <BookRoom room={room} />
      </div>
    </main>
  )
}

export default RoomDetails