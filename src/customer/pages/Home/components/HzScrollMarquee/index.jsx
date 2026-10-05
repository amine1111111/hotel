// import { useRef } from "react";

// import gsap from "gsap";
// import { useGSAP } from "@gsap/react";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// gsap.registerPlugin(ScrollTrigger);

// const ROTATION = -7;
// const PHASE_ONE_END = 0.2;
// const PHASE_TWO_END = 0.5;
// const PHASE_TWO_TRACK_TRAVEL = 0.55;
// const PHASE_THREE_GAP = 64;

// const HzScrollMarquee = ({
//   images = [],
//   horizontalItems = [],
// }) => {
//   const sectionRef = useRef(null);
//   const trackRef = useRef(null);
//   const phaseThreeTrackRef = useRef(null);
//   const mainImageRef = useRef(null);
//   const imageRefs = useRef([]);

//   const mainImageIndex = Math.floor(images.length / 2);

//   useGSAP(
//     () => {
//       const section = sectionRef.current;
//       const track = trackRef.current;
//       const phaseThreeTrack =
//         phaseThreeTrackRef.current;
//       const mainImage = mainImageRef.current;

//       if (
//         !section ||
//         !track ||
//         !phaseThreeTrack ||
//         !mainImage ||
//         images.length < 2
//       ) {
//         return;
//       }

//       const getPhaseOneMeasurements = () => {
//         const viewportWidth = window.innerWidth;
//         const trackWidth = track.offsetWidth;

//         return {
//           startX: viewportWidth - trackWidth,
//           endX:
//             (viewportWidth - trackWidth) / 1.7,
//         };
//       };

//       const setTrack = (x, y = 0) => {
//         gsap.set(track, {
//           x,
//           y,
//           rotation: ROTATION,
//           transformOrigin: "center center",
//           force3D: true,
//         });
//       };

//       const getMainImageLocalPosition = () => {
//         const trackWidth = track.offsetWidth;
//         const trackHeight = track.offsetHeight;

//         return {
//           x:
//             mainImage.offsetLeft +
//             mainImage.offsetWidth / 2 -
//             trackWidth / 2,

//           y:
//             mainImage.offsetTop +
//             mainImage.offsetHeight / 2 -
//             trackHeight / 2,
//         };
//       };

//       const setMainImageTransform = (
//         progress
//       ) => {
//         const easedProgress =
//           gsap.parseEase("power2.inOut")(
//             progress
//           );

//         const rotation =
//           gsap.utils.interpolate(
//             0,
//             -ROTATION,
//             easedProgress
//           );

//         const scale =
//           gsap.utils.interpolate(
//             1,
//             1.5,
//             easedProgress
//           );

//         gsap.set(mainImage, {
//           rotation,
//           scale,
//           transformOrigin: "center center",
//           force3D: true,
//         });
//       };

//       const hideOldImages = () => {
//         imageRefs.current.forEach(
//           (element, index) => {
//             if (
//               element &&
//               index !== mainImageIndex
//             ) {
//               gsap.set(element, {
//                 autoAlpha: 0,
//               });
//             }
//           }
//         );
//       };

//       const showOldImages = () => {
//         imageRefs.current.forEach(
//           (element, index) => {
//             if (
//               element &&
//               index !== mainImageIndex
//             ) {
//               gsap.set(element, {
//                 autoAlpha: 1,
//               });
//             }
//           }
//         );
//       };

//       let measurements =
//         getPhaseOneMeasurements();

//       let phaseTwoTrackEndY = 0;

//       let phaseThreeMainStartX = 0;
//       let phaseThreeContentStartX = 0;

//       let phaseThreeMainTravel = 0;
//       let phaseThreeContentTravel = 0;

//       let phaseThreeInitialized = false;
//       let scrollProgress = 0;

//       const initializePhaseTwo = () => {
//         phaseTwoTrackEndY =
//           -window.innerHeight *
//           PHASE_TWO_TRACK_TRAVEL;
//       };

//       const initializePhaseThree = () => {
//         if (phaseThreeInitialized) {
//           return;
//         }

//         setTrack(
//           measurements.endX,
//           phaseTwoTrackEndY
//         );

//         hideOldImages();

