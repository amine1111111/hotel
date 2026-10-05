import { useRef } from "react"
import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger)

const Word = ({ text, isKeyword, keywordBg, keywordClr }) => {
  return (
    <div
      className={`word inline-block relative rounded-xl ${
        isKeyword ? "keyword-wrapper my-1" : "pl-1 py-0.5"
      }`}
    >
      <span
        className={`relative inline-block opacity-0 ${
          isKeyword
            ? `keyword rounded-xl py-1 pl-2 pr-1 font-semibold ${keywordClr} before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-1/2 before:size-full before:rounded-xl before:-z-10 ${keywordBg}`
            : ""
        }`}
      >
        {text}&nbsp;
      </span>
    </div>
  )
}

const TextReveal = ({
  paragraph,
  keywords,
  holderBg = "var(--primary)",
  keywordBg = "before:bg-secondary",
  keywordClr = "text-primary-foreground",
  textClr = "text-primary-foreground",
}) => {
  const wrapperRef = useRef(null)

  const words = paragraph.split(" ").map((w, i) => {
    const normalizedWord = w.toLowerCase().replace(/[.,!?:;""]/g, "")
    const isKeyword = keywords.includes(normalizedWord)

    return (
      <Word
        key={i}
        text={w}
        isKeyword={isKeyword}
        keywordBg={keywordBg}
        keywordClr={keywordClr}
      />
    )
  })

  useGSAP(() => {
    if (!wrapperRef.current) return

    const wordDivs = wrapperRef.current.querySelectorAll(".word")

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapperRef.current,
        start: "top top",
        end: `+=${window.innerHeight * 1.5}px`,
        scrub: true,
        pin: true,
      },
    })

    wordDivs.forEach((w, i) => {
      const span = w.querySelector("span")

      tl.fromTo(
        w,
        { backgroundColor: holderBg },
        {
          backgroundColor: "transparent",
          duration: 0.6,
          ease: "power2.out",
        },
        i * 0.1
      )

      tl.to(
        span,
        {
          opacity: 1,
          duration: 0.4,
          ease: "power2.out",
        },
        i * 0.1 + 0.2
      )
    })
  }, [holderBg])

  return (
    <section
      ref={wrapperRef}
      className={`animated-text-wrapper relative flex h-screen items-center justify-center supports-[height:1dvh]:h-dvh ${textClr}`}
    >
      <div className="animated-text max-w-[45ch] px-2 text-center sm:px-0">
        {words}
      </div>
    </section>
  )
}

export default TextReveal