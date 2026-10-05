import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'

const BookRoom = ({ room }) => {
  const { t } = useTranslation('rooms')

  return (
    <section className="py-10 sm:py-14 lg:py-16">
      <div
        className="
          overflow-hidden
          rounded-2xl
          bg-primary
          px-6
          py-10
          text-center
          sm:px-10
          sm:py-12
        "
      >
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground/55">
          {t('booking.eyebrow')}
        </p>

        <h2 className="mt-3 text-2xl font-semibold text-primary-foreground sm:text-3xl">
          {t('booking.title')}
        </h2>

        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-primary-foreground/55">
          {t('booking.description')}
        </p>

        <Button
          asChild
          size="lg"
          className="
            mt-6
            rounded-lg
            bg-primary-foreground
            px-7
            text-primary
            hover:bg-secondary
            hover:text-secondary-foreground
          "
        >
          <Link to={`/booking?room=${room.id}`}>
            {t('booking.button')}
          </Link>
        </Button>
      </div>
    </section>
  )
}

export default BookRoom