import { forwardRef } from "react";

import { usePageTransitionContext } from "../PageTransitionContext";

const TransitionButton = forwardRef(
  (
    { to, children, className = "", type = "button", onClick, ...props },
    ref,
  ) => {
    const { transitionTo } = usePageTransitionContext();

    const handleClick = (event) => {
      onClick?.(event);
      transitionTo(to);
    };

    return (
      <button
        ref={ref}
        type={type}
        onClick={handleClick}
        className={className}
        {...props}
      >
        {children}
      </button>
    );
  },
);

TransitionButton.displayName = "TransitionButton";

export default TransitionButton;
