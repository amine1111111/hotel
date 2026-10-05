// import styles from "./index.module.css"

// import { useEffect, useRef, useState } from "react"
// import { preload } from "react-dom"

// import gsap from "gsap"
// import { ScrollTrigger } from "gsap/ScrollTrigger"
// import { useGSAP } from "@gsap/react"

// gsap.registerPlugin(ScrollTrigger)

// preload("/videos/hero-video__1.webm", {
//   as: "video",
// })

// const initialElements = [
//   { id: 1, active: true, next: false },
//   { id: 2, active: false, next: true },
//   { id: 3, active: false, next: false },
// ]

// const Elements = () => {
//   const [elements, setElements] = useState(initialElements)

//   const elementRefs = useRef([])
//   const videoRefs = useRef([])
//   const timeoutRef = useRef(null)

//   const handleClick = (index) => {
//     if (!elements[index].next) return

//     const currentEl = elementRefs.current[index]

//     gsap.to(currentEl, {
//       width: "100%",
//       height: "100%",
//       ease: "power2.out",
//       duration: 0.5,
//     })

//     timeoutRef.current = setTimeout(() => {
//       setElements((prev) => {
//         const length = prev.length
//         const nextIndex = (index + 1) % length

//         elementRefs.current.forEach((el, i) => {
//           if (i !== index) {
//             gsap.set(el, {
//               clearProps: "width,height",
//             })
//           }
//         })

//         return prev.map((item, i) => ({
//           ...item,
//           active: i === index,
//           next: i === nextIndex,
//         }))
//       })
//     }, 500)
//   }

//   useEffect(() => {
//     return () => {
//       if (timeoutRef.current) {
//         clearTimeout(timeoutRef.current)
//       }
//     }
//   }, [])

//   useEffect(() => {
//     elements.forEach((element, i) => {
//       const video = videoRefs.current[i]

//       if (!video) return

//       if (element.active) {
//         if (video.readyState === 0) {
//           video.load()
//         }

//         video.play().catch(() => {})
//       } else {
//         video.pause()
//         video.currentTime = 0
//       }
//     })
//   }, [elements])

//   const getElementClass = (element) => `
//     ${styles.element}
//     ${element.active ? styles.active : ""}
//     ${element.next ? styles.next : ""}
//     rounded-lg absolute top-1/2 left-1/2 -translate-1/2
//     w-screen h-screen
//   `

//   return (
//     <>
//       {elements.map((element, i) => (
//         <div
//           key={element.id}
//           ref={(el) => {
//             elementRefs.current[i] = el
//           }}
//           className={getElementClass(element)}
//           onClick={() => handleClick(i)}
//           aria-hidden="true"
//         >
//           <video
//             ref={(video) => {
//               videoRefs.current[i] = video
//             }}
//             className="size-full rounded-lg object-cover pointer-events-none select-none"
//             muted
//             loop
//             autoPlay={element.active}
//             playsInline
//             preload={element.active ? "auto" : "none"}
//             disablePictureInPicture
//             controlsList="nodownload noplaybackrate nofullscreen"
//           >
//             <source
//               src={`/videos/hero-video__${i + 1}.webm`}
//               type="video/webm"
//             />
//             <source
//               src={`/videos/hero-video__${i + 1}.mp4`}
//               type="video/mp4"
//             />
//           </video>
//         </div>
//       ))}
//     </>
//   )
// }

// const Hero = () => {
//   const containerRef = useRef(null)

//   const heroClipAnimation = () => {
//     return gsap.fromTo(
//       containerRef.current,
//       {
//         clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
//         borderRadius: "0% 0% 0% 0%",
//       },
//       {
//         clipPath: "polygon(14% 0, 72% 0, 88% 90%, 0 95%)",
//         borderRadius: "0% 0% 40% 10%",
//         ease: "power1.inOut",
//         scrollTrigger: {
//           trigger: containerRef.current,
//           start: "center center",
//           end: "bottom center",
//           scrub: true,
//         },
//       },
//     )
//   }

