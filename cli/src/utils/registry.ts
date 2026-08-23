const REGISTRY_BASE =
  process.env.STEPWISE_REGISTRY_URL ?? 'https://ui.stepwise.studio/r'

export interface RegistryFile {
  path: string
  content: string
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

export async function fetchComponent(name: string): Promise<ComponentManifest> {
  const url = `${REGISTRY_BASE}/${name}.json`
  const res = await fetch(url)
  if (!res.ok) {
    if (res.status === 404) throw new Error(`Component "${name}" not found in the registry.`)
    throw new Error(`Registry request failed: ${res.status} ${res.statusText}`)
  }
  return res.json() as Promise<ComponentManifest>
}

export async function fetchIndex(): Promise<Array<{ name: string; description: string; category: string }>> {
  const url = `${REGISTRY_BASE}/index.json`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch registry index: ${res.status}`)
  return res.json() as Promise<Array<{ name: string; description: string; category: string }>>
}
