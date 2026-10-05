import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger)

const BlocksWrapper = ({ children, classes }) => {
  return (
    <div
      className={`blocks-wrapper ${classes} absolute left-0 right-0 h-[120px] w-full`}
    >
      {children}
    </div>
  )
}

const Blocks = () => {
  return Array(16)
    .fill("")
    .map((_, i) => (
      <div
        key={i}
        className="aspect-square shrink-0 grow bg-background"
      />
    ))
}

const Row = () => {
  return (
    <div className="blocks-wrapper__row">
      <div className="flex h-[60px] overflow-hidden">
        <Blocks />
      </div>
    </div>
  )
}

const BlocksSection = () => {
  useGSAP(() => {
    const blocksWrappers = gsap.utils.toArray(".blocks-wrapper")

    blocksWrappers.forEach((wrapper) => {
      const rows = wrapper.querySelectorAll(".blocks-wrapper__row")
      const nRows = rows.length
      const isTop = wrapper.classList.contains("blocks-wrapper__top")

      rows.forEach((row, rowI) => {
        const blocks = Array.from(row.querySelectorAll("div"))

        gsap.set(blocks, {
          opacity: isTop ? 1 : 0,
        })

        const randomOrder = gsap.utils.shuffle(
          blocks.map((_, blockI) => blockI),
        )

        const blockOffsets = randomOrder.map(
          (blockIndex) => blockIndex / blocks.length,
        )

        ScrollTrigger.create({
          trigger: wrapper,
          start: "top 70%",
          end: "bottom center",
          scrub: true,
          onUpdate: (self) => {
            const progress = self.progress
            const rowDelay = 0.3 * (nRows - rowI - 1)

            const adjustedProgress = gsap.utils.clamp(
              0,
              1,
              progress - rowDelay,
            )

            blocks.forEach((block, i) => {
              const adjusted =
                (adjustedProgress - blockOffsets[i]) * blocks.length

              const clamped = gsap.utils.clamp(0, 1, adjusted)

              block.style.opacity = isTop ? 1 - clamped : clamped
            })
          },
        })
      })
    })
  })

  return (
    <div className="blocks-section relative my-10 h-screen supports-[height:dvh]:h-dvh">
      <BlocksWrapper classes="blocks-wrapper__top top-0">
        <Row />
        <Row />
      </BlocksWrapper>

      <img
        src="/images/home/home.webp"
        alt="blocks section image"
        loading="lazy"
        className="-z-10 size-full object-cover"
      />

      <BlocksWrapper classes="blocks-wrapper__bottom bottom-0">
        <Row />
        <Row />
      </BlocksWrapper>
    </div>
  )
}

export default BlocksSection