//   useGSAP(
//     () => {
//       heroClipAnimation()
//     },
//     {
//       scope: containerRef,
//     },
//   )

//   return (
//     <div
//       ref={containerRef}
//       className="hero relative h-screen overflow-hidden"
//     >
//       <Elements />
//     </div>
//   )
// }

// export default Hero
































// import styles from "./index.module.css"

// import { useEffect, useRef, useState } from "react"
// import { preload } from "react-dom"

// import gsap from "gsap"
// import { ScrollTrigger } from "gsap/ScrollTrigger"
// import { useGSAP } from "@gsap/react"

// gsap.registerPlugin(ScrollTrigger)

// preload("/videos/hero-video__1.webm", {
//   as: "video",
// })

// const initialElements = [
//   { id: 1, active: true, next: false },
//   { id: 2, active: false, next: true },
//   { id: 3, active: false, next: false },
// ]

// const Elements = () => {
//   const [elements, setElements] = useState(initialElements)

//   const elementRefs = useRef([])
//   const videoRefs = useRef([])
//   const timeoutRef = useRef(null)

//   const handleClick = (index) => {
//     if (!elements[index].next) return

//     const currentEl = elementRefs.current[index]

//     gsap.to(currentEl, {
//       width: "100%",
//       height: "100%",
//       ease: "power2.out",
//       duration: 0.5,
//     })

//     timeoutRef.current = setTimeout(() => {
//       setElements((prev) => {
//         const length = prev.length
//         const nextIndex = (index + 1) % length

//         elementRefs.current.forEach((el, i) => {
//           if (i !== index) {
//             gsap.set(el, {
//               clearProps: "width,height",
//             })
//           }
//         })

//         return prev.map((item, i) => ({
//           ...item,
//           active: i === index,
//           next: i === nextIndex,
//         }))
//       })
//     }, 500)
//   }

//   useEffect(() => {
//     return () => {
//       if (timeoutRef.current) {
//         clearTimeout(timeoutRef.current)
//       }
//     }
//   }, [])

//   useEffect(() => {
//     elements.forEach((element, i) => {
//       const video = videoRefs.current[i]

//       if (!video) return

//       if (element.active) {
//         if (video.readyState === 0) {
//           video.load()
//         }

//         video.play().catch(() => {})
//       } else {
//         video.pause()
//         video.currentTime = 0
//       }
//     })
//   }, [elements])

//   const getElementClass = (element) => `
//     ${styles.element}
//     ${element.active ? styles.active : ""}
//     ${element.next ? styles.next : ""}
//     rounded-lg absolute top-1/2 left-1/2 -translate-1/2
//     w-screen h-screen
//   `

//   return (
//     <>
//       {elements.map((element, i) => (
//         <div
//           key={element.id}
//           ref={(el) => {
//             elementRefs.current[i] = el
//           }}
//           className={getElementClass(element)}
//           onClick={() => handleClick(i)}
//           aria-hidden="true"
//         >
//           <video
//             ref={(video) => {
//               videoRefs.current[i] = video
//             }}
//             className="size-full rounded-lg object-cover pointer-events-none select-none"
//             muted
//             loop
//             autoPlay={element.active}
//             playsInline
//             preload={element.active || element.next ? "metadata" : "none"}
//             disablePictureInPicture
//             controlsList="nodownload noplaybackrate nofullscreen"
//           >
//             <source
//               src={`/videos/hero-video__${i + 1}.webm`}
//               type="video/webm"
//             />
//             <source
//               src={`/videos/hero-video__${i + 1}.mp4`}
//               type="video/mp4"
//             />
//           </video>
//         </div>
//       ))}
//     </>
//   )
// }

// const Hero = () => {
//   const containerRef = useRef(null)

//   const heroClipAnimation = () => {
//     return gsap.fromTo(
//       containerRef.current,
//       {
//         clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
//         borderRadius: "0% 0% 0% 0%",
//       },
//       {
//         clipPath: "polygon(14% 0, 72% 0, 88% 90%, 0 95%)",
//         borderRadius: "0% 0% 40% 10%",
//         ease: "power1.inOut",
//         scrollTrigger: {
//           trigger: containerRef.current,
//           start: "center center",
//           end: "bottom center",
//           scrub: true,
//         },
//       },
//     )
//   }

