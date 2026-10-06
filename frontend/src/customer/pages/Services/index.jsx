import { useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import {
  ArrowDown,
  ArrowUpRight,
  BedDouble,
  CalendarDays,
  ConciergeBell,
  Sparkles,
  Utensils,
} from "lucide-react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"

const SERVICES = [
  {
    number: "01",
    key: "stay",
    icon: BedDouble,
  },
  {
    number: "02",
    key: "dine",
    icon: Utensils,
  },
  {
    number: "03",
    key: "unwind",
    icon: Sparkles,
  },
  {
    number: "04",
    key: "gather",
    icon: CalendarDays,
  },
  {
    number: "05",
    key: "assist",
    icon: ConciergeBell,
  },
]

const Services = () => {
  const { t } = useTranslation("services")

  const rootRef = useRef(null)
  const visualRef = useRef(null)
  const visualImageRef = useRef(null)

  const activeNumberRef = useRef(null)
  const activeTitleRef = useRef(null)
  const activeLabelRef = useRef(null)
  const activeDescriptionRef = useRef(null)
  const activeDetailsRef = useRef(null)

  const [activeIndex, setActiveIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const activeService = SERVICES[activeIndex]
  const ActiveIcon = activeService.icon
  const activeServicePath = `items.${activeService.key}`

  const activeDetails = t(`${activeServicePath}.details`, {
    returnObjects: true,
  })

  const details = Array.isArray(activeDetails) ? activeDetails : []

  useGSAP(
    () => {
      const intro = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      })

      intro
        .from(".services-eyebrow", {
          y: 20,
          opacity: 0,
          duration: 0.7,
        })
        .from(
          ".services-heading-line",
          {
            y: 35,
            opacity: 0,
            duration: 0.9,
            stagger: 0.1,
          },
          "-=0.45",
        )
        .from(
          ".services-intro-copy",
          {
            y: 20,
            opacity: 0,
            duration: 0.7,
          },
          "-=0.55",
        )
        .from(
          ".services-interface",
          {
            y: 35,
            opacity: 0,
            duration: 0.9,
          },
          "-=0.45",
        )

      gsap.to(visualImageRef.current, {
        yPercent: -3,
        scale: 1.035,
        duration: 6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      })
    },
    {
      scope: rootRef,
    },
  )

  const changeService = (nextIndex) => {
    if (nextIndex === activeIndex || isTransitioning) {
      return
    }

    setIsTransitioning(true)

    const currentElements = [
      activeNumberRef.current,
      activeTitleRef.current,
      activeLabelRef.current,
      activeDescriptionRef.current,
      activeDetailsRef.current,
    ]

    const timeline = gsap.timeline({
      onComplete: () => {
        setActiveIndex(nextIndex)

        requestAnimationFrame(() => {
          const nextElements = [
            activeNumberRef.current,
            activeTitleRef.current,
            activeLabelRef.current,
            activeDescriptionRef.current,
            activeDetailsRef.current,
          ]

          gsap.fromTo(
            nextElements,
            {
              y: 20,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              duration: 0.55,
              stagger: 0.04,
              ease: "power3.out",
              onComplete: () => {
                setIsTransitioning(false)
              },
            },
          )
        })
      },
    })

    timeline
      .to(currentElements, {
        y: -18,
        opacity: 0,
        duration: 0.28,
        stagger: 0.02,
        ease: "power2.in",
      })
      .to(
        visualImageRef.current,
        {
          scale: 1.1,
          opacity: 0.35,
          duration: 0.3,
          ease: "power2.in",
        },
        "<",
      )
      .to(
        visualRef.current,
        {
          rotation: nextIndex % 2 === 0 ? -1 : 1,
          duration: 0.18,
        },
        "<",
      )
      .to(visualImageRef.current, {
        scale: 1.035,
        opacity: 1,
        duration: 0.6,
        ease: "power3.out",
      })
      .to(
        visualRef.current,
        {
          rotation: 0,
          duration: 0.45,
          ease: "power3.out",
        },
        "<",
      )
  }

  const handleNext = () => {
    const nextIndex = (activeIndex + 1) % SERVICES.length

    changeService(nextIndex)
  }

  return (
    <main
      ref={rootRef}
      className="w-full min-w-0 overflow-x-clip bg-background text-foreground"
    >
      <section className="w-full px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-16">
        <div className="mx-auto w-full max-w-[1600px] min-w-0">
          <header className="services-header flex w-full min-w-0 items-start justify-between gap-6">
            <div className="services-eyebrow flex min-w-0 items-center gap-3 text-[9px] uppercase tracking-[0.3em] text-muted-foreground sm:text-[10px]">
              <span className="h-px w-7 shrink-0 bg-secondary sm:w-8" />
              <span>{t("eyebrow")}</span>
            </div>

            <div className="hidden shrink-0 text-right text-[9px] uppercase tracking-[0.25em] text-muted-foreground sm:block">
              <span className="block">{t("designedAround.line1")}</span>
              <span className="block">{t("designedAround.line2")}</span>
            </div>
          </header>

          <div className="mt-14 max-w-5xl lg:mt-20">
            <h1 className="services-heading-line max-w-full text-[clamp(3.5rem,8vw,8rem)] font-light leading-[0.9] tracking-[-0.07em]">
              {t("heading.line1")}
            </h1>

            <h1 className="services-heading-line max-w-full text-[clamp(3.5rem,8vw,8rem)] font-light leading-[0.9] tracking-[-0.07em]">
              {t("heading.line2")}
            </h1>

            <p className="services-intro-copy mt-8 max-w-xl text-sm leading-7 text-muted-foreground sm:text-[15px]">
              {t("intro")}
            </p>

            <div className="mt-10">
              <div className="flex items-center gap-4 text-[9px] uppercase tracking-[0.28em] text-muted-foreground">
                <ArrowDown size={14} strokeWidth={1} />
                <span>{t("exploreServices")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="services"
        className="w-full px-5 pb-20 sm:px-8 sm:pb-24 lg:px-12 lg:pb-28"
      >
        <div className="mx-auto w-full max-w-[1600px] min-w-0">
          <div className="services-interface min-w-0">
            <div className="mb-10 border-t border-border/60 pt-4">
              <div className="flex min-w-0 items-center justify-between gap-4 text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
                <span>{t("selectedService")}</span>

                <span className="shrink-0">
                  {activeService.number} /{" "}
                  {String(SERVICES.length).padStart(2, "0")}
                </span>
              </div>
            </div>

            <div className="grid min-w-0 grid-cols-1 gap-10 md:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] md:items-start md:gap-8 lg:gap-14 xl:gap-20">
              <div className="order-2 min-w-0 md:order-1 md:pt-1">
                <div className="min-w-0">
                  <div
                    ref={activeNumberRef}
                    className="mb-3 text-[10px] uppercase tracking-[0.25em] text-secondary"
                  >
                    {activeService.number}
                  </div>

                  <div
                    ref={activeTitleRef}
                    className="break-words text-[clamp(3rem,6vw,6.2rem)] font-light leading-[0.9] tracking-[-0.06em]"
                  >
                    {t(`${activeServicePath}.title`)}
                  </div>

                  <div
                    ref={activeLabelRef}
                    className="mt-5 break-words text-[10px] uppercase tracking-[0.24em] text-muted-foreground"
                  >
                    {t(`${activeServicePath}.label`)}
                  </div>
                </div>

                <p
                  ref={activeDescriptionRef}
                  className="mt-7 max-w-md text-sm leading-7 text-muted-foreground"
                >
                  {t(`${activeServicePath}.description`)}
                </p>

                <div
                  ref={activeDetailsRef}
                  className="mt-7 grid max-w-md gap-3 border-t border-border/60 pt-5"
                >
                  {details.map((detail) => (
                    <div
                      key={detail}
                      className="flex min-w-0 items-center gap-3 text-[9px] uppercase tracking-[0.13em]"
                    >
                      <span className="h-1 w-1 shrink-0 rounded-full bg-secondary" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="order-1 min-w-0 md:order-2">
                <div
                  ref={visualRef}
                  className="relative mx-auto aspect-[0.82] w-full max-w-[620px] overflow-hidden bg-primary md:aspect-[0.78]"
                >
                  <img
                    ref={visualImageRef}
                    src="/images/services/services.webp"
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover will-change-transform"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />

                  <div className="absolute left-4 top-4 flex size-10 items-center justify-center rounded-full border border-white/30 text-white sm:left-5 sm:top-5 sm:size-11">
                    <ActiveIcon size={16} strokeWidth={1.2} />
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 flex min-w-0 items-end justify-between gap-4 text-white sm:bottom-5 sm:left-5 sm:right-5">
                    <div className="min-w-0">
                      <div className="mb-2 text-[8px] uppercase tracking-[0.25em] text-white/60">
                        {t("experience")}
                      </div>

                      <div className="truncate text-lg font-light tracking-[-0.02em] sm:text-xl">
                        {t(`${activeServicePath}.label`)}
                      </div>
                    </div>

                    <div className="shrink-0 text-[9px] uppercase tracking-[0.2em] text-white/60">
                      {activeService.number}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 flex min-w-0 flex-col gap-5 border-t border-border/60 pt-5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
                <span className="hidden shrink-0 text-[8px] uppercase tracking-[0.25em] text-muted-foreground sm:block">
                  {t("services")}
                </span>

                <span className="hidden h-px w-6 shrink-0 bg-secondary sm:block" />

                <div className="flex min-w-0 flex-1 gap-5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {SERVICES.map((service, index) => (
                    <button
                      key={service.number}
                      type="button"
                      onClick={() => changeService(index)}
                      disabled={isTransitioning}
                      className={`group flex shrink-0 items-center gap-2 whitespace-nowrap text-[9px] uppercase tracking-[0.17em] transition-colors duration-300 ${
                        index === activeIndex
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 shrink-0 rounded-full transition-transform duration-300 ${
                          index === activeIndex
                            ? "scale-100 bg-secondary"
                            : "scale-0 bg-secondary group-hover:scale-100"
                        }`}
                      />

                      {t(`items.${service.key}.title`)}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleNext}
                disabled={isTransitioning}
                aria-label={t("nextService")}
                className="group flex size-10 shrink-0 self-end items-center justify-center rounded-full border border-border transition-all duration-300 hover:border-foreground hover:bg-primary hover:text-primary-foreground sm:self-auto sm:size-11"
              >
                <ArrowUpRight
                  size={15}
                  strokeWidth={1.3}
                  className="transition-transform duration-300 group-hover:rotate-45"
                />
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Services