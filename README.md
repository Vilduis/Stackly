# Stackly

Catálogo en español de herramientas para crear páginas web. Reúne 51 herramientas
organizadas en 9 categorías —frontend, backend, bases de datos, deploy,
componentes UI, estilos, animaciones, iconos e inspiración— con una ficha de cada
una: qué hace, cuándo conviene, si es gratis, freemium o de pago, y el nivel que
pide.

## Qué muestra

- **Inicio**: las 9 categorías con su número de herramientas y un adelanto de las
  primeras de cada una.
- **Categoría** (`/c/[slug]`): todas las herramientas de esa categoría, con
  filtros por nivel, precio y etiquetas.
- **Herramienta** (`/t/[slug]`): descripción, enlaces a la web y a la
  documentación, etiquetas y otras opciones de la misma categoría.
- **Buscar** (`/buscar`): búsqueda sobre todo el catálogo, sin acentos ni
  mayúsculas, combinable con los mismos filtros.

## Tecnologías

- **Next.js 16** (App Router) con **React 19**, en TypeScript.
- **Tailwind CSS 4** para los estilos, con un sistema de color propio en OKLCH y
  un tono distinto por categoría.
- **shadcn/ui** sobre **Base UI** para los componentes de interfaz.
- **lucide-react** para los iconos de la interfaz y **simple-icons** para los
  logos de las herramientas.
- **next-themes** para el cambio de tema (oscuro por defecto).
- **next/og** para generar las imágenes de Open Graph de cada página.
- **ESLint** y **Prettier** (con `prettier-plugin-tailwindcss`).

El contenido vive en `content/tools.json`; no hay base de datos ni API. Todas las
páginas se generan de forma estática en el build.

## Estructura

```
app/         rutas, metadatos, sitemap, robots e imágenes Open Graph
components/  componentes de la página y primitivas de UI en components/ui
content/     tools.json, la fuente de datos del catálogo
lib/         categorías, búsqueda, logos, tonos y tipos
```

## Empezar

```bash
npm install
npm run dev
```

Scripts disponibles: `dev`, `build`, `start`, `lint`, `format` y `typecheck`.

Para que los enlaces canónicos y las imágenes sociales apunten al dominio real,
define `NEXT_PUBLIC_SITE_URL`. En Vercel, si no la defines, se deduce del propio
despliegue.
