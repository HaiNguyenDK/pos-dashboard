import { useEffect, useState } from "react"
import { ArrowUpRight } from "lucide-react"
import { useTranslation } from "react-i18next"

import { cn } from "@/lib/utils"

type Slide = {
  tagKey: string
  tagHref?: string
  quoteKey: string
  background: string
}

const SLIDES: Slide[] = [
  {
    tagKey: "auth.slider.slide_tag",
    quoteKey: "auth.slider.slide_1",
    background:
      "linear-gradient(135deg, rgba(15,23,42,0.55), rgba(15,23,42,0.15)), linear-gradient(120deg,#fb923c 0%,#f59e0b 45%,#1d4ed8 100%)",
  },
  {
    tagKey: "auth.slider.slide_tag",
    quoteKey: "auth.slider.slide_2",
    background:
      "linear-gradient(135deg, rgba(15,23,42,0.55), rgba(15,23,42,0.2)), linear-gradient(120deg,#0f172a 0%,#1e3a8a 55%,#fb923c 100%)",
  },
  {
    tagKey: "auth.slider.slide_tag",
    quoteKey: "auth.slider.slide_3",
    background:
      "linear-gradient(135deg, rgba(15,23,42,0.5), rgba(15,23,42,0.1)), linear-gradient(120deg,#f59e0b 0%,#ef4444 50%,#7c3aed 100%)",
  },
  {
    tagKey: "auth.slider.slide_tag",
    quoteKey: "auth.slider.slide_4",
    background:
      "linear-gradient(135deg, rgba(15,23,42,0.55), rgba(15,23,42,0.2)), linear-gradient(120deg,#064e3b 0%,#0f766e 55%,#f59e0b 100%)",
  },
  {
    tagKey: "auth.slider.slide_tag",
    quoteKey: "auth.slider.slide_5",
    background:
      "linear-gradient(135deg, rgba(15,23,42,0.6), rgba(15,23,42,0.25)), linear-gradient(120deg,#1e293b 0%,#334155 55%,#fb923c 100%)",
  },
]

const AUTOPLAY_MS = 6000

export function AuthSlider() {
  const [index, setIndex] = useState(0)
  const { t } = useTranslation()

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % SLIDES.length)
    }, AUTOPLAY_MS)
    return () => window.clearInterval(id)
  }, [])

  const slide = SLIDES[index]

  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-3xl bg-cover bg-center transition-[background] duration-700"
      style={{ backgroundImage: slide.background }}
      role="region"
      aria-roledescription="carousel"
      aria-label={t("auth.slider.carousel_aria")}
    >
      <div className="absolute inset-0 bg-black/10" />

      <div className="absolute top-6 left-6">
        <a
          href={slide.tagHref ?? "#"}
          onClick={(e) => e.preventDefault()}
          className="inline-flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md transition-colors hover:bg-black/50"
        >
          {t(slide.tagKey)}
          <ArrowUpRight className="size-3.5" />
        </a>
      </div>

      <div className="absolute right-6 bottom-6 left-6 flex flex-col gap-5">
        <p className="max-w-xl text-xl leading-snug font-semibold text-white drop-shadow md:text-2xl">
          {`"${t(slide.quoteKey)}"`}
        </p>
        <div className="flex items-center gap-2" role="tablist">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-label={t("auth.slider.slide_aria", { number: i + 1 })}
              aria-selected={i === index}
              onClick={() => setIndex(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === index ? "w-10 bg-white" : "w-6 bg-white/40 hover:bg-white/60"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