//         const mainRect =
//           mainImage.getBoundingClientRect();

//         phaseThreeMainStartX =
//           measurements.endX;

//         phaseThreeContentStartX =
//           mainRect.right +
//           PHASE_THREE_GAP;

//         phaseThreeMainTravel =
//           mainRect.right;

//         phaseThreeContentTravel =
//           phaseThreeContentStartX +
//           phaseThreeTrack.offsetWidth;

//         gsap.set(
//           phaseThreeTrack,
//           {
//             x: phaseThreeContentStartX,
//             rotation: 0,
//             force3D: true,
//           }
//         );

//         phaseThreeInitialized = true;
//       };

//       const updatePhaseOne = (progress) => {
//         const phaseProgress =
//           gsap.utils.clamp(
//             0,
//             1,
//             progress / PHASE_ONE_END
//           );

//         const x =
//           gsap.utils.interpolate(
//             measurements.startX,
//             measurements.endX,
//             phaseProgress
//           );

//         setTrack(x);

//         gsap.set(mainImage, {
//           x: 0,
//           y: 0,
//           rotation: 0,
//           scale: 1,
//         });
//       };

//       const updatePhaseTwo = (progress) => {
//         const phaseProgress =
//           gsap.utils.clamp(
//             0,
//             1,
//             gsap.utils.mapRange(
//               PHASE_ONE_END,
//               PHASE_TWO_END,
//               0,
//               1,
//               progress
//             )
//           );

//         const trackY =
//           gsap.utils.interpolate(
//             0,
//             phaseTwoTrackEndY,
//             phaseProgress
//           );

//         setTrack(
//           measurements.endX,
//           trackY
//         );

//         setMainImageTransform(
//           phaseProgress
//         );
//       };

//       const updatePhaseThree = (progress) => {
//         initializePhaseThree();

//         const phaseProgress =
//           gsap.utils.clamp(
//             0,
//             1,
//             gsap.utils.mapRange(
//               PHASE_TWO_END,
//               1,
//               0,
//               1,
//               progress
//             )
//           );

//         const mainTravel =
//           phaseThreeMainTravel *
//           phaseProgress;

//         const contentTravel =
//           phaseThreeContentTravel *
//           phaseProgress;

//         const mainX =
//           phaseThreeMainStartX -
//           mainTravel;

//         setTrack(
//           mainX,
//           phaseTwoTrackEndY
//         );

//         gsap.set(mainImage, {
//           rotation: -ROTATION,
//           scale: 1.5,
//           transformOrigin: "center center",
//           force3D: true,
//         });

//         gsap.set(
//           phaseThreeTrack,
//           {
//             x:
//               phaseThreeContentStartX -
//               contentTravel,
//             rotation: 0,
//             force3D: true,
//           }
//         );
//       };

//       const resetPhaseThree = () => {
//         if (!phaseThreeInitialized) {
//           return;
//         }

//         phaseThreeInitialized = false;

//         showOldImages();

//         gsap.set(
//           phaseThreeTrack,
//           {
//             x: window.innerWidth,
//             rotation: 0,
//             force3D: true,
//           }
//         );
//       };

//       const update = (progress) => {
//         scrollProgress =
//           gsap.utils.clamp(
//             0,
//             1,
//             progress
//           );

//         if (
//           scrollProgress <=
//           PHASE_ONE_END
//         ) {
//           resetPhaseThree();

//           updatePhaseOne(
//             scrollProgress
//           );

//           return;
//         }

//         if (
//           scrollProgress <=
//           PHASE_TWO_END
//         ) {
//           resetPhaseThree();

//           updatePhaseTwo(
//             scrollProgress
//           );

//           return;
//         }

//         updatePhaseThree(
//           scrollProgress
//         );
//       };

//       initializePhaseTwo();

//       gsap.set(
//         phaseThreeTrack,
//         {
//           x: window.innerWidth,
//           rotation: 0,
//           force3D: true,
//         }
//       );

//       update(0);

//       const scrollTrigger =
//         ScrollTrigger.create({
//           trigger: section,
//           start: "top 70%",
//           end: "top -140%",
//           scrub: true,
//           invalidateOnRefresh: true,

//           onUpdate: (self) => {
//             update(self.progress);
//           },

