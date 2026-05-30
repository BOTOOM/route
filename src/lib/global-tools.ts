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
}

export const CONTINENTS: {
  key: ContinentKey
}[] = [
  { key: "america" },
  { key: "europa" },
  { key: "asia" },
  { key: "oceania" },
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
  },
  {
    id: "lumen-america",
    continent: "america",
    name: "Lumen Looking Glass",
    provider: "Lumen",
    url: "https://lookingglass.lumen.com/",
    sourceProfile: "america",
    status: "backup",
  },
  {
    id: "switch-europe",
    continent: "europa",
    name: "SWITCH Traceroute",
    provider: "SWITCH",
    url: "https://network.switch.ch/pub/tools/traceroute/",
    sourceProfile: "linux",
    status: "recommended",
  },
  {
    id: "cogent-europe",
    continent: "europa",
    name: "Cogent Looking Glass",
    provider: "Cogent",
    url: "https://www.cogentco.com/en/looking-glass",
    sourceProfile: "europa",
    status: "backup",
  },
  {
    id: "backwaves-asia",
    continent: "asia",
    name: "BackWaves Looking Glass",
    provider: "BackWaves",
    url: "https://backwaves.net/tools/lookingglass/",
    sourceProfile: "asia",
    status: "recommended",
  },
  {
    id: "ilan-asia",
    continent: "asia",
    name: "ILAN Looking Glass",
    provider: "ILAN / IUCC",
    url: "https://lg.iucc.ac.il/",
    sourceProfile: "linux",
    status: "backup",
  },
  {
    id: "telstra-oceania",
    continent: "oceania",
    name: "Telstra Looking Glass",
    provider: "Telstra",
    url: "https://lg.tools.telstra.net/",
    sourceProfile: "oceania",
    status: "recommended",
  },
  {
    id: "globalping-directory",
    continent: "oceania",
    name: "Globalping Looking Glass",
    provider: "Globalping",
    url: "https://globalping.io/tools/looking-glass",
    sourceProfile: "linux",
    status: "directory",
  },
]

export function getToolsByContinent(continent: ContinentKey) {
  return LOOKING_GLASS_TOOLS.filter((tool) => tool.continent === continent)
}
