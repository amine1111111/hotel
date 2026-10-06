import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import enAbout from "../locales/en/about.json"
import enCommon from "../locales/en/common.json"
import enHome from "../locales/en/home.json"
import enRooms from "../locales/en/rooms.json"
import enBooking from "../locales/en/booking.json"
import enContact from "../locales/en/contact.json"
import enErrors from "../locales/en/errors.json"
import enServices from "../locales/en/services.json"
import enFooter from "../locales/en/footer.json"

const loadFrenchTranslations = async () => {
  const [
    common,
    home,
    rooms,
    booking,
    contact,
    errors,
    services,
    about,
    footer,
  ] = await Promise.all([
    import("../locales/fr/common.json"),
    import("../locales/fr/home.json"),
    import("../locales/fr/rooms.json"),
    import("../locales/fr/booking.json"),
    import("../locales/fr/contact.json"),
    import("../locales/fr/errors.json"),
    import("../locales/fr/services.json"),
    import("../locales/fr/about.json"),
    import("../locales/fr/footer.json"),
  ])

  return {
    common: common.default,
    home: home.default,
    rooms: rooms.default,
    booking: booking.default,
    contact: contact.default,
    errors: errors.default,
    services: services.default,
    about: about.default,
    footer: footer.default,
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
        home: enHome,
        rooms: enRooms,
        booking: enBooking,
        contact: enContact,
        errors: enErrors,
        services: enServices,
        about: enAbout,
        footer: enFooter,
      },
    },

    lng: "en",
    fallbackLng: "en",
    defaultNS: "common",

    interpolation: {
      escapeValue: false,
    },
  })

export { loadFrenchTranslations }

export default i18n