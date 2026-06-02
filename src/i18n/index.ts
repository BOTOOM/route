import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import { resources } from "@/i18n/resources"

export const supportedLanguages = ["es", "en"] as const
export type SupportedLanguage = (typeof supportedLanguages)[number]

const languageStorageKey = "uni-route-language"

export function isSupportedLanguage(value: string | null | undefined): value is SupportedLanguage {
  return value === "es" || value === "en"
}

function normalizeLanguage(value: string | null | undefined): SupportedLanguage | null {
  if (!value) {
    return null
  }

  const baseLanguage = value.toLowerCase().split("-")[0]

  return isSupportedLanguage(baseLanguage) ? baseLanguage : null
}

function detectInitialLanguage(): SupportedLanguage {
  if (typeof window === "undefined") {
    return "es"
  }

  const storedLanguage = normalizeLanguage(window.localStorage.getItem(languageStorageKey))

  if (storedLanguage) {
    return storedLanguage
  }

  return normalizeLanguage(window.navigator.language) ?? "es"
}

i18n.use(initReactI18next).init({
  resources,
  lng: detectInitialLanguage(),
  fallbackLng: "es",
  supportedLngs: supportedLanguages,
  interpolation: {
    escapeValue: false,
  },
})

i18n.on("languageChanged", (language) => {
  const supportedLanguage = normalizeLanguage(language) ?? "es"

  if (typeof document !== "undefined") {
    document.documentElement.lang = supportedLanguage
    document.title = i18n.t("common.appName")
    document
      .querySelector("meta[name='description']")
      ?.setAttribute("content", i18n.t("common.metaDescription"))
  }

  if (typeof window !== "undefined") {
    window.localStorage.setItem(languageStorageKey, supportedLanguage)
  }
})

if (typeof document !== "undefined") {
  document.documentElement.lang = normalizeLanguage(i18n.language) ?? "es"
  document.title = i18n.t("common.appName")
  document
    .querySelector("meta[name='description']")
    ?.setAttribute("content", i18n.t("common.metaDescription"))
}

export { i18n }
