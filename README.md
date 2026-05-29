# Uni Route

Aplicación web para analizar traceroutes locales y globales con una interfaz moderna, mapas, gráficas de latencia y un parser más robusto que el proyecto Angular original.

## Stack

- Vite + React + TypeScript
- pnpm
- shadcn/ui
- mapcn + MapLibre
- Recharts
- Vitest

## Qué incluye esta modernización

- `Route Local` para pegar o cargar salidas de `tracert` y `traceroute`
- `Route Global` con catálogo curado de looking glasses por continente
- normalización tipada de hops, IPs, latencias y estados geo
- mapas y visualización de latencia desacoplados y cargados bajo demanda
- despliegue estático a GitHub Pages desde GitHub Actions
- preservación del proyecto anterior en `legacy/angular-route/`

## Requisitos

- Node.js 22+
- pnpm 10+

## Desarrollo local

```bash
pnpm install
pnpm dev
```

La aplicación quedará disponible en `http://localhost:5173/route/`.

## Scripts

```bash
pnpm dev
pnpm lint
pnpm test
pnpm test:coverage
pnpm build
pnpm preview
```

## Variables de entorno

Crea un `.env.local` opcional si quieres usar `ipgeolocation.io` como proveedor principal:

```bash
VITE_IPGEOLOCATION_API_KEY=tu_api_key
```

Si no se configura, la app usa `ipwho.is` como fallback público.

## Cómo usar la app

### Route Local

1. Ejecuta `tracert dominio.com` en Windows o `traceroute dominio.com` en Linux/macOS.
2. Copia la salida completa o carga un archivo `.txt`.
3. Elige el perfil correcto y analiza el resultado.

### Route Global

1. Abre una looking glass desde el continente que quieras estudiar.
2. Ejecuta traceroute contra tu destino.
3. Pega el resultado bruto en la app para normalizarlo y compararlo.

## Limitaciones conocidas

- El navegador no puede ejecutar traceroute nativo del sistema operativo del usuario.
- Por eso el flujo web actual usa copiar/pegar o archivo; un helper/CLI local quedaría como fase futura.
- Muchas looking glasses bloquean iframes por CSP o `X-Frame-Options`, así que el flujo principal abre herramientas en una nueva pestaña.
- La resolución geográfica depende de APIs públicas y su disponibilidad.

## Despliegue

El repositorio publica la SPA en GitHub Pages desde la rama `master` usando artifacts de GitHub Actions. La configuración de Vite ya usa la base correcta:

```ts
base: "/route/"
```

Para habilitar Pages en GitHub:

1. Activa **Settings → Pages → Build and deployment → GitHub Actions**.
2. Opcionalmente crea el secret `VITE_IPGEOLOCATION_API_KEY`.
3. Haz push a `master`.

## Estructura relevante

```text
legacy/angular-route/   # referencia histórica del proyecto Angular
src/lib/traceroute.ts   # dominio de parsing, geodatos y métricas
src/lib/global-tools.ts # catálogo de looking glasses
src/pages/              # Home, Local, Global y 404
src/components/         # layout, resultados, mapa y gráfica
```