//           onRefresh: () => {
//             measurements =
//               getPhaseOneMeasurements();

//             phaseThreeInitialized =
//               false;

//             showOldImages();

//             initializePhaseTwo();

//             gsap.set(
//               phaseThreeTrack,
//               {
//                 x: window.innerWidth,
//                 rotation: 0,
//                 force3D: true,
//               }
//             );

//             update(scrollProgress);
//           },
//         });

//       const handleResize = () => {
//         measurements =
//           getPhaseOneMeasurements();

//         phaseThreeInitialized =
//           false;

//         showOldImages();

//         gsap.set(
//           phaseThreeTrack,
//           {
//             x: window.innerWidth,
//             rotation: 0,
//             force3D: true,
//           }
//         );

//         initializePhaseTwo();

//         ScrollTrigger.refresh();
//       };

//       window.addEventListener(
//         "resize",
//         handleResize
//       );

//       return () => {
//         window.removeEventListener(
//           "resize",
//           handleResize
//         );

//         scrollTrigger.kill();

//         showOldImages();
//       };
//     },
//     {
//       scope: sectionRef,
//       dependencies: [
//         images,
//         horizontalItems,
//       ],
//     }
//   );

//   if (!images.length) {
//     return null;
//   }

//   return (
//     <section
//       ref={sectionRef}
//       className="relative w-full"
//       style={{
//         height: "400vh",
//       }}
//     >
//       <div className="sticky top-0 h-screen w-full overflow-hidden">
//         <div className="relative h-full w-full">
//           <div
//             ref={trackRef}
//             className="absolute left-0 top-1/2 flex w-max items-center gap-16"
//             style={{
//               transform:
//                 "translateY(-50%)",
//               transformOrigin:
//                 "center center",
//             }}
//           >
//             {images.map(
//               (image, index) => (
//                 <div
//                   key={`${image.src}-${index}`}
//                   ref={(element) => {
//                     imageRefs.current[index] =
//                       element;

//                     if (
//                       index ===
//                       mainImageIndex
//                     ) {
//                       mainImageRef.current =
//                         element;
//                     }
//                   }}
//                   className="aspect-video w-[320px] shrink-0"
//                 >
//                   <img
//                     src={image.src}
//                     alt={image.alt ?? ""}
//                     className="block h-full w-full"
//                   />
//                 </div>
//               )
//             )}
//           </div>

//           <div
//             ref={phaseThreeTrackRef}
//             className="absolute left-0 top-1/2 flex w-max -translate-y-1/2 items-center gap-16"
//           >
//             {horizontalItems.map(
//               (item, index) => (
//                 <div
//                   key={`${item.image}-${index}`}
//                   className="flex shrink-0 items-center gap-16"
//                 >
//                   <div className="h-[70vh] w-[40vh] shrink-0 overflow-hidden">
//                     <img
//                       src={item.image}
//                       alt=""
//                       className="block h-full w-full"
//                     />
//                   </div>

//                   <p className="w-[420px] shrink-0 text-xl leading-relaxed">
//                     {item.text}
//                   </p>
//                 </div>
//               )
//             )}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default HzScrollMarquee;

























import { useRef } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ROTATION = -7;

const PHASE_ONE_END = 0.2;
const PHASE_TWO_END = 0.5;
const PHASE_THREE_TRANSITION_END = 0.65;

const PHASE_THREE_GAP = 64;

