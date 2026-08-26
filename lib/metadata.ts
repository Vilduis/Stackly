import type { Metadata } from "next"

export const SITE_NAME = "Stackly"

const LOCALE = "es_ES"

type PageMetadata = {
  title: string
  socialTitle?: string
  description: string
  path: string
  type?: "website" | "article"
  keywords?: string[]
}

export function buildMetadata({
  title,
  socialTitle,
  description,
  path,
  type = "website",
  keywords,
}: PageMetadata): Metadata {
  const social = socialTitle ?? `${title} — ${SITE_NAME}`

  return {
    title,
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: {
      type,
      siteName: SITE_NAME,
      locale: LOCALE,
      title: social,
      description,
      url: path,
    },
    twitter: {
      card: "summary_large_image",
      title: social,
      description,
    },
  }
}
