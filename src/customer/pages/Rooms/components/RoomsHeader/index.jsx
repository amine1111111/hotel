import { useTranslation } from 'react-i18next'

const RoomsHeader = () => {
  const { t } = useTranslation('rooms')

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6 sm:py-16">

      <p className="text-sm font-medium uppercase tracking-[0.2em] text-stone-500">
        {t('header.eyebrow')}
      </p>

      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl lg:text-5xl">
        {t('header.title')}
      </h1>

      <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-stone-500 sm:text-base">
        {t('header.description')}
      </p>

    </section>
  )
}

export default RoomsHeader