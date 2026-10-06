import { useRef } from "react"
import { ArrowDown, ArrowUpRight } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import TransitionButton from "@/customer/components/PageTransition/TransitionButton"

gsap.registerPlugin(ScrollTrigger)

const PHILOSOPHY = [
  {
    number: "01",
    key: "comfort",
  },
  {
    number: "02",
    key: "hospitality",
  },
  {
    number: "03",
    key: "atmosphere",
  },
]

const About = () => {
  const { t } = useTranslation("about")

  const pageRef = useRef(null)
  const heroImageRef = useRef(null)
  const storyImageRef = useRef(null)
  const philosophyRef = useRef(null)
  const philosophyItemsRef = useRef([])

  useGSAP(
    () => {
      const context = gsap.context(() => {
        gsap.from(".about-hero-label", {
          y: 30,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          delay: 0.2,
        })

        gsap.from(".about-hero-title > span > span", {
          yPercent: 110,
          opacity: 0,
          duration: 1.2,
          stagger: 0.08,
          ease: "power4.out",
          delay: 0.25,
        })

        gsap.from(".about-hero-meta", {
          y: 25,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          delay: 0.7,
        })

        gsap.to(heroImageRef.current, {
          yPercent: 12,
          scale: 1.08,
          ease: "none",
          scrollTrigger: {
            trigger: ".about-hero",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        })

        gsap.from(".story-line", {
          yPercent: 100,
          opacity: 0,
          stagger: 0.08,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".about-story",
            start: "top 70%",
          },
        })

        gsap.to(storyImageRef.current, {
          yPercent: -10,
          ease: "none",
          scrollTrigger: {
            trigger: ".about-story-image",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        })

        gsap.from(".story-copy", {
          y: 60,
          opacity: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".story-copy",
            start: "top 75%",
          },
        })

        philosophyItemsRef.current.forEach((item, index) => {
          if (!item) return

          gsap.from(item, {
            y: 80,
            opacity: 0,
            duration: 1,
            delay: index * 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: philosophyRef.current,
              start: "top 65%",
            },
          })
        })

        gsap.from(".experience-image", {
          scale: 1.15,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".experience-image-wrapper",
            start: "top 80%",
          },
        })

        gsap.from(".experience-copy", {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".experience-copy",
            start: "top 75%",
          },
        })
      }, pageRef)

      return () => context.revert()
    },
    { scope: pageRef },
  )

  return (
    <main
      ref={pageRef}
      className="w-full overflow-x-clip bg-background text-foreground"
    >
      <section className="about-hero relative h-[100svh] min-h-150 overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-0">
          <img
            ref={heroImageRef}
            src="/images/about/stay.webp"
            alt={t("hero.imageAlt")}
            className="size-full object-cover opacity-75"
          />

          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 bg-linear-to-t from-primary via-transparent to-black/10" />
        </div>

        <div className="relative z-10 flex h-full min-w-0 flex-col justify-between px-6 py-8 sm:px-10 sm:py-10 lg:px-16 lg:py-12">
          <div className="about-hero-label flex min-w-0 items-center justify-between gap-6 text-[10px] uppercase tracking-[0.35em] text-white/65 sm:text-xs">
            <span className="min-w-0 break-words">
              {t("hero.label")}
            </span>

            <span className="shrink-0">01 — 05</span>
          </div>

          <div className="min-w-0">
            <h1 className="about-hero-title max-w-full text-[clamp(3.5rem,10vw,10rem)] font-light leading-[0.88] tracking-[-0.02em]">
              <span className="block max-w-full">
                <span className="inline-block max-w-full break-words">
                  {t("hero.title.line1")}
                </span>
              </span>

              <span className="block max-w-full">
                <span className="inline-block max-w-full break-words">
                  {t("hero.title.line2")}
                </span>
              </span>

              <span className="block max-w-full">
                <span className="inline-block max-w-full break-words">
                  {t("hero.title.line3")}
                </span>
              </span>
            </h1>
          </div>

          <div className="about-hero-meta flex min-w-0 items-end justify-between gap-8">
            <p className="min-w-0 max-w-xs break-words text-xs leading-6 text-white/65 sm:text-sm">
              {t("hero.description")}
            </p>

            <div className="hidden size-12 shrink-0 items-center justify-center rounded-full border border-white/30 sm:flex">
              <ArrowDown size={16} strokeWidth={1} />
            </div>
          </div>
        </div>
      </section>

      <section className="about-story bg-background px-6 py-28 sm:px-10 sm:py-40 lg:px-16 lg:py-52">
        <div className="mx-auto min-w-0 max-w-7xl">
          <div className="mb-16 flex min-w-0 items-start justify-between gap-10 sm:mb-24">
            <span className="min-w-0 break-words text-[10px] uppercase tracking-[0.35em] text-muted-foreground sm:text-xs">
              02 — {t("story.label")}
            </span>

            <span className="hidden max-w-xs break-words text-right text-xs leading-6 text-muted-foreground sm:block">
              {t("story.sideText")}
            </span>
          </div>

          <div className="min-w-0 max-w-6xl">
            <h2 className="max-w-full break-words text-[clamp(2.8rem,7vw,7.5rem)] font-light leading-[0.9] tracking-[-0.05em]">
              <span className="story-line inline-block max-w-full break-words">
                {t("story.headline.0")}
              </span>{" "}
              <span className="story-line inline-block max-w-full break-words">
                {t("story.headline.1")}
              </span>{" "}
              <span className="story-line inline-block max-w-full break-words">
                {t("story.headline.2")}
              </span>{" "}
              <span className="story-line inline-block max-w-full break-words text-secondary">
                {t("story.headline.3")}
              </span>{" "}
              <span className="story-line inline-block max-w-full break-words">
                {t("story.headline.4")}
              </span>{" "}
              <span className="story-line inline-block max-w-full break-words">
                {t("story.headline.5")}
              </span>{" "}
              <span className="story-line inline-block max-w-full break-words">
                {t("story.headline.6")}
              </span>{" "}
              <span className="story-line inline-block max-w-full break-words">
                {t("story.headline.7")}
              </span>
            </h2>
          </div>

          <div className="mt-20 grid min-w-0 gap-10 lg:mt-32 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="about-story-image relative aspect-[4/3] min-w-0 overflow-hidden">
              <img
                ref={storyImageRef}
                src="/images/about/dine.webp"
                alt={t("story.imageAlt")}
                className="size-full scale-[1.08] object-cover"
              />
            </div>

            <div className="story-copy min-w-0 max-w-md lg:pb-6 lg:pl-10">
              <p className="break-words text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                {t("story.paragraph1")}
              </p>

              <p className="mt-6 break-words text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                {t("story.paragraph2")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        ref={philosophyRef}
        className="bg-primary px-6 py-28 text-primary-foreground sm:px-10 sm:py-40 lg:px-16"
      >
        <div className="mx-auto min-w-0 max-w-7xl">
          <div className="mb-20 flex min-w-0 items-start justify-between gap-8 sm:mb-28">
            <span className="min-w-0 break-words text-[10px] uppercase tracking-[0.35em] text-white/45 sm:text-xs">
              03 — {t("philosophy.label")}
            </span>

            <span className="shrink-0 text-right text-[10px] uppercase tracking-[0.25em] text-secondary sm:text-xs">
              {t("philosophy.essentials")}
            </span>
          </div>

          <div className="min-w-0 border-t border-white/15">
            {PHILOSOPHY.map((item, index) => (
              <article
                key={item.number}
                ref={(element) => {
                  philosophyItemsRef.current[index] = element
                }}
                className="grid min-w-0 gap-8 border-b border-white/15 py-12 sm:py-16 lg:grid-cols-[100px_minmax(0,0.8fr)_minmax(0,1fr)] lg:items-center lg:gap-16"
              >
                <span className="shrink-0 text-[10px] tracking-[0.25em] text-white/35">
                  {item.number}
                </span>

                <h3 className="min-w-0 break-words text-4xl font-light tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                  {t(`philosophy.items.${item.key}.title`)}
                </h3>

                <p className="min-w-0 max-w-md break-words text-sm leading-7 text-white/55 sm:text-base sm:leading-8">
                  {t(`philosophy.items.${item.key}.text`)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background px-6 py-28 sm:px-10 sm:py-40 lg:px-16 lg:py-52">
        <div className="mx-auto min-w-0 max-w-7xl">
          <div className="mb-16 flex min-w-0 items-start justify-between gap-8 sm:mb-24">
            <span className="min-w-0 break-words text-[10px] uppercase tracking-[0.35em] text-muted-foreground sm:text-xs">
              04 — {t("experience.label")}
            </span>

            <span className="max-w-40 break-words text-right text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:max-w-none sm:text-xs">
              {t("experience.meta")}
            </span>
          </div>

          <div className="grid min-w-0 gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.75fr)] lg:items-center lg:gap-24">
            <div className="experience-image-wrapper relative aspect-[3/4] min-w-0 overflow-hidden sm:aspect-[4/5]">
              <img
                src="/images/about/unwind.webp"
                alt={t("experience.imageAlt")}
                className="experience-image size-full object-cover"
              />

              <div className="absolute bottom-5 left-5 flex size-14 items-center justify-center rounded-full bg-secondary text-secondary-foreground sm:bottom-8 sm:left-8 sm:size-16">
                <span className="text-[10px] tracking-[0.2em]">04</span>
              </div>
            </div>

            <div className="experience-copy min-w-0">
              <h2 className="max-w-xl break-words text-[clamp(3rem,6vw,6rem)] font-light leading-[0.9] tracking-[-0.05em]">
                <span>{t("experience.title.line1")}</span>
                <br />
                <span className="text-secondary">
                  {t("experience.title.line2")}
                </span>
                <br />
                <span>{t("experience.title.line3")}</span>
              </h2>

              <p className="mt-10 max-w-md break-words text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                {t("experience.description")}
              </p>

              <TransitionButton
                to="/rooms"
                className="group mt-10 inline-flex max-w-full items-center gap-4 text-xs uppercase tracking-[0.25em] text-foreground"
              >
                <span className="min-w-0 break-words">
                  {t("experience.button")}
                </span>

                <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight size={15} strokeWidth={1.2} />
                </span>
              </TransitionButton>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default About