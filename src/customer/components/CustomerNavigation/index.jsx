



// import { useEffect, useState } from "react"
// import { useTranslation } from "react-i18next"

// import MenuButton from "./MenuButton"
// import NavigationOverlay from "./NavigationOverlay"
// import useCustomerNavigationAnimation from "./useCustomerNavigationAnimation"

// import useLenisScroll from "../../../components/LenisScroll/useLenisScroll"

// const NAVIGATION_ITEMS = [
//   { key: "home", path: "/" },
//   { key: "rooms", path: "/rooms" },
//   { key: "about", path: "/about" },
//   { key: "services", path: "/services" },
//   { key: "gallery", path: "/gallery" },
//   { key: "contact", path: "/contact" },
// ]

// const CustomerNavigation = () => {
//   const { i18n, t } = useTranslation("common")
//   const lenis = useLenisScroll()

//   const navigation = NAVIGATION_ITEMS.map(({ key, path }) => ({
//     label: t(key),
//     path,
//   }))

//   const [isOpen, setIsOpen] = useState(false)

//   const {
//     overlayRef,
//     linkRefs,
//     languageRef,
//     menuLineTopRef,
//     menuLineMiddleRef,
//     menuLineBottomRef,
//     openMenu,
//     closeMenu,
//   } = useCustomerNavigationAnimation()

//   const handleMenuToggle = () => {
//     if (isOpen) {
//       closeMenu(() => {
//         setIsOpen(false)
//       })

//       return
//     }

//     setIsOpen(true)
//     openMenu()
//   }

//   const handleNavigationClick = () => {
//     closeMenu(() => {
//       setIsOpen(false)
//     })
//   }

//   const handleLanguageChange = (language) => {
//     i18n.changeLanguage(language)
//   }

//   useEffect(() => {
//     if (!lenis) {
//       return
//     }

//     if (isOpen) {
//       lenis.stop()
//       return
//     }

//     lenis.start()
//   }, [isOpen, lenis])

//   useEffect(() => {
//     const handleEscape = (event) => {
//       if (event.key !== "Escape" || !isOpen) {
//         return
//       }

//       closeMenu(() => {
//         setIsOpen(false)
//       })
//     }

//     document.addEventListener("keydown", handleEscape)

//     return () => {
//       document.removeEventListener("keydown", handleEscape)
//     }
//   }, [isOpen, closeMenu])

//   return (
//     <div className="pointer-events-none fixed inset-0 z-50">
//       <MenuButton
//         isOpen={isOpen}
//         onClick={handleMenuToggle}
//         menuLineTopRef={menuLineTopRef}
//         menuLineMiddleRef={menuLineMiddleRef}
//         menuLineBottomRef={menuLineBottomRef}
//       />

//       <NavigationOverlay
//         overlayRef={overlayRef}
//         navigation={navigation}
//         linkRefs={linkRefs}
//         languageRef={languageRef}
//         language={i18n.language}
//         onNavigationClick={handleNavigationClick}
//         onLanguageChange={handleLanguageChange}
//       />
//     </div>
//   )
// }

// export default CustomerNavigation






























import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import { loadFrenchTranslations } from "../../../lib/i18n"
import MenuButton from "./MenuButton"
import NavigationOverlay from "./NavigationOverlay"
import useCustomerNavigationAnimation from "./useCustomerNavigationAnimation"

import useLenisScroll from "../../../components/LenisScroll/useLenisScroll"

const NAVIGATION_ITEMS = [
  { key: "home", path: "/" },
  { key: "rooms", path: "/rooms" },
  { key: "about", path: "/about" },
  { key: "services", path: "/services" },
  { key: "gallery", path: "/gallery" },
  { key: "contact", path: "/contact" },
]

const CustomerNavigation = () => {
  const { i18n, t } = useTranslation("common")
  const lenis = useLenisScroll()

  const navigation = NAVIGATION_ITEMS.map(({ key, path }) => ({
    label: t(key),
    path,
  }))

  const [isOpen, setIsOpen] = useState(false)

  const {
    overlayRef,
    linkRefs,
    languageRef,
    menuLineTopRef,
    menuLineMiddleRef,
    menuLineBottomRef,
    openMenu,
    closeMenu,
  } = useCustomerNavigationAnimation()

  const handleMenuToggle = () => {
    if (isOpen) {
      closeMenu(() => {
        setIsOpen(false)
      })

      return
    }

    setIsOpen(true)
    openMenu()
  }

  const handleNavigationClick = () => {
    closeMenu(() => {
      setIsOpen(false)
    })
  }

  const handleLanguageChange = async (language) => {
  if (
    language === "fr" &&
    !i18n.hasResourceBundle("fr", "common")
  ) {
    const translations = await loadFrenchTranslations()

    Object.entries(translations).forEach(([namespace, resources]) => {
      i18n.addResourceBundle(
        "fr",
        namespace,
        resources,
        true,
        true,
      )
    })
  }

  await i18n.changeLanguage(language)
}
  useEffect(() => {
    if (!lenis) {
      return
    }

    if (isOpen) {
      lenis.stop()
      return
    }

    lenis.start()
  }, [isOpen, lenis])

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key !== "Escape" || !isOpen) {
        return
      }

      closeMenu(() => {
        setIsOpen(false)
      })
    }

    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, closeMenu])

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      <MenuButton
        isOpen={isOpen}
        onClick={handleMenuToggle}
        menuLineTopRef={menuLineTopRef}
        menuLineMiddleRef={menuLineMiddleRef}
        menuLineBottomRef={menuLineBottomRef}
      />

      <NavigationOverlay
        overlayRef={overlayRef}
        navigation={navigation}
        linkRefs={linkRefs}
        languageRef={languageRef}
        language={i18n.language}
        onNavigationClick={handleNavigationClick}
        onLanguageChange={handleLanguageChange}
      />
    </div>
  )
}

export default CustomerNavigation