import { Languages } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import { supportedLanguages, type SupportedLanguage } from "@/i18n"
import { cn } from "@/lib/utils"

export function LanguageSwitcher({ className }: { className?: string }) {
  const { i18n, t } = useTranslation()
  const activeLanguage = i18n.resolvedLanguage === "en" ? "en" : "es"

  function handleChange(language: SupportedLanguage) {
    void i18n.changeLanguage(language)
  }

  return (
    <div
      className={cn(
        "inline-flex min-h-10 items-center gap-1 rounded-2xl border border-white/10 bg-white/5 p-1",
        className,
      )}
      aria-label={t("common.language")}
    >
      <Languages className="ml-2 size-4 text-cyan-200" aria-hidden="true" />
      {supportedLanguages.map((language) => (
        <Button
          key={language}
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "min-h-8 rounded-xl px-2.5 text-xs transition-transform duration-200 ease-out active:scale-[0.96]",
            activeLanguage === language
              ? "bg-cyan-300 text-slate-950 hover:bg-cyan-200"
              : "text-slate-300 hover:bg-white/10 hover:text-white",
          )}
          aria-pressed={activeLanguage === language}
          onClick={() => handleChange(language)}
        >
          {language.toUpperCase()}
        </Button>
      ))}
    </div>
  )
}
