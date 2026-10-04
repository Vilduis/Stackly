import {
  siAngular,
  siAnimedotjs,
  siAstro,
  siAwwwards,
  siBootstrap,
  siChakraui,
  siCloudflareworkers,
  siDjango,
  siDribbble,
  siExpress,
  siFastapi,
  siFirebase,
  siFlask,
  siGithubpages,
  siGsap,
  siHeroui,
  siLaravel,
  siLucide,
  siMantine,
  siMongodb,
  siMui,
  siNeon,
  siNestjs,
  siNetlify,
  siNextdotjs,
  siNodedotjs,
  siRailway,
  siReact,
  siRender,
  siSass,
  siShadcnui,
  siSimpleicons,
  siSpringboot,
  siStyledcomponents,
  siSupabase,
  siSvelte,
  siTailwindcss,
  siThreedotjs,
  siVercel,
  siVuedotjs,
} from "simple-icons"

type Gradiente = {
  x1: number
  y1: number
  x2: number
  y2: number
  stops: { offset: number; color: string }[]
}

type Logo = {
  path: string
  viewBox: string
  light: string | null
  dark: string | null
  gradient?: Gradiente
  fondo?: string
  ratio: number
}

const BOX_24 = "0 0 24 24"

const GRADIENTES: Record<string, Gradiente> = {
  angular: {
    x1: 0.22,
    y1: 0.906,
    x2: 1.012,
    y2: 0.55,
    stops: [
      { offset: 0, color: "#E40035" },
      { offset: 0.2, color: "#F60A48" },
      { offset: 0.4, color: "#F20755" },
      { offset: 0.5, color: "#DC087D" },
      { offset: 0.7, color: "#9717E7" },
      { offset: 1, color: "#6C00F5" },
    ],
  },
}

const FONDOS: Record<string, string> = {
  svelte: "#FF3E00",
}

const COLORES: Record<string, { light: string; dark: string } | null> = {
  nextjs: null,
  angular: null,
  astro: null,
  express: null,
  vercel: null,
  "github-pages": null,
  railway: null,
  render: null,
  "shadcn-ui": null,
  heroui: null,
  animejs: null,
  threejs: null,
  "simple-icons": null,
  awwwards: null,

  django: { light: "#092E20", dark: "#26C086" },
  heroku: { light: "#430098", dark: "#7F1AFF" },
  motion: { light: "#E0D500", dark: "#FFF312" },
}

type Icono = { path: string; hex: string; viewBox?: string }

function marca(slug: string, icono: Icono): Logo {
  const viewBox = icono.viewBox ?? BOX_24
  const oficial = `#${icono.hex}`
  const color =
    slug in COLORES ? COLORES[slug] : { light: oficial, dark: oficial }

  const [, , ancho, alto] = viewBox.split(" ").map(Number)

  return {
    path: icono.path,
    viewBox,
    light: color?.light ?? null,
    dark: color?.dark ?? null,
    ratio: ancho / alto,
    gradient: GRADIENTES[slug],
    fondo: FONDOS[slug],
  }
}

const HEROKU = {
  path: "M230 0c14 0 26 11 26 25v234c0 14-11 25-25 25H26c-14 0-26-11-26-25V26C0 12 11 0 25 0h1zm0 14H26c-7 0-12 5-12 11v234c0 6 5 11 11 11h205c7 0 12-5 12-11V26c0-7-5-12-12-12zM64 185l32 28-32 29zM92 43v80c15-4 34-9 54-9 17 0 28 7 34 12 12 13 12 28 12 30v86h-28v-85c-1-7-4-15-18-15-29 0-61 14-62 15l-20 9V43zm100 0c-2 16-8 31-21 46h-29c11-15 18-30 22-46z",
  hex: "430098",
}

const MOTION = {
  path: "M416.473 0 198.54 385.66H0L170.17 84.522C196.549 37.842 262.377 0 317.203 0Zm486.875 96.415c0-53.249 44.444-96.415 99.27-96.415 54.826 0 99.27 43.166 99.27 96.415 0 53.248-44.444 96.415-99.27 96.415-54.826 0-99.27-43.167-99.27-96.415ZM453.699 0h198.54L434.306 385.66h-198.54Zm234.492 0h198.542L716.56 301.138c-26.378 46.68-92.207 84.522-147.032 84.522h-99.27Z",
  hex: "FFF312",
}

const ICONOS: Record<string, Icono> = {
  react: siReact,
  nextjs: siNextdotjs,
  vue: siVuedotjs,
  angular: siAngular,
  svelte: siSvelte,
  astro: siAstro,

  nodejs: siNodedotjs,
  express: siExpress,
  fastapi: siFastapi,
  django: siDjango,
  flask: siFlask,
  "spring-boot": siSpringboot,
  laravel: siLaravel,
  nestjs: siNestjs,

  neon: siNeon,
  supabase: siSupabase,
  firebase: siFirebase,
  "mongodb-atlas": siMongodb,

  vercel: siVercel,
  netlify: siNetlify,
  "github-pages": siGithubpages,
  railway: siRailway,
  render: siRender,
  heroku: { ...HEROKU, viewBox: "0 0 256 284.4" },
  "cloudflare-workers": siCloudflareworkers,

  "shadcn-ui": siShadcnui,
  heroui: siHeroui,
  "material-ui": siMui,
  mantine: siMantine,
  "chakra-ui": siChakraui,

  tailwindcss: siTailwindcss,
  bootstrap: siBootstrap,
  sass: siSass,
  "styled-components": siStyledcomponents,

  motion: { ...MOTION, viewBox: "0 0 1103 386" },
  gsap: siGsap,
  animejs: siAnimedotjs,
  threejs: siThreedotjs,

  lucide: siLucide,
  "simple-icons": siSimpleicons,

  dribbble: siDribbble,
  awwwards: siAwwwards,
}

const LOGOS: Record<string, Logo> = Object.fromEntries(
  Object.entries(ICONOS).map(([slug, icono]) => [slug, marca(slug, icono)])
)

export function getLogo(slug: string): Logo | null {
  return LOGOS[slug] ?? null
}
