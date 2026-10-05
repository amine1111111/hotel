import { useTranslation } from "react-i18next"

import BlocksSection from "./components/BlocksSection"
import Hero from "./components/Hero"
import TextReveal from "./components/TextReveal"

const Home = () => {
  const { t } = useTranslation("home")

  return (
    <div className="home mb-20">
      <Hero />

      <TextReveal
        paragraph={t("textReveal.paragraph")}
        keywords={t("textReveal.keywords", { returnObjects: true })}
        holderBg="rgba(44,36,32,1)"
        textClr="text-black"
        keywordClr="text-white"
        keywordBg="before:bg-[#b89b72]"
      />

      <BlocksSection />

    </div>
  )
}

export default Home