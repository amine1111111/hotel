import { useRef } from "react"
import { useTranslation } from "react-i18next"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Phone } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

const CONTACTS = [
  { key: "phone" },
  { key: "email" },
  { key: "address" },
  { key: "hours" },
  { key: "days" },
]

export default function Contact() {
  const { t } = useTranslation("contact")

  const sectionRef = useRef(null)
  const listRef = useRef(null)
  const iconRef = useRef(null)

  useGSAP(() => {
    const rows = gsap.utils.toArray(".contact-row")
    const labels = gsap.utils.toArray(".contact-label")
    const values = gsap.utils.toArray(".contact-value")

    const clamp = gsap.utils.clamp

    const setListY = gsap.quickSetter(listRef.current, "y", "px")

    const labelSetters = labels.map((label) =>
      gsap.quickSetter(label, "x", "px"),
    )

    const valueSetters = values.map((value) =>
      gsap.quickSetter(value, "x", "px"),
    )

    gsap.set(labels, { x: 0 })
    gsap.set(values, { x: 0 })

    const LIST_DISTANCE = rows.length * 140

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: `+=${LIST_DISTANCE * 3}`,
      pin: true,
      scrub: true,
      invalidateOnRefresh: true,

      onUpdate(self) {
        const progress = self.progress

        setListY(-progress * LIST_DISTANCE)

        const iconRect = iconRef.current.getBoundingClientRect()
        const iconCenter = iconRect.top + iconRect.height / 2

        rows.forEach((row, index) => {
          const rowRect = row.getBoundingClientRect()
          const rowCenter = rowRect.top + rowRect.height / 2

          const influence = clamp(
            0,
            1,
            1 - Math.abs(rowCenter - iconCenter) / 160,
          )

          const spread = influence * 100

          labelSetters[index](-spread)
          valueSetters[index](spread)
        })
      },
    })

    return () => trigger.kill()
  }, [])

  return (
    <>
      <div className="mx-auto mt-[10vh] aspect-square w-[90%] overflow-hidden rounded-3xl sm:aspect-4/3 sm:max-w-[90vw] lg:aspect-video">
        <iframe
          title={t("mapTitle")}
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d179.11888762388656!2d3.884735567895378!3d36.379837126394726!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128c2f656b393043%3A0x2f9482a04178e8d8!2sUnivers%20food!5e1!3m2!1sen!2sdz!4v1785947295052!5m2!1sen!2sdz"
          className="size-full"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>

      <section
        ref={sectionRef}
        className="relative h-screen overflow-hidden bg-background text-foreground"
      >
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div
            ref={iconRef}
            className="flex h-15 w-15 items-center justify-center rounded-full border border-border bg-secondary shadow-sm"
          >
            <Phone size={25} strokeWidth={1.5} />
          </div>
        </div>

        <div className="absolute inset-0 top-[35%] flex items-center justify-center">
          <div ref={listRef} className="flex flex-col pt-72">
            {CONTACTS.map((item) => (
              <div
                key={item.key}
                className="contact-row flex w-full max-w-3xl items-center justify-center gap-3"
              >
                <div
                  className="
                    contact-label
                    flex-1
                    text-right
                    text-sm
                    uppercase
                    tracking-[0.3em]
                    text-muted-foreground
                  "
                >
                  {t(`contacts.${item.key}.label`)}
                </div>

                <div
                  className="
                    contact-value
                    flex-1
                    whitespace-nowrap
                    text-left
                    text-lg
                  "
                >
                  {t(`contacts.${item.key}.value`)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}