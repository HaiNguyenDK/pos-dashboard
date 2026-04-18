import { useRef, type ClipboardEvent, type KeyboardEvent } from "react"

import { cn } from "@/lib/utils"

type Props = {
  length?: number
  value: string
  onChange: (value: string) => void
  onComplete?: (value: string) => void
  autoFocus?: boolean
}

export function OtpInput({
  length = 7,
  value,
  onChange,
  onComplete,
  autoFocus,
}: Props) {
  const refs = useRef<(HTMLInputElement | null)[]>([])

  const setAt = (index: number, char: string) => {
    const chars = value.split("")
    while (chars.length < length) chars.push("")
    chars[index] = char
    return chars.slice(0, length).join("").replace(/\s+$/, "")
  }

  const focusAt = (index: number) => {
    const clamped = Math.max(0, Math.min(length - 1, index))
    const el = refs.current[clamped]
    if (!el) return
    el.focus()
    el.select()
  }

  const handleChange = (index: number, raw: string) => {
    const char = raw.replace(/\D/g, "").slice(-1)
    const next = setAt(index, char)
    onChange(next)
    if (!char) return
    if (index < length - 1) {
      focusAt(index + 1)
    } else if (next.length === length && !next.includes(" ")) {
      onComplete?.(next)
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault()
      if (value[index]) {
        onChange(setAt(index, ""))
      } else if (index > 0) {
        onChange(setAt(index - 1, ""))
        focusAt(index - 1)
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault()
      focusAt(index - 1)
    } else if (e.key === "ArrowRight") {
      e.preventDefault()
      focusAt(index + 1)
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length)
    if (!pasted) return
    onChange(pasted)
    const nextFocus = Math.min(pasted.length, length - 1)
    focusAt(nextFocus)
    if (pasted.length === length) onComplete?.(pasted)
  }

  return (
    <div className="flex gap-2 sm:gap-3">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={1}
          autoFocus={autoFocus && i === 0}
          value={value[i] ?? ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.currentTarget.select()}
          aria-label={`Digit ${i + 1}`}
          className={cn(
            "aspect-square min-w-0 flex-1 rounded-xl border text-center text-xl font-semibold",
            "outline-none transition-colors",
            "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          )}
        />
      ))}
    </div>
  )
}
