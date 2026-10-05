const PageTransitionOverlay = ({
  squaresRef,
  squareCount,
}) => {
  return (
    <div
      className="
        pointer-events-none
        fixed
        inset-0
        z-100
        grid
        grid-cols-10
        grid-rows-8
      "
      aria-hidden="true"
    >
      {Array.from(
        { length: squareCount },
        (_, index) => (
          <div
            key={index}
            ref={(element) => {
              squaresRef.current[index] = element;
            }}
            className="
              h-full
              w-full
              bg-[#2c2420]
              opacity-0
            "
          />
        )
      )}
    </div>
  );
};

export default PageTransitionOverlay;