//   useGSAP(
//     () => {
//       heroClipAnimation()
//     },
//     {
//       scope: containerRef,
//     },
//   )

//   return (
//     <div
//       ref={containerRef}
//       className="hero relative h-screen overflow-hidden"
//     >
//       <Elements />
//     </div>
//   )
// }

// export default Hero








































// import styles from "./index.module.css"

// import { useEffect, useRef, useState } from "react"

// import gsap from "gsap"
// import { ScrollTrigger } from "gsap/ScrollTrigger"
// import { useGSAP } from "@gsap/react"

// gsap.registerPlugin(ScrollTrigger)

// const initialElements = [
//   { id: 1, active: true, next: false },
//   { id: 2, active: false, next: true },
// ]

// const Elements = () => {
//   const [elements, setElements] = useState(initialElements)

//   const elementRefs = useRef([])
//   const videoRefs = useRef([])
//   const timeoutRef = useRef(null)

//   const handleClick = (index) => {
//     if (!elements[index].next) return

//     const currentEl = elementRefs.current[index]

//     gsap.to(currentEl, {
//       width: "100%",
//       height: "100%",
//       ease: "power2.out",
//       duration: 0.5,
//     })

//     timeoutRef.current = setTimeout(() => {
//       setElements((prev) => {
//         const length = prev.length
//         const nextIndex = (index + 1) % length

//         elementRefs.current.forEach((el, i) => {
//           if (i !== index) {
//             gsap.set(el, {
//               clearProps: "width,height",
//             })
//           }
//         })

//         return prev.map((item, i) => ({
//           ...item,
//           active: i === index,
//           next: i === nextIndex,
//         }))
//       })
//     }, 500)
//   }

//   useEffect(() => {
//     return () => {
//       if (timeoutRef.current) {
//         clearTimeout(timeoutRef.current)
//       }
//     }
//   }, [])

//   useEffect(() => {
//     elements.forEach((element, i) => {
//       const video = videoRefs.current[i]

//       if (!video) return

//       if (element.active) {
//         video.play().catch(() => {})
//       } else {
//         video.pause()
//         video.currentTime = 0
//       }
//     })
//   }, [elements])

//   const getElementClass = (element) => `
//     ${styles.element}
//     ${element.active ? styles.active : ""}
//     ${element.next ? styles.next : ""}
//     rounded-lg absolute top-1/2 left-1/2 -translate-1/2
//     w-screen h-screen
//   `

//   return (
//     <>
//       {elements.map((element, i) => (
//         <div
//           key={element.id}
//           ref={(el) => {
//             elementRefs.current[i] = el
//           }}
//           className={getElementClass(element)}
//           onClick={() => handleClick(i)}
//           aria-hidden="true"
//         >
//           <video
//             ref={(video) => {
//               videoRefs.current[i] = video
//             }}
//             className="size-full rounded-lg object-cover pointer-events-none select-none"
//             muted
//             loop
//             playsInline
//             preload={element.active || element.next ? "metadata" : "none"}
//             disablePictureInPicture
//             controlsList="nodownload noplaybackrate nofullscreen"
//           >
//             <source
//               src={`/videos/hero-video__${i + 2}.webm`}
//               type="video/webm"
//             />
//             <source
//               src={`/videos/hero-video__${i + 2}.mp4`}
//               type="video/mp4"
//             />
//           </video>
//         </div>
//       ))}
//     </>
//   )
// }

// const Hero = () => {
//   const containerRef = useRef(null)

//   const heroClipAnimation = () => {
//     return gsap.fromTo(
//       containerRef.current,
//       {
//         clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
//         borderRadius: "0% 0% 0% 0%",
//       },
//       {
//         clipPath: "polygon(14% 0, 72% 0, 88% 90%, 0 95%)",
//         borderRadius: "0% 0% 40% 10%",
//         ease: "power1.inOut",
//         scrollTrigger: {
//           trigger: containerRef.current,
//           start: "center center",
//           end: "bottom center",
//           scrub: true,
//         },
//       },
//     )
//   }

