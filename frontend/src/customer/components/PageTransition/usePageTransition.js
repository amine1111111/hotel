// import { useRef } from "react";

// import { useNavigate } from "react-router-dom";

// import gsap from "gsap";

// import useLenisScroll from "../../../components/LenisScroll/useLenisScroll";

// const SQUARE_COUNT = 80;
// const REVEAL_DURATION = 0.035;
// const HIDE_DURATION = 0.025;
// const NAVIGATION_DELAY = 80;

// const createRandomOrder = (length) => {
//   const order = Array.from(
//     { length },
//     (_, index) => index
//   );

//   for (let index = order.length - 1; index > 0; index--) {
//     const randomIndex = Math.floor(
//       Math.random() * (index + 1)
//     );

//     [order[index], order[randomIndex]] = [
//       order[randomIndex],
//       order[index],
//     ];
//   }

//   return order;
// };

// const usePageTransition = () => {
//   const navigate = useNavigate();
//   const lenis = useLenisScroll();

//   const squaresRef = useRef([]);

//   const isTransitioningRef = useRef(false);

//   const transitionTo = async (path) => {
//     if (isTransitioningRef.current) {
//       return;
//     }

//     isTransitioningRef.current = true;

//     const squares = squaresRef.current.filter(Boolean);

//     if (!squares.length) {
//       navigate(path);

//       requestAnimationFrame(() => {
//         lenis?.scrollTo(0, {
//           immediate: true,
//         });
//       });

//       isTransitioningRef.current = false;
//       return;
//     }

//     const randomOrder = createRandomOrder(squares.length);

//     gsap.killTweensOf(squares);

//     gsap.set(squares, {
//       autoAlpha: 0,
//     });

//     const revealTimeline = gsap.timeline();

//     randomOrder.forEach((squareIndex, orderIndex) => {
//       revealTimeline.to(
//         squares[squareIndex],
//         {
//           autoAlpha: 1,
//           duration: REVEAL_DURATION,
//           ease: "none",
//         },
//         orderIndex * REVEAL_DURATION
//       );
//     });

//     await revealTimeline.then();

//     await new Promise((resolve) => {
//       setTimeout(resolve, NAVIGATION_DELAY);
//     });

//     navigate(path);

//     await new Promise((resolve) => {
//       requestAnimationFrame(() => {
//         requestAnimationFrame(resolve);
//       });
//     });


// lenis?.scrollTo(0, {
//   immediate: true,
// });

// lenis?.start();
//     const hideOrder = createRandomOrder(squares.length);

//     const hideTimeline = gsap.timeline({
//       onComplete: () => {
//         isTransitioningRef.current = false;
//       },
//     });

//     hideOrder.forEach((squareIndex, orderIndex) => {
//       hideTimeline.to(
//         squares[squareIndex],
//         {
//           autoAlpha: 0,
//           duration: HIDE_DURATION,
//           ease: "none",
//         },
//         orderIndex * HIDE_DURATION
//       );
//     });
//   };

//   return {
//     squaresRef,
//     transitionTo,
//     squareCount: SQUARE_COUNT,
//   };
// };

// export default usePageTransition;











import { useRef } from "react"

import { useNavigate } from "react-router-dom"

import gsap from "gsap"

import useLenisScroll from "../../../components/LenisScroll/useLenisScroll"

const SQUARE_COUNT = 80
const REVEAL_DURATION = 0.035
const HIDE_DURATION = 0.025
const NAVIGATION_DELAY = 80

const createRandomOrder = (length) => {
  const order = Array.from(
    { length },
    (_, index) => index,
  )

  for (let index = order.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(
      Math.random() * (index + 1),
    )

    ;[order[index], order[randomIndex]] = [
      order[randomIndex],
      order[index],
    ]
  }

  return order
}

const wait = (duration) =>
  new Promise((resolve) => {
    setTimeout(resolve, duration)
  })

const waitForNextPaint = () =>
  new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(resolve)
    })
  })

const usePageTransition = () => {
  const navigate = useNavigate()
  const lenis = useLenisScroll()

  const squaresRef = useRef([])
  const isTransitioningRef = useRef(false)

  const transitionTo = async (path) => {
    if (isTransitioningRef.current) {
      return
    }

    if (window.location.pathname === path) {
      return
    }

    isTransitioningRef.current = true

    const squares = squaresRef.current.filter(Boolean)

    if (!squares.length) {
      navigate(path)

      requestAnimationFrame(() => {
        lenis?.scrollTo(0, {
          immediate: true,
        })
      })

      isTransitioningRef.current = false
      return
    }

    try {
      gsap.killTweensOf(squares)

      gsap.set(squares, {
        autoAlpha: 0,
      })

      const revealOrder = createRandomOrder(squares.length)

      const revealTimeline = gsap.timeline()

      revealOrder.forEach((squareIndex, orderIndex) => {
        revealTimeline.to(
          squares[squareIndex],
          {
            autoAlpha: 1,
            duration: REVEAL_DURATION,
            ease: "none",
          },
          orderIndex * REVEAL_DURATION,
        )
      })

      await revealTimeline.then()

      await wait(NAVIGATION_DELAY)

      navigate(path)

      await waitForNextPaint()

      lenis?.scrollTo(0, {
        immediate: true,
      })

      lenis?.start()

      const hideOrder = createRandomOrder(squares.length)

      const hideTimeline = gsap.timeline()

      hideOrder.forEach((squareIndex, orderIndex) => {
        hideTimeline.to(
          squares[squareIndex],
          {
            autoAlpha: 0,
            duration: HIDE_DURATION,
            ease: "none",
          },
          orderIndex * HIDE_DURATION,
        )
      })

      await hideTimeline.then()
    } finally {
      gsap.killTweensOf(squares)

      gsap.set(squares, {
        autoAlpha: 0,
      })

      isTransitioningRef.current = false
    }
  }

  return {
    squaresRef,
    transitionTo,
    squareCount: SQUARE_COUNT,
  }
}

export default usePageTransition