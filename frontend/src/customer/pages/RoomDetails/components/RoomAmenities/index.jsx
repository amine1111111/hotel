import { useTranslation } from 'react-i18next'

import {
  Card,
  CardContent,
} from '@/components/ui/card'

const RoomAmenities = ({ amenities }) => {
  const { t } = useTranslation('rooms')

  return (
    <section className="py-8 sm:py-10 lg:py-12">
      <div className="mb-6">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
          {t('amenities.eyebrow')}
        </p>

        <h2 className="mt-2 text-2xl font-semibold text-stone-900 sm:text-3xl">
          {t('amenities.title')}
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {amenities.map((amenity) => (
          <Card
            key={amenity}
            className="
              border-stone-200
              shadow-none
              transition-colors
              hover:bg-stone-50
            "
          >
            <CardContent className="flex items-center gap-3 p-4">
              <span className="flex h-2 w-2 shrink-0 rounded-full bg-stone-400" />

              <span className="text-sm text-stone-700">
                {t(`amenities.items.${amenity}`)}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

export default RoomAmenities