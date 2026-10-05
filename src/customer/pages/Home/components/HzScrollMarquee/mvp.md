import { useRef } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ROTATION = -7;
const PHASE_ONE_END = 0.2;
const PHASE_TWO_END = 0.5;
const PHASE_TWO_TRACK_TRAVEL = 0.55;
const PHASE_THREE_GAP = 64;

const HzScrollMarquee = ({
  images = [],
  horizontalItems = [],
}) => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const phaseThreeTrackRef = useRef(null);
  const mainImageRef = useRef(null);
  const imageRefs = useRef([]);

  const mainImageIndex = Math.floor(images.length / 2);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      const phaseThreeTrack =
        phaseThreeTrackRef.current;
      const mainImage = mainImageRef.current;

      if (
        !section ||
        !track ||
        !phaseThreeTrack ||
        !mainImage ||
        images.length < 2
      ) {
        return;
      }

      const getPhaseOneMeasurements = () => {
        const viewportWidth = window.innerWidth;
        const trackWidth = track.offsetWidth;

        return {
          startX: viewportWidth - trackWidth,
          endX:
            (viewportWidth - trackWidth) / 1.7,
        };
      };

      const getMainImageCenterY = () => {
        const rect =
          mainImage.getBoundingClientRect();

        return rect.top + rect.height / 2;
      };

      const setTrack = (x, y = 0) => {
        gsap.set(track, {
          x,
          y,
          rotation: ROTATION,
          transformOrigin: "center center",
          force3D: true,
        });
      };

      const setMainImage = ({
        centerY,
        startY,
        trackY,
        progress,
      }) => {
        const transformationProgress =
          gsap.utils.clamp(
            0,
            1,
            progress / 0.25
          );

        const rotation =
          gsap.utils.interpolate(
            0,
            -ROTATION,
            transformationProgress
          );

        const scale =
          gsap.utils.interpolate(
            1,
            1.5,
            transformationProgress
          );

        const rotationRadians =
          (ROTATION * Math.PI) / 180;

        const localY =
          (
            centerY -
            startY -
            trackY
          ) /
          Math.cos(rotationRadians);

        gsap.set(mainImage, {
          y: localY,
          rotation,
          scale,
          transformOrigin: "center center",
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

      let phaseTwoStartY = 0;
      let phaseTwoTargetY = 0;
      let phaseTwoTrackEndY = 0;

      let phaseThreeMainStartX = 0;
      let phaseThreeContentStartX = 0;

      let phaseThreeMainTravel = 0;
      let phaseThreeContentTravel = 0;

      let phaseThreeInitialized = false;
      let scrollProgress = 0;

      const initializePhaseTwo = () => {
        setTrack(
          measurements.endX,
          0
        );

        phaseTwoStartY =
          getMainImageCenterY();

        phaseTwoTargetY =
          window.innerHeight / 2;

        phaseTwoTrackEndY =
          -window.innerHeight *
          PHASE_TWO_TRACK_TRAVEL;
      };

      const initializePhaseThree = () => {
        if (phaseThreeInitialized) {
          return;
        }

        initializePhaseTwo();

        setTrack(
          measurements.endX,
          phaseTwoTrackEndY
        );

        setMainImage({
          centerY: phaseTwoTargetY,
          startY: phaseTwoStartY,
          trackY: phaseTwoTrackEndY,
          progress: 0.25,
        });

        hideOldImages();

        const mainRect =
          mainImage.getBoundingClientRect();

        phaseThreeMainStartX =
          gsap.getProperty(track, "x") || 0;

        phaseThreeContentStartX =
          mainRect.right +
          PHASE_THREE_GAP;

        /*
         * Main image:
         * Travel far enough for its complete
         * width to leave through the left side.
         */
        phaseThreeMainTravel =
          mainRect.right;

        /*
         * New horizontal content:
         * Travel from its starting position
         * until its complete width has left
         * through the left side.
         */
        phaseThreeContentTravel =
          phaseThreeContentStartX +
          phaseThreeTrack.offsetWidth;

        gsap.set(
          phaseThreeTrack,
          {
            x: phaseThreeContentStartX,
            rotation: 0,
            force3D: true,
          }
        );

        phaseThreeInitialized = true;
      };

      const updatePhaseOne = (progress) => {
        const phaseProgress =
          gsap.utils.clamp(
            0,
            1,
            progress / PHASE_ONE_END
          );

        const x =
          gsap.utils.interpolate(
            measurements.startX,
            measurements.endX,
            phaseProgress
          );

        setTrack(x);

        gsap.set(mainImage, {
          y: 0,
          rotation: 0,
          scale: 1,
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

        const trackY =
          gsap.utils.interpolate(
            0,
            phaseTwoTrackEndY,
            phaseProgress
          );

        /*
         * The main image itself moves downward
         * toward the viewport center.
         */
        const centerY =
          gsap.utils.interpolate(
            phaseTwoStartY,
            phaseTwoTargetY,
            phaseProgress
          );

        setTrack(
          measurements.endX,
          trackY
        );

        setMainImage({
          centerY,
          startY: phaseTwoStartY,
          trackY,
          progress:
            phaseProgress * 0.25,
        });
      };

      const updatePhaseThree = (progress) => {
        initializePhaseThree();

        const phaseProgress =
          gsap.utils.clamp(
            0,
            1,
            gsap.utils.mapRange(
              PHASE_TWO_END,
              1,
              0,
              1,
              progress
            )
          );

        const mainTravel =
          phaseThreeMainTravel *
          phaseProgress;

        const contentTravel =
          phaseThreeContentTravel *
          phaseProgress;

        /*
         * Main image is now vertically locked.
         * Only X continues changing.
         */
        gsap.set(track, {
          x:
            phaseThreeMainStartX -
            mainTravel,
          y: phaseTwoTrackEndY,
          rotation: ROTATION,
          force3D: true,
        });

        setMainImage({
          centerY: phaseTwoTargetY,
          startY: phaseTwoStartY,
          trackY: phaseTwoTrackEndY,
          progress: 0.25,
        });

        /*
         * The new horizontal slider keeps moving
         * until every item has passed through.
         */
        gsap.set(
          phaseThreeTrack,
          {
            x:
              phaseThreeContentStartX -
              contentTravel,
            rotation: 0,
            force3D: true,
          }
        );
      };

      const resetPhaseThree = () => {
        if (!phaseThreeInitialized) {
          return;
        }

        phaseThreeInitialized = false;

        showOldImages();

        gsap.set(
          phaseThreeTrack,
          {
            x: window.innerWidth,
            rotation: 0,
            force3D: true,
          }
        );
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

      initializePhaseTwo();

      gsap.set(
        phaseThreeTrack,
        {
          x: window.innerWidth,
          rotation: 0,
          force3D: true,
        }
      );

      update(0);

      const scrollTrigger =
        ScrollTrigger.create({
          trigger: section,
          start: "top 70%",
          end: "top -140%",
          scrub: true,
          invalidateOnRefresh: true,

          onUpdate: (self) => {
            update(self.progress);
          },

          onRefresh: () => {
            measurements =
              getPhaseOneMeasurements();

            if (
              phaseThreeInitialized
            ) {
              phaseThreeInitialized =
                false;

              showOldImages();
            }

            initializePhaseTwo();
            update(scrollProgress);
          },
        });

      const handleResize = () => {
        measurements =
          getPhaseOneMeasurements();

        phaseThreeInitialized =
          false;

        showOldImages();

        gsap.set(
          phaseThreeTrack,
          {
            x: window.innerWidth,
            rotation: 0,
            force3D: true,
          }
        );

        initializePhaseTwo();

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