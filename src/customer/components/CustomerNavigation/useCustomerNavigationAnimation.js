import { useRef } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const useCustomerNavigationAnimation = () => {
  const overlayRef = useRef(null);
  const linkRefs = useRef([]);
  const languageRef = useRef(null);

  const menuLineTopRef = useRef(null);
  const menuLineMiddleRef = useRef(null);
  const menuLineBottomRef = useRef(null);

  useGSAP(() => {
    gsap.set(overlayRef.current, {
      clipPath: "circle(0% at 100% 0%)",
      autoAlpha: 0,
    });

    gsap.set(linkRefs.current, {
      autoAlpha: 0,
      y: 40,
    });

    gsap.set(languageRef.current, {
      autoAlpha: 0,
      y: 20,
    });

    gsap.set(menuLineTopRef.current, {
      rotation: 0,
      y: -5,
    });

    gsap.set(menuLineMiddleRef.current, {
      autoAlpha: 1,
      scaleX: 1,
    });

    gsap.set(menuLineBottomRef.current, {
      rotation: 0,
      y: 5,
    });
  });

  const openMenu = () => {
    const timeline = gsap.timeline({
      defaults: {
        ease: "power3.out",
      },
    });

    timeline.to(
      menuLineTopRef.current,
      {
        rotation: 45,
        y: 0,
        duration: 0.45,
        ease: "power3.inOut",
      },
      0
    );

    timeline.to(
      menuLineMiddleRef.current,
      {
        autoAlpha: 0,
        scaleX: 0,
        duration: 0.25,
        ease: "power2.inOut",
      },
      0
    );

    timeline.to(
      menuLineBottomRef.current,
      {
        rotation: -45,
        y: 0,
        duration: 0.45,
        ease: "power3.inOut",
      },
      0
    );

    timeline.to(
      overlayRef.current,
      {
        autoAlpha: 1,
        clipPath: "circle(150% at 100% 0%)",
        duration: 1.1,
        ease: "power4.inOut",
      },
      0.05
    );

    timeline.to(
      linkRefs.current,
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.65,
        stagger: 0.09,
        ease: "power3.out",
      },
      "-=0.45"
    );

    timeline.to(
      languageRef.current,
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out",
      },
      "-=0.3"
    );
  };

  const closeMenu = (onComplete) => {
    const timeline = gsap.timeline({
      defaults: {
        ease: "power3.in",
      },
      onComplete,
    });

    timeline.to(
      [...linkRefs.current, languageRef.current],
      {
        autoAlpha: 0,
        y: 20,
        duration: 0.25,
        stagger: 0.035,
      }
    );

    timeline.to(
      overlayRef.current,
      {
        clipPath: "circle(0% at 100% 0%)",
        duration: 0.8,
        ease: "power4.inOut",
      },
      "-=0.05"
    );

    timeline.to(
      menuLineTopRef.current,
      {
        rotation: 0,
        y: -5,
        duration: 0.45,
        ease: "power3.inOut",
      },
      "-=0.45"
    );

    timeline.to(
      menuLineMiddleRef.current,
      {
        autoAlpha: 1,
        scaleX: 1,
        duration: 0.3,
        ease: "power2.inOut",
      },
      "-=0.3"
    );

    timeline.to(
      menuLineBottomRef.current,
      {
        rotation: 0,
        y: 5,
        duration: 0.45,
        ease: "power3.inOut",
      },
      "<"
    );
  };

  return {
    overlayRef,
    linkRefs,
    languageRef,
    menuLineTopRef,
    menuLineMiddleRef,
    menuLineBottomRef,
    openMenu,
    closeMenu,
  };
};

export default useCustomerNavigationAnimation;


