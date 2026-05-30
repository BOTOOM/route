# Uni Route

Uni Route es una aplicación web educativa para aprender cómo viajan los paquetes por internet usando salidas reales de `tracert` y `traceroute`. Permite pegar resultados locales, comparar trazas desde herramientas públicas globales, ver saltos geográficos aproximados, revisar latencia por hop y reproducir la ruta en el mapa con una velocidad visual basada en la latencia.

Este repositorio es un **refactor completo** de la primera versión hecha en Angular. La aplicación activa ahora vive en `src/` y fue reconstruida como una SPA moderna con React, TypeScript y Vite para publicarse en GitHub Pages. La versión anterior se conserva solo como referencia histórica en `legacy/angular-route/`.

## Funcionalidades principales

- **Route Local:** copia un comando sugerido para Windows, Linux o macOS, ejecuta la traza en tu equipo y pega o carga la salida.
- **Route Global:** abre looking glasses públicas por continente, ejecuta traceroute desde otras regiones y compara los resultados.
- **Parser compartido:** normaliza salidas Windows y Unix-like para obtener destino, hops, IPs, muestras de latencia y advertencias.
- **Geolocalización responsable:** evita llamadas para IPs privadas, reservadas o no geolocalizables antes de consultar APIs externas.
- **Visualización educativa:** mapa, tabla, gráfica de latencia y reproducción animada de la ruta salto por salto.
- **Despliegue moderno:** GitHub Actions genera el build estático y lo publica en GitHub Pages desde `master`.

## Stack

- Vite + React + TypeScript
- pnpm
- shadcn/ui
- mapcn + MapLibre
- Recharts
- Zod
- Vitest + Testing Library
- GitHub Actions + GitHub Pages

## Requisitos

- Node.js 22+
- pnpm 10+

## Instalación y desarrollo

```bash
pnpm install
pnpm dev
```

La aplicación local queda disponible en `http://localhost:5173/route/`.

## Variables de entorno

Las variables son opcionales, pero recomendadas si quieres más cuota y estabilidad en geolocalización. Copia el ejemplo y completa los valores que vayas a usar:

```bash
cp .env.example .env.local
```

Variables disponibles:

| Variable | Uso | Dónde obtenerla |
| --- | --- | --- |
| `VITE_IPINFO_TOKEN` | Proveedor recomendado por su free tier amplio para consultas desde cliente. | Crea cuenta en <https://ipinfo.io/> y copia el token desde <https://ipinfo.io/account/token>. |
| `VITE_IPGEOLOCATION_API_KEY` | Proveedor secundario si prefieres ipgeolocation.io. | Crea cuenta en <https://ipgeolocation.io/> y copia la key desde <https://app.ipgeolocation.io/>. |

Orden de uso: IPinfo si `VITE_IPINFO_TOKEN` existe, luego ipgeolocation.io si `VITE_IPGEOLOCATION_API_KEY` existe, y finalmente `ipapi.co` sin API key como fallback compatible con navegador.

Antes de llamar a cualquier proveedor, Uni Route clasifica rangos privados, loopback, link-local, CGNAT, documentación, benchmarking, multicast y reservados para conservar la cuota de APIs.

## Scripts

```bash
pnpm dev
pnpm lint
pnpm test
pnpm test:coverage
pnpm build
pnpm preview
```

## Cómo usar Route Local

El navegador no puede ejecutar traceroute nativo por seguridad, así que Uni Route muestra el comando adecuado y un botón **Copiar**.

En Windows:

```powershell
tracert github.com
```

En Linux o macOS:

```bash
traceroute github.com
```

Después de ejecutar el comando, copia la salida completa, incluyendo encabezado, hops con `* * *` y líneas finales. Pega el texto en Route Local o carga un archivo `.txt`, selecciona el sistema operativo correcto y analiza la traza.

## Cómo usar Route Global

1. Entra a Route Global y elige un continente.
2. Abre una herramienta pública de looking glass.
3. Ejecuta traceroute contra el dominio o IP que quieras estudiar.
4. Copia el bloque de resultado y pégalo en Uni Route.
5. Revisa mapa, tabla, latencia y reproducción de la ruta.

Las herramientas externas se abren en una pestaña nueva porque muchos servicios públicos bloquean iframes mediante CSP o `X-Frame-Options`.

## Despliegue en GitHub Pages

La SPA se publica en `https://botoom.github.io/route/`. La base de Vite y el basename del router deben mantenerse alineados con `/route/`.

```ts
base: "/route/"
```

Para desplegar:

1. Configura **Settings → Pages → Build and deployment → GitHub Actions**.
2. Opcionalmente agrega los secrets `VITE_IPINFO_TOKEN` y `VITE_IPGEOLOCATION_API_KEY`.
3. Haz push a `master`; el workflow construye y publica el artifact de Pages.

## Estructura relevante

```text
src/                      # aplicación React activa
src/lib/traceroute.ts     # parsing, geolocalización, métricas y datos derivados
src/lib/global-tools.ts   # catálogo de looking glasses por continente
src/components/           # layout, resultados, mapa, gráfica y UI compartida
src/pages/                # páginas Home, Local, Global, Recursos y 404
legacy/angular-route/     # primera versión Angular conservada como referencia
.github/workflows/ci.yml  # lint, tests, build y despliegue a Pages
```

## Estado del refactor

La modernización reemplaza el frontend Angular por una arquitectura React estática, conserva el objetivo educativo original y mejora la experiencia con diseño responsive, parser tipado, visualizaciones, animaciones y despliegue continuo. El código Angular legacy no es la fuente de verdad para nuevas funcionalidades.

## Créditos legacy

La primera versión legacy del proyecto fue creada por los estudiantes:

- Edwar Diaz Ruiz
- Daissi Bibiana Gonzalez Roldan
