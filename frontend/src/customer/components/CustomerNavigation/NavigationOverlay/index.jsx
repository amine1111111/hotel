import NavigationLinks from "../NavigationLinks"
import LanguageSwitcher from "../LanguageSwitcher"

const NavigationOverlay = ({
  overlayRef,
  navigation,
  linkRefs,
  languageRef,
  language,
  onNavigationClick,
  onLanguageChange,
}) => {
  return (
    <div
      id="customer-navigation-menu"
      ref={overlayRef}
      className="
        pointer-events-auto
        absolute
        inset-0
        overflow-hidden
        bg-primary
      "
    >
      <div
        className="
          flex
          h-full
          w-full
          flex-col
          justify-center
          px-8
          pb-12
          pt-24
          sm:px-14
          lg:px-20
        "
      >
        <NavigationLinks
          navigation={navigation}
          linkRefs={linkRefs}
          onNavigationClick={onNavigationClick}
        />

        <LanguageSwitcher
          language={language}
          languageRef={languageRef}
          onLanguageChange={onLanguageChange}
        />
      </div>
    </div>
  )
}

export default NavigationOverlay