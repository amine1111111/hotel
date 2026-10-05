import InfiniteSpiral from "./components/InfiniteSpiral"


const IMAGES = [
  {
    src: "/images/gallery/gallery-img__1.webp",
    alt: "Hotel gallery image 1",
  },
  {
    src: "/images/gallery/gallery-img__2.webp",
    alt: "Hotel gallery image 2",
  },
  {
    src: "/images/gallery/gallery-img__3.webp",
    alt: "Hotel gallery image 3",
  },
  {
    src: "/images/gallery/gallery-img__4.webp",
    alt: "Hotel gallery image 4",
  },
  {
    src: "/images/gallery/gallery-img__5.webp",
    alt: "Hotel gallery image 5",
  },
  {
    src: "/images/gallery/gallery-img__6.webp",
    alt: "Hotel gallery image 6",
  },
  {
    src: "/images/gallery/gallery-img__7.webp",
    alt: "Hotel gallery image 7",
  },
  {
    src: "/images/gallery/gallery-img__8.webp",
    alt: "Hotel gallery image 8",
  },
  {
    src: "/images/gallery/gallery-img__9.webp",
    alt: "Hotel gallery image 9",
  },
  {
    src: "/images/gallery/gallery-img__10.webp",
    alt: "Hotel gallery image 10",
  },
  {
    src: "/images/gallery/gallery-img__11.webp",
    alt: "Hotel gallery image 11",
  },
  {
    src: "/images/gallery/gallery-img__12.webp",
    alt: "Hotel gallery image 12",
  },
]
const Gallery = () => {
  return (
    <main className="h-screen w-full overflow-hidden">
      <section className="relative h-full w-full overflow-hidden">
        <InfiniteSpiral
          items={IMAGES}
          animationMode="auto"
          speed={0.35}
          radius={190}
          cardWidth={130}
          cardHeight={170}
          verticalSpacing={75}
          perspective={1100}
          cardRadius={4}
          centerScale={1.15}
          edgeBlur={4}
          cardsPerTurn={8}
          pauseOnHover
          direction="up"
          rotation={0}
          cardTilt={0}
          edgeFade={0.25}
          imageFit="cover"
          grayscale={0}
        />
      </section>
    </main>
  )
}

export default Gallery