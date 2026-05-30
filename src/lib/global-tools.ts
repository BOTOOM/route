import type { TraceSource } from "@/lib/traceroute"

export type ContinentKey = "america" | "europa" | "asia" | "oceania"

export type LookingGlassTool = {
  id: string
  continent: ContinentKey
  name: string
  provider: string
  url: string
  sourceProfile: TraceSource
  status: "recommended" | "backup" | "directory"
  notes: string
  instructions: string[]
}

export const CONTINENTS: {
  key: ContinentKey
  label: string
  summary: string
}[] = [
  {
    key: "america",
    label: "América",
    summary: "Compara cómo se ve la ruta desde redes troncales y carriers de Norteamérica.",
  },
  {
    key: "europa",
    label: "Europa",
    summary: "Útil para contrastar latencia transatlántica y cambios de AS en redes europeas.",
  },
  {
    key: "asia",
    label: "Asia",
    summary: "Sirve para observar desvíos, tránsitos largos y variaciones de salida hacia APAC.",
  },
  {
    key: "oceania",
    label: "Oceanía",
    summary: "Ayuda a estudiar rutas largas y diferencias hacia Australia/Nueva Zelanda.",
  },
]

export const LOOKING_GLASS_TOOLS: LookingGlassTool[] = [
  {
    id: "he-america",
    continent: "america",
    name: "Hurricane Electric Super Looking Glass",
    provider: "Hurricane Electric",
    url: "https://bgp.he.net/super-lg/",
    sourceProfile: "linux",
    status: "recommended",
    notes:
      "Gran cobertura global y buena opción para estudiantes por la visibilidad de múltiples POPs.",
    instructions: [
      "Abre la herramienta en una nueva pestaña.",
      "Selecciona un POP en América y ejecuta traceroute al destino.",
      "Copia el bloque de texto del resultado y pégalo abajo.",
    ],
  },
  {
    id: "lumen-america",
    continent: "america",
    name: "Lumen Looking Glass",
    provider: "Lumen",
    url: "https://lookingglass.lumen.com/",
    sourceProfile: "america",
    status: "backup",
    notes:
      "Buen complemento para contrastar con otra red troncal grande de América del Norte.",
    instructions: [
      "Ingresa el host o IP destino en la interfaz de Lumen.",
      "Ejecuta traceroute desde un nodo de América.",
      "Pega el resultado textual en este panel.",
    ],
  },
  {
    id: "switch-europe",
    continent: "europa",
    name: "SWITCH Traceroute",
    provider: "SWITCH",
    url: "https://network.switch.ch/pub/tools/traceroute/",
    sourceProfile: "linux",
    status: "recommended",
    notes:
      "Ideal para escenarios académicos y comparaciones con tráfico europeo.",
    instructions: [
      "Selecciona el nodo europeo que más te interese.",
      "Ejecuta traceroute y copia la salida generada.",
      "Si Uni Route no interpreta bien el texto, prueba el formato Linux/macOS.",
    ],
  },
  {
    id: "cogent-europe",
    continent: "europa",
    name: "Cogent Looking Glass",
    provider: "Cogent",
    url: "https://www.cogentco.com/en/looking-glass",
    sourceProfile: "europa",
    status: "backup",
    notes: "Útil para comparar rutas en una red backbone diferente dentro de Europa.",
    instructions: [
      "Abre el portal de Cogent y elige un origen europeo.",
      "Corre traceroute contra tu destino de prueba.",
      "Pega el texto bruto aquí para analizarlo.",
    ],
  },
  {
    id: "backwaves-asia",
    continent: "asia",
    name: "BackWaves Looking Glass",
    provider: "BackWaves",
    url: "https://backwaves.net/tools/lookingglass/",
    sourceProfile: "asia",
    status: "recommended",
    notes:
      "Permite probar desde POPs en Asia y también sirve como respaldo multi-región.",
    instructions: [
      "Elige un POP asiático desde la interfaz.",
      "Ejecuta traceroute al host o IP que quieras estudiar.",
      "Copia la salida y úsala en este panel.",
    ],
  },
  {
    id: "ilan-asia",
    continent: "asia",
    name: "ILAN Looking Glass",
    provider: "ILAN / IUCC",
    url: "https://lg.iucc.ac.il/",
    sourceProfile: "linux",
    status: "backup",
    notes:
      "Complementa bien los resultados de Asia cuando quieres otro operador o punto de vista.",
    instructions: [
      "Abre la herramienta y lanza traceroute desde un nodo de la región.",
      "Usa el formato Linux/macOS si la salida se parece a traceroute clásico.",
      "Pega el resultado textual para visualizar los saltos.",
    ],
  },
  {
    id: "telstra-oceania",
    continent: "oceania",
    name: "Telstra Looking Glass",
    provider: "Telstra",
    url: "https://lg.tools.telstra.net/",
    sourceProfile: "oceania",
    status: "recommended",
    notes: "Muy útil para observar la ruta desde Australia y contrastar cambios en APAC.",
    instructions: [
      "Selecciona traceroute dentro del panel de Telstra.",
      "Lanza el diagnóstico hacia el destino que quieras medir.",
      "Copia el bloque de resultado y analízalo aquí.",
    ],
  },
  {
    id: "globalping-directory",
    continent: "oceania",
    name: "Globalping Looking Glass",
    provider: "Globalping",
    url: "https://globalping.io/tools/looking-glass",
    sourceProfile: "linux",
    status: "directory",
    notes:
      "Directorio multi-región con agentes distribuidos; también sirve como respaldo para cualquier continente.",
    instructions: [
      "Elige la región o país de interés dentro de Globalping.",
      "Ejecuta traceroute con el destino deseado.",
      "Pega el texto si el formato resultante se parece a traceroute clásico.",
    ],
  },
]

export function getToolsByContinent(continent: ContinentKey) {
  return LOOKING_GLASS_TOOLS.filter((tool) => tool.continent === continent)
}
