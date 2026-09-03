const REGISTRY_BASE =
  process.env.STEPWISE_REGISTRY_URL ?? 'https://ui.stepwise.studio/r'

export interface RegistryFile {
  path: string
  /** Source text. Absent for binary assets, which carry `url` instead. */
  content?: string
  /** Site-relative path to a binary asset (fonts, images) to fetch verbatim. */
  url?: string
}

export interface ComponentManifest {
  name: string
  description: string
  category: string
  dependencies: string[]
  /** Frameworks the host app must provide. Warned about, never installed. */
  peerDependencies?: string[]
  registryDependencies: string[]
  files: RegistryFile[]
}

/**
 * `fetch` throws a bare "fetch failed" when the host is unreachable, which
 * tells the user nothing about which host or why. Name the registry so an
 * offline machine, a proxy, or a site outage is distinguishable from a
 * component that simply does not exist.
 */
async function getJson(url: string, notFound: string): Promise<unknown> {
  let res: Response
  try {
    res = await fetch(url)
  } catch {
    throw new Error(
      `Could not reach the registry at ${REGISTRY_BASE}\n` +
      `    Check your connection, or set STEPWISE_REGISTRY_URL to another host.`,
    )
  }
  if (res.status === 404) throw new Error(notFound)
  if (!res.ok) throw new Error(`Registry request failed: ${res.status} ${res.statusText}`)
  try {
    return await res.json()
  } catch {
    throw new Error(`Registry returned invalid JSON from ${url}`)
  }
}

export async function fetchComponent(name: string): Promise<ComponentManifest> {
  return (await getJson(
    `${REGISTRY_BASE}/${name}.json`,
    `Component "${name}" not found in the registry.`,
  )) as ComponentManifest
}

export async function fetchIndex(): Promise<Array<{ name: string; description: string; category: string }>> {
  return (await getJson(
    `${REGISTRY_BASE}/index.json`,
    'Registry index not found - is STEPWISE_REGISTRY_URL pointing at the right host?',
  )) as Array<{ name: string; description: string; category: string }>
}

/**
 * Fetch a binary asset (a font, an image) as raw bytes.
 *
 * These are not embedded in the manifest the way source files are: reading a
 * .woff2 as text corrupts it, and base64 would add hundreds of KB to a manifest
 * every consumer downloads. The manifest carries a site-relative URL and the
 * bytes are pulled from the same origin the registry is served from.
 */
export async function fetchAsset(url: string): Promise<Buffer> {
  const origin = REGISTRY_BASE.replace(/\/r\/?$/, '')
  const res = await fetch(`${origin}${url}`)
  if (!res.ok) {
    throw new Error(`Could not download ${url} (${res.status} ${res.statusText})`)
  }
  return Buffer.from(await res.arrayBuffer())
}
