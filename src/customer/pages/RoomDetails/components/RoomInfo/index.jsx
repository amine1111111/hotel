import { useTranslation } from 'react-i18next'

import {
  Users,
  Baby,
  Ruler,
  BedDouble,
  Banknote,
} from 'lucide-react'

const RoomInfo = ({ room }) => {
  const { t } = useTranslation('rooms')

  const roomPath = `rooms.${room.id}`

  const category = t(`${roomPath}.category`)
  const name = t(`${roomPath}.name`)
  const description = t(`${roomPath}.description`)

  return (
    <section className="my-6">
      <div
        className="
          mx-auto
          w-full
          max-w-5xl
          rounded-2xl
          border
          border-stone-200
          bg-white
          p-5
          shadow-sm
          sm:p-7
          lg:p-8
        "
      >
        <p
          className="
            text-xs
            font-medium
            uppercase
            tracking-[0.18em]
            text-stone-500
          "
        >
          {category}
        </p>

        <h1
          className="
            mt-2
            text-2xl
            font-semibold
            tracking-tight
            text-stone-900
            sm:text-3xl
            lg:text-4xl
          "
        >
          {name}
        </h1>

        <p
          className="
            mt-4
            max-w-3xl
            text-sm
            leading-7
            text-stone-500
            sm:text-base
          "
        >
          {description}
        </p>

        <div
          className="
            mt-7
            grid
            gap-3
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >
          <div
            className="
              flex
              items-center
              gap-3
              rounded-xl
              bg-stone-50
              p-4
            "
          >
            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-lg
                bg-white
                text-stone-600
                shadow-sm
              "
            >
              <Ruler className="h-4 w-4" />
            </div>

            <div>
              <p className="text-xs text-stone-400">
                {t('info.size')}
              </p>

              <p className="mt-0.5 text-sm font-medium text-stone-900">
                {room.size} m²
              </p>
            </div>
          </div>

          <div
            className="
              flex
              items-center
              gap-3
              rounded-xl
              bg-stone-50
              p-4
            "
          >
            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-lg
                bg-white
                text-stone-600
                shadow-sm
              "
            >
              <BedDouble className="h-4 w-4" />
            </div>

            <div>
              <p className="text-xs text-stone-400">
                {t('info.beds')}
              </p>

              <p className="mt-0.5 text-sm font-medium capitalize text-stone-900">
                {room.beds.quantity} × {room.beds.type}
              </p>
            </div>
          </div>

          <div
            className="
              flex
              items-center
              gap-3
              rounded-xl
              bg-stone-50
              p-4
            "
          >
            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-lg
                bg-white
                text-stone-600
                shadow-sm
              "
            >
              <Users className="h-4 w-4" />
            </div>

            <div>
              <p className="text-xs text-stone-400">
                {t('info.adults')}
              </p>

              <p className="mt-0.5 text-sm font-medium text-stone-900">
                {t('info.upTo')} {room.capacity.maxAdults}
              </p>
            </div>
          </div>

          <div
            className="
              flex
              items-center
              gap-3
              rounded-xl
              bg-stone-50
              p-4
            "
          >
            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-lg
                bg-white
                text-stone-600
                shadow-sm
              "
            >
              <Baby className="h-4 w-4" />
            </div>

            <div>
              <p className="text-xs text-stone-400">
                {t('info.children')}
              </p>

              <p className="mt-0.5 text-sm font-medium text-stone-900">
                {room.capacity.maxChildren > 0
                  ? `${t('info.upTo')} ${room.capacity.maxChildren}`
                  : t('info.notAllowed')}
              </p>
            </div>
          </div>
        </div>

        <div
          className="
            mt-6
            flex
            flex-col
            gap-3
            rounded-xl
            border
            border-stone-200
            bg-stone-50
            p-4
            sm:flex-row
            sm:items-center
            sm:justify-between
            sm:p-5
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-lg
                bg-white
                text-stone-700
                shadow-sm
              "
            >
              <Banknote className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs text-stone-500">
                {t('info.roomPrice')}
              </p>

              <p className="mt-0.5 text-sm text-stone-600">
                {t('info.fixedPricePerNight')}
              </p>
            </div>
          </div>

          <p
            className="
              text-xl
              font-semibold
              text-stone-900
              sm:text-2xl
            "
          >
            {room.pricePerNight.toLocaleString()} DA

            <span className="ml-1 text-sm font-normal text-stone-500">
              / {t('card.night')}
            </span>
          </p>
        </div>
      </div>
    </section>
  )
}

export default RoomInfo