const HzScrollMarquee = ({
  images = [],
  horizontalItems = [],
}) => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const phaseThreeTrackRef = useRef(null);
  const mainImageRef = useRef(null);
  const floatingImageRef = useRef(null);
  const imageRefs = useRef([]);

  const mainImageIndex = Math.floor(
    images.length / 2
  );

  const mainImage = images[mainImageIndex];

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      const phaseThreeTrack =
        phaseThreeTrackRef.current;
      const mainImageElement =
        mainImageRef.current;
      const floatingImage =
        floatingImageRef.current;

      if (
        !section ||
        !track ||
        !phaseThreeTrack ||
        !mainImageElement ||
        !floatingImage ||
        images.length < 2
      ) {
        return;
      }

      const getPhaseOneMeasurements = () => {
        const viewportWidth =
          window.innerWidth;

        const trackWidth =
          track.offsetWidth;

        return {
          startX:
            viewportWidth - trackWidth,

          endX:
            (viewportWidth - trackWidth) /
            1.7,
        };
      };

      const setTrack = ({
        x,
        y = 0,
        rotation = ROTATION,
      }) => {
        gsap.set(track, {
          x,
          y,
          rotation,
          transformOrigin:
            "center center",
          force3D: true,
        });
      };

      const hideOldImages = () => {
        imageRefs.current.forEach(
          (element, index) => {
            if (
              element &&
              index !== mainImageIndex
            ) {
              gsap.set(element, {
                autoAlpha: 0,
              });
            }
          }
        );
      };

      const showOldImages = () => {
        imageRefs.current.forEach(
          (element, index) => {
            if (
              element &&
              index !== mainImageIndex
            ) {
              gsap.set(element, {
                autoAlpha: 1,
              });
            }
          }
        );
      };

      let measurements =
        getPhaseOneMeasurements();

      let phaseOneEndY = 0;

      let phaseTwoEndY = 0;

      let floatingCenterX = 0;
      let floatingCenterY = 0;
      let floatingWidth = 320;

      let horizontalStartX = 0;

      let mainExitDistance = 0;

      let phaseThreeInitialized = false;

      let scrollProgress = 0;

      const calculateMeasurements = () => {
        measurements =
          getPhaseOneMeasurements();

        setTrack({
          x: measurements.endX,
          y: 0,
          rotation: ROTATION,
        });

        gsap.set(mainImageElement, {
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          transformOrigin:
            "center center",
          force3D: true,
        });

        const mainRect =
          mainImageElement.getBoundingClientRect();

        const viewportCenterX =
          window.innerWidth / 2;

        const viewportCenterY =
          window.innerHeight / 2;

        const mainCenterX =
          mainRect.left +
          mainRect.width / 2;

        const mainCenterY =
          mainRect.top +
          mainRect.height / 2;

        phaseOneEndY =
          viewportCenterY -
          mainCenterY;

        const correctedMainCenterX =
          mainCenterX;

        floatingCenterX =
          viewportCenterX;

        floatingCenterY =
          viewportCenterY;

        floatingWidth =
          mainRect.width;

        phaseTwoEndY =
          -(
            mainRect.top +
            mainRect.height / 2
          );

        phaseTwoEndY -=
          40;

        mainExitDistance =
          viewportCenterX +
          floatingWidth / 2 +
          40;

        horizontalStartX =
          viewportWidthSafe() +
          PHASE_THREE_GAP;

        return correctedMainCenterX;
      };

      const viewportWidthSafe = () => {
        return window.innerWidth;
      };

      const initializePhaseThree = () => {
        if (phaseThreeInitialized) {
          return;
        }

        phaseThreeInitialized = true;

        hideOldImages();

        const currentMainRect =
          mainImageElement.getBoundingClientRect();

        floatingCenterX =
          currentMainRect.left +
          currentMainRect.width / 2;

        floatingCenterY =
          currentMainRect.top +
          currentMainRect.height / 2;

        floatingWidth =
          currentMainRect.width;

        gsap.set(floatingImage, {
          left: floatingCenterX,
          top: floatingCenterY,
          width: floatingWidth,
          xPercent: -50,
          yPercent: -50,
          rotation: -ROTATION,
          scale: 1,
          autoAlpha: 1,
          force3D: true,
        });

        gsap.set(mainImageElement, {
          autoAlpha: 0,
        });

        horizontalStartX =
          floatingCenterX +
          floatingWidth / 2 +
          PHASE_THREE_GAP;

        gsap.set(phaseThreeTrack, {
          x: horizontalStartX,
          rotation: 0,
          force3D: true,
        });
      };

      const resetPhaseThree = () => {
        phaseThreeInitialized = false;

        gsap.set(floatingImage, {
          autoAlpha: 0,
        });

        gsap.set(mainImageElement, {
          autoAlpha: 1,
          rotation: 0,
          scale: 1,
          x: 0,
          y: 0,
          force3D: true,
        });

        showOldImages();

        gsap.set(phaseThreeTrack, {
          x: window.innerWidth,
          rotation: 0,
          force3D: true,
        });
      };

      const updatePhaseOne = (progress) => {
        const phaseProgress =
          gsap.utils.clamp(
            0,
            1,
            progress / PHASE_ONE_END
          );

        const easedProgress =
          gsap.parseEase("power2.out")(
            phaseProgress
          );

        const x =
          gsap.utils.interpolate(
            measurements.startX,
            measurements.endX,
            easedProgress
          );

        const y =
          gsap.utils.interpolate(
            0,
            phaseOneEndY,
            easedProgress
          );

        setTrack({
          x,
          y,
          rotation: ROTATION,
        });

        gsap.set(mainImageElement, {
          autoAlpha: 1,
          rotation: 0,
          scale: 1,
          x: 0,
          y: 0,
          force3D: true,
        });

        gsap.set(floatingImage, {
          autoAlpha: 0,
        });
      };

      const updatePhaseTwo = (progress) => {
        const phaseProgress =
          gsap.utils.clamp(
            0,
            1,
            gsap.utils.mapRange(
              PHASE_ONE_END,
              PHASE_TWO_END,
              0,
              1,
              progress
            )
          );

        const easedProgress =
          gsap.parseEase("power2.inOut")(
            phaseProgress
          );

        const trackY =
          gsap.utils.interpolate(
            phaseOneEndY,
            phaseTwoEndY,
            easedProgress
          );

        setTrack({
          x: measurements.endX,
          y: trackY,
          rotation: ROTATION,
        });

        const rotation =
          gsap.utils.interpolate(
            0,
            -ROTATION,
            easedProgress
          );

        const scale =
          gsap.utils.interpolate(
            1,
            1.5,
            easedProgress
          );

        gsap.set(mainImageElement, {
          autoAlpha: 1,
          rotation,
          scale,
          transformOrigin:
            "center center",
          force3D: true,
        });

        gsap.set(floatingImage, {
          autoAlpha: 0,
        });
      };

      const updatePhaseThree = (progress) => {
        initializePhaseThree();

        const transitionProgress =
          gsap.utils.clamp(
            0,
            1,
            gsap.utils.mapRange(
              PHASE_TWO_END,
              PHASE_THREE_TRANSITION_END,
              0,
              1,
              progress
            )
          );

        const exitProgress =
          gsap.utils.clamp(
            0,
            1,
            gsap.utils.mapRange(
              PHASE_THREE_TRANSITION_END,
              1,
              0,
              1,
              progress
            )
          );

        const easedTransition =
          gsap.parseEase("power2.inOut")(
            transitionProgress
          );

        const easedExit =
          gsap.parseEase("power2.inOut")(
            exitProgress
          );

        const rotation =
          gsap.utils.interpolate(
            -ROTATION,
            0,
            easedTransition
          );

        const scale =
          gsap.utils.interpolate(
            1,
            1.5,
            easedTransition
          );

        const mainX =
          floatingCenterX -
          mainExitDistance *
            easedExit;

        gsap.set(floatingImage, {
          left: mainX,
          top: floatingCenterY,
          width: floatingWidth,
          xPercent: -50,
          yPercent: -50,
          rotation,
          scale,
          autoAlpha: 1,
          force3D: true,
        });

        const horizontalX =
          horizontalStartX -
          mainExitDistance *
            easedExit;

        gsap.set(phaseThreeTrack, {
          x: horizontalX,
          rotation: 0,
          force3D: true,
        });

        const remainingPhaseProgress =
          gsap.utils.clamp(
            0,
            1,
            gsap.utils.mapRange(
              PHASE_TWO_END,
              PHASE_THREE_TRANSITION_END,
              0,
              1,
              progress
            )
          );

        const easedTrackProgress =
          gsap.parseEase("power2.inOut")(
            remainingPhaseProgress
          );

        const trackY =
          gsap.utils.interpolate(
            phaseOneEndY,
            phaseTwoEndY,
            easedTrackProgress
          );

        setTrack({
          x: measurements.endX,
          y: trackY,
          rotation: ROTATION,
        });
      };

      const update = (progress) => {
        scrollProgress =
          gsap.utils.clamp(
            0,
            1,
            progress
          );

        if (
          scrollProgress <=
          PHASE_ONE_END
        ) {
          resetPhaseThree();

          updatePhaseOne(
            scrollProgress
          );

          return;
        }

        if (
          scrollProgress <=
          PHASE_TWO_END
        ) {
          resetPhaseThree();

          updatePhaseTwo(
            scrollProgress
          );

          return;
        }

        updatePhaseThree(
          scrollProgress
        );
      };

      calculateMeasurements();

      gsap.set(floatingImage, {
        autoAlpha: 0,
      });

      gsap.set(phaseThreeTrack, {
        x: window.innerWidth,
        rotation: 0,
        force3D: true,
      });

      update(0);

      const scrollTrigger =
        ScrollTrigger.create({
          trigger: section,
          start: "top 70%",
          end: "top -140%",
          scrub: 1,
          invalidateOnRefresh: true,

          onUpdate: (self) => {
            update(self.progress);
          },

          onRefresh: () => {
            phaseThreeInitialized =
              false;

            showOldImages();

            gsap.set(floatingImage, {
              autoAlpha: 0,
            });

            gsap.set(mainImageElement, {
              autoAlpha: 1,
              rotation: 0,
              scale: 1,
              force3D: true,
            });

            calculateMeasurements();

            gsap.set(phaseThreeTrack, {
              x: window.innerWidth,
              rotation: 0,
              force3D: true,
            });

            update(scrollProgress);
          },
        });

      const handleResize = () => {
        phaseThreeInitialized =
          false;

        showOldImages();

        gsap.set(floatingImage, {
          autoAlpha: 0,
        });

        gsap.set(mainImageElement, {
          autoAlpha: 1,
          rotation: 0,
          scale: 1,
          force3D: true,
        });

        calculateMeasurements();

        gsap.set(phaseThreeTrack, {
          x: window.innerWidth,
          rotation: 0,
          force3D: true,
        });

        ScrollTrigger.refresh();
      };

      window.addEventListener(
        "resize",
        handleResize
      );

      return () => {
        window.removeEventListener(
          "resize",
          handleResize
        );

        scrollTrigger.kill();

        gsap.set(floatingImage, {
          autoAlpha: 0,
        });

        gsap.set(mainImageElement, {
          autoAlpha: 1,
        });

        showOldImages();
      };
    },
    {
      scope: sectionRef,
      dependencies: [
        images,
        horizontalItems,
      ],
    }
  );

  if (!images.length) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{
        height: "400vh",
      }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="relative h-full w-full">
          <div
            ref={trackRef}
            className="absolute left-0 top-1/2 flex w-max items-center gap-16"
            style={{
              transform:
                "translateY(-50%)",
              transformOrigin:
                "center center",
            }}
          >
            {images.map(
              (image, index) => (
                <div
                  key={`${image.src}-${index}`}
                  ref={(element) => {
                    imageRefs.current[index] =
                      element;

                    if (
                      index ===
                      mainImageIndex
                    ) {
                      mainImageRef.current =
                        element;
                    }
                  }}
                  className="aspect-video w-[320px] shrink-0"
                >
                  <img
                    src={image.src}
                    alt={image.alt ?? ""}
                    className="block h-full w-full"
                  />
                </div>
              )
            )}
          </div>

          <div
            ref={floatingImageRef}
            className="pointer-events-none absolute left-1/2 top-1/2 aspect-video w-[320px] overflow-hidden"
            style={{
              opacity: 0,
              transform:
                "translate(-50%, -50%)",
            }}
          >
            <img
              src={mainImage.src}
              alt={mainImage.alt ?? ""}
              className="block h-full w-full"
            />
          </div>

          <div
            ref={phaseThreeTrackRef}
            className="absolute left-0 top-1/2 flex w-max -translate-y-1/2 items-center gap-16"
          >
            {horizontalItems.map(
              (item, index) => (
                <div
                  key={`${item.image}-${index}`}
                  className="flex shrink-0 items-center gap-16"
                >
                  <div className="h-[70vh] w-[40vh] shrink-0 overflow-hidden">
                    <img
                      src={item.image}
                      alt=""
                      className="block h-full w-full"
                    />
                  </div>

                  <p className="w-[420px] shrink-0 text-xl leading-relaxed">
                    {item.text}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HzScrollMarquee;