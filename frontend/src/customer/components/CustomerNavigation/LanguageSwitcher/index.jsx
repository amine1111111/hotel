const LanguageSwitcher = ({
  language,
  languageRef,
  onLanguageChange,
}) => {
  return (
    <div
      ref={languageRef}
      className="
        mt-12
        flex
        items-center
        gap-3
      "
    >
      <span
        className="
          text-xs
          uppercase
          tracking-[0.2em]
          text-stone-500
        "
      >
        Language
      </span>

      <button
        type="button"
        onClick={() => onLanguageChange("en")}
        className={`
          cursor-pointer
          rounded-full
          px-4
          py-2
          text-xs
          uppercase
          tracking-[0.15em]
          transition-colors
          duration-300
          ${
            language === "en"
              ? "bg-[#b89b72] text-white"
              : "text-stone-400 hover:text-white"
          }
        `}
      >
        EN
      </button>

      <button
        type="button"
        onClick={() => onLanguageChange("fr")}
        className={`
          cursor-pointer
          rounded-full
          px-4
          py-2
          text-xs
          uppercase
          tracking-[0.15em]
          transition-colors
          duration-300
          ${
            language === "fr"
              ? "bg-[#b89b72] text-white"
              : "text-stone-400 hover:text-white"
          }
        `}
      >
        FR
      </button>
    </div>
  )
}

export default LanguageSwitcher