import { ArrowUpRight } from "lucide-react"
import { useTranslation } from "react-i18next"

import TransitionButton from "@/customer/components/PageTransition/TransitionButton"

const Footer = () => {
  const { t } = useTranslation("footer")

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <footer className="w-full bg-[#2c2420] text-[#f4eee7]">
      <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <div className="border-b border-white/10 py-20 sm:py-24 lg:py-28">
          <div className="flex flex-col gap-10 sm:gap-12 lg:flex-row lg:items-end lg:justify-between lg:gap-20">
            <div className="max-w-3xl">
              <p className="mb-6 flex items-center gap-3 text-[9px] uppercase tracking-[0.3em] text-[#b89b72]">
                <span className="h-px w-7 bg-[#b89b72]" />
                {t("eyebrow")}
              </p>

              <h2 className="max-w-3xl text-[clamp(3rem,6vw,6.5rem)] font-light leading-[0.9] tracking-[-0.06em]">
                {t("titleLine1")}
                <br />
                {t("titleLine2")}
              </h2>
            </div>

            <TransitionButton
              to="/rooms"
              className="group flex w-fit items-center gap-4 text-[10px] uppercase tracking-[0.22em] text-white/70 transition-colors duration-300 hover:text-white"
            >
              <span className="flex size-12 items-center justify-center rounded-full bg-[#b89b72] text-[#2c2420] transition-transform duration-500 group-hover:scale-110">
                <ArrowUpRight
                  size={16}
                  strokeWidth={1.3}
                  className="transition-transform duration-500 group-hover:rotate-45"
                />
              </span>

              <span>{t("exploreRooms")}</span>
            </TransitionButton>
          </div>
        </div>

        <div className="grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr] lg:gap-10 lg:py-16">
          <div className="max-w-xs">
            <p className="text-lg font-light tracking-[-0.02em]">
              {t("hotelName")}
            </p>

            <p className="mt-4 text-sm leading-7 text-white/45">
              {t("description")}
            </p>
          </div>

          <div>
            <p className="mb-5 text-[9px] uppercase tracking-[0.28em] text-white/35">
              {t("explore")}
            </p>

            <nav className="flex flex-col items-start gap-3 text-sm text-white/65">
              <TransitionButton
                to="/rooms"
                className="transition-colors duration-300 hover:text-white"
              >
                {t("links.rooms")}
              </TransitionButton>

              <TransitionButton
                to="/services"
                className="transition-colors duration-300 hover:text-white"
              >
                {t("links.services")}
              </TransitionButton>

              <TransitionButton
                to="/gallery"
                className="transition-colors duration-300 hover:text-white"
              >
                {t("links.gallery")}
              </TransitionButton>

              <TransitionButton
                to="/about"
                className="transition-colors duration-300 hover:text-white"
              >
                {t("links.about")}
              </TransitionButton>
            </nav>
          </div>

          <div>
            <p className="mb-5 text-[9px] uppercase tracking-[0.28em] text-white/35">
              {t("contact")}
            </p>

            <div className="flex flex-col gap-3 text-sm leading-6 text-white/65">
              <a
                href="tel:+213000000000"
                className="transition-colors duration-300 hover:text-white"
              >
                +213 00 00 00 00
              </a>

              <a
                href="mailto:hello@hotel.com"
                className="transition-colors duration-300 hover:text-white"
              >
                hello@hotel.com
              </a>
            </div>
          </div>

          <div>
            <p className="mb-5 text-[9px] uppercase tracking-[0.28em] text-white/35">
              {t("location")}
            </p>

            <p className="max-w-xs text-sm leading-7 text-white/65">
              {t("address")}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-5 border-t border-white/10 py-6 text-[8px] uppercase tracking-[0.2em] text-white/30 sm:flex-row sm:items-center sm:justify-between sm:tracking-[0.24em]">
          <p>
            © {new Date().getFullYear()} {t("hotelName")}.{" "}
            {t("allRightsReserved")}
          </p>

          <div className="flex items-center">
            {/*
            <TransitionButton
              to="/privacy"
              className="transition-colors duration-300 hover:text-white/70"
            >
              {t("privacy")}
            </TransitionButton>

            <TransitionButton
              to="/terms"
              className="transition-colors duration-300 hover:text-white/70"
            >
              {t("terms")}
            </TransitionButton>
            */}

            <button
              type="button"
              onClick={scrollToTop}
              className="group flex items-center gap-2 transition-colors duration-300 hover:text-white/70"
            >
              <span>{t("backToTop")}</span>

              <span className="transition-transform duration-300 group-hover:-translate-y-1">
                ↑
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer