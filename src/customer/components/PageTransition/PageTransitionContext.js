import { createContext, useContext } from "react";

const PageTransitionContext = createContext(null);

export const PageTransitionProvider = PageTransitionContext.Provider;

export const usePageTransitionContext = () => {
  const context = useContext(PageTransitionContext);

  if (!context) {
    throw new Error(
      "usePageTransitionContext must be used inside PageTransition"
    );
  }

  return context;
};