import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import {
  Users,
  Baby,
} from 'lucide-react'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'

import { Button } from '@/components/ui/button'

// ! keep as is

const RoomCard = ({ room }) => {
  const { t } = useTranslation('rooms')

  const roomPath = `rooms.${room.id}`

  const category = t(`${roomPath}.category`)
  const name = t(`${roomPath}.name`)
  const description = t(`${roomPath}.description`)

  return (
    <Card
      className="
        group
        flex
        h-full
        flex-col
        overflow-hidden
        border-stone-200
        bg-white
        py-0
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-lg
      "
    >
      <Link
        to={`/rooms/${room.id}`}
        aria-label={t('card.viewAria', { name })}
        className="
          block
          overflow-hidden
          focus:outline-none
          focus-visible:ring-2
          focus-visible:ring-stone-500
          focus-visible:ring-offset-2
        "
      >
        <div className="aspect-4/3 overflow-hidden">
          <img
            src={room.images.roomCard}
            alt={name}
            loading="lazy"
            className="
              h-full
              w-full
              object-cover
              transition-transform
              duration-500
              ease-out
              group-hover:scale-105
            "
          />
        </div>
      </Link>

      <CardHeader
        className="
          flex-1
          space-y-2
          px-5
          pt-5
        "
      >
        <p
          className="
            text-[11px]
            font-medium
            uppercase
            tracking-[0.18em]
            text-stone-500
          "
        >
          {category}
        </p>

        <CardTitle
          className="
            text-lg
            font-semibold
            leading-tight
            text-stone-900
            sm:text-xl
          "
        >
          {name}
        </CardTitle>

        <CardDescription
          className="
            line-clamp-2
            text-sm
            leading-6
            text-stone-500
          "
        >
          {description}
        </CardDescription>

        <div
          className="
            flex
            flex-wrap
            items-center
            gap-x-4
            gap-y-2
            pt-2
            text-xs
            text-stone-500
          "
        >
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />

            <span>
              {t('card.upTo')} {room.capacity.maxAdults}{' '}
              {room.capacity.maxAdults > 1
                ? t('card.adults')
                : t('card.adult')}
            </span>
          </div>

          {room.capacity.maxChildren > 0 && (
            <div className="flex items-center gap-1.5">
              <Baby className="h-3.5 w-3.5" />

              <span>
                {t('card.upTo')} {room.capacity.maxChildren}{' '}
                {room.capacity.maxChildren > 1
                  ? t('card.children')
                  : t('card.child')}
              </span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent
        className="
          px-5
          pb-5
          pt-4
        "
      >
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs text-stone-400">
              {t('card.pricePerNight')}
            </p>

            <p
              className="
                mt-0.5
                whitespace-nowrap
                text-base
                font-semibold
                text-stone-900
              "
            >
              {room.pricePerNight.toLocaleString()}{' '}
              DA

              <span
                className="
                  ml-1
                  text-xs
                  font-normal
                  text-stone-500
                "
              >
                / {t('card.night')}
              </span>
            </p>
          </div>

          <Button
            asChild
            size="sm"
            className="
              shrink-0
              rounded-lg
              bg-[#2c2420]
              text-[#f4eee7]
              hover:bg-[#b89b72]
              hover:text-[#2c2420]
            "
          >
            <Link to={`/rooms/${room.id}`}>
              {t('card.view')}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default RoomCard