//   useGSAP(
//     () => {
//       heroClipAnimation()
//     },
//     {
//       scope: containerRef,
//     },
//   )

//   return (
//     <div
//       ref={containerRef}
//       className="hero relative h-screen overflow-hidden"
//     >
//       <Elements />
//     </div>
//   )
// }

// export default Hero





















// import styles from "./index.module.css"

// import { useEffect, useRef, useState } from "react"

// import gsap from "gsap"
// import { ScrollTrigger } from "gsap/ScrollTrigger"
// import { useGSAP } from "@gsap/react"

// gsap.registerPlugin(ScrollTrigger)

// const initialElements = [
//   { id: 1, active: true, next: false },
//   { id: 2, active: false, next: true },
// ]

// const Elements = () => {
//   const [elements, setElements] = useState(initialElements)

//   const elementRefs = useRef([])
//   const videoRefs = useRef([])
//   const timeoutRef = useRef(null)

//   const handleClick = (index) => {
//     if (!elements[index].next) return

//     const currentEl = elementRefs.current[index]

//     gsap.to(currentEl, {
//       width: "100%",
//       height: "100%",
//       ease: "power2.out",
//       duration: 0.5,
//     })

//     timeoutRef.current = setTimeout(() => {
//       setElements((prev) => {
//         const length = prev.length
//         const nextIndex = (index + 1) % length

//         elementRefs.current.forEach((el, i) => {
//           if (i !== index) {
//             gsap.set(el, {
//               clearProps: "width,height",
//             })
//           }
//         })

//         return prev.map((item, i) => ({
//           ...item,
//           active: i === index,
//           next: i === nextIndex,
//         }))
//       })
//     }, 500)
//   }

//   useEffect(() => {
//     return () => {
//       if (timeoutRef.current) {
//         clearTimeout(timeoutRef.current)
//       }
//     }
//   }, [])

//   useEffect(() => {
//     elements.forEach((element, i) => {
//       const video = videoRefs.current[i]

//       if (!video) return

//       if (element.active) {
//         video.play().catch(() => {})
//       } else {
//         video.pause()
//         video.currentTime = 0
//       }
//     })
//   }, [elements])

//   const getElementClass = (element) => `
//     ${styles.element}
//     ${element.active ? styles.active : ""}
//     ${element.next ? styles.next : ""}
//     rounded-lg absolute top-1/2 left-1/2 -translate-1/2
//     w-screen h-screen
//   `

//   return (
//     <>
//       {elements.map((element, i) => (
//         <div
//           key={element.id}
//           ref={(el) => {
//             elementRefs.current[i] = el
//           }}
//           className={getElementClass(element)}
//           onClick={() => handleClick(i)}
//           aria-hidden="true"
//         >
//           <video
//             ref={(video) => {
//               videoRefs.current[i] = video
//             }}
//             className="size-full rounded-lg object-cover pointer-events-none select-none"
//             muted
//             loop
//             playsInline
//             preload={element.active || element.next ? "metadata" : "none"}
//             poster={i === 0 ? "/images/home/poster.webp" : undefined}
//             fetchPriority={i === 0 ? "high" : "auto"}
//             disablePictureInPicture
//             controlsList="nodownload noplaybackrate nofullscreen"
//           >
//             <source
//               src={`/videos/hero-video__${i + 2}.webm`}
//               type="video/webm"
//             />
//             <source
//               src={`/videos/hero-video__${i + 2}.mp4`}
//               type="video/mp4"
//             />
//           </video>
//         </div>
//       ))}
//     </>
//   )
// }

// const Hero = () => {
//   const containerRef = useRef(null)

//   const heroClipAnimation = () => {
//     return gsap.fromTo(
//       containerRef.current,
//       {
//         clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
//         borderRadius: "0% 0% 0% 0%",
//       },
//       {
//         clipPath: "polygon(14% 0, 72% 0, 88% 90%, 0 95%)",
//         borderRadius: "0% 0% 40% 10%",
//         ease: "power1.inOut",
//         scrollTrigger: {
//           trigger: containerRef.current,
//           start: "center center",
//           end: "bottom center",
//           scrub: true,
//         },
//       },
//     )
//   }

//   useGSAP(
//     () => {
//       heroClipAnimation()
//     },
//     {
//       scope: containerRef,
//     },
//   )

//   return (
//     <div
//       ref={containerRef}
//       className="hero relative h-screen overflow-hidden"
//     >
//       <Elements />
//     </div>
//   )
// }

// export default Hero
































import styles from "./index.module.css"

import { useEffect, useRef, useState } from "react"

import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger)

const initialElements = [
  { id: 1, active: true, next: false },
  { id: 2, active: false, next: true },
]

const Elements = () => {
  const [elements, setElements] = useState(initialElements)

  const elementRefs = useRef([])
  const videoRefs = useRef([])
  const timeoutRef = useRef(null)

  const handleClick = (index) => {
    if (!elements[index].next) return

    const currentEl = elementRefs.current[index]

    gsap.to(currentEl, {
      width: "100%",
      height: "100%",
      ease: "power2.out",
      duration: 0.5,
    })

    timeoutRef.current = setTimeout(() => {
      setElements((prev) => {
        const length = prev.length
        const nextIndex = (index + 1) % length

        elementRefs.current.forEach((el, i) => {
          if (i !== index) {
            gsap.set(el, {
              clearProps: "width,height",
            })
          }
        })

        return prev.map((item, i) => ({
          ...item,
          active: i === index,
          next: i === nextIndex,
        }))
      })
    }, 500)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    elements.forEach((element, i) => {
      const video = videoRefs.current[i]

      if (!video) return

      if (element.active) {
        video.play().catch(() => {})
      } else {
        video.pause()
        video.currentTime = 0
      }
    })
  }, [elements])

  const getElementClass = (element) => `
    ${styles.element}
    ${element.active ? styles.active : ""}
    ${element.next ? styles.next : ""}
    rounded-lg absolute top-1/2 left-1/2 -translate-1/2
    w-screen h-screen
  `

  return (
    <>
      {elements.map((element, i) => (
        <div
          key={element.id}
          ref={(el) => {
            elementRefs.current[i] = el
          }}
          className={getElementClass(element)}
          onClick={() => handleClick(i)}
          aria-hidden="true"
        >
          <video
            ref={(video) => {
              videoRefs.current[i] = video
            }}
            className="size-full rounded-lg object-cover pointer-events-none select-none"
            muted
            loop
            playsInline
            preload={element.active || element.next ? "metadata" : "none"}
            poster={i === 0 ? "/images/home/poster.webp" : undefined}
            fetchPriority={i === 0 ? "high" : "auto"}
            disablePictureInPicture
            controlsList="nodownload noplaybackrate nofullscreen"
          >
            <source
              src={`/videos/hero-video__${i + 2}.webm`}
              type="video/webm"
            />
            <source
              src={`/videos/hero-video__${i + 2}.mp4`}
              type="video/mp4"
            />
          </video>
        </div>
      ))}
    </>
  )
}

const Hero = () => {
  const containerRef = useRef(null)

const heroClipAnimation = () => {
  const hero = containerRef.current

  if (!hero) return

  gsap.set(hero, {
    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    borderRadius: "0% 0% 0% 0%",
  })

  gsap.to(hero, {
    clipPath: "polygon(14% 0%, 72% 0%, 88% 90%, 0% 95%)",
    borderRadius: "0% 0% 40% 10%",
    ease: "none",
    scrollTrigger: {
      trigger: hero,
      start: "center center",
      end: "bottom center",
      scrub: 0.15,
      invalidateOnRefresh: true,
    },
  })
}

  useGSAP(
    () => {
      heroClipAnimation()
    },
    {
      scope: containerRef,
    },
  )

  return (
    <div
      ref={containerRef}
      className="hero relative h-screen overflow-hidden"
    >
      <Elements />
    </div>
  )
}

export default Hero






























