// ! has z-index

const MenuButton = ({
  isOpen,
  onClick,
  menuLineTopRef,
  menuLineMiddleRef,
  menuLineBottomRef,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isOpen ? "Close navigation" : "Open navigation"}
      aria-expanded={isOpen}
      aria-controls="customer-navigation-menu"
      className="
        pointer-events-auto
        fixed
        right-5
        top-5
        z-60
        flex
        h-12
        w-12
        cursor-pointer
        items-center
        justify-center
        rounded-full
        border
        border-primary-foreground/20
        bg-primary
        shadow-lg
        transition-transform
        duration-300
        hover:scale-105
        sm:right-8
        sm:top-8
        sm:h-14
        sm:w-14
      "
    >
      <span className="relative block h-4 w-5">
        <span
          ref={menuLineTopRef}
          className="
            absolute
            left-0
            top-1/2
            block
            h-[1.5px]
            w-5
            origin-center
            bg-primary-foreground
          "
        />

        <span
          ref={menuLineMiddleRef}
          className="
            absolute
            left-0
            top-1/2
            block
            h-[1.5px]
            w-5
            origin-center
            bg-primary-foreground
          "
        />

        <span
          ref={menuLineBottomRef}
          className="
            absolute
            left-0
            top-1/2
            block
            h-[1.5px]
            w-5
            origin-center
            bg-primary-foreground
          "
        />
      </span>
    </button>
  )
}

export default MenuButton