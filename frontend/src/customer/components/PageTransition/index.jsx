import PageTransitionOverlay from "./PageTransitionOverlay";
import {
  PageTransitionProvider,
} from "./PageTransitionContext";
import usePageTransition from "./usePageTransition";

const PageTransition = ({ children }) => {
  const transition = usePageTransition();

  return (
    <PageTransitionProvider value={transition}>
      {children}

      <PageTransitionOverlay
        squaresRef={transition.squaresRef}
        squareCount={transition.squareCount}
      />
    </PageTransitionProvider>
  );
};

export default PageTransition;