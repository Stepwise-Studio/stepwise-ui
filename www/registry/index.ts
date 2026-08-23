export interface RegistryFile {
  /** Path relative to www/ root — where the source lives */
  src: string
  /** Path relative to user's project root — where it gets written */
  dest: string
}

export interface RegistryComponent {
  name: string
  description: string
  category: 'foundations' | 'components' | 'primitives'
  /** npm packages the component requires at runtime */
  dependencies: string[]
  /** Other stepwise components this one depends on */
  registryDependencies: string[]
  files: RegistryFile[]
}

export const registry: RegistryComponent[] = [
  {
    name: 'typography',
    description: 'Consistent type scale with 20 semantic variants built on Inter Display.',
    category: 'foundations',
    dependencies: ['class-variance-authority', 'clsx', 'tailwind-merge'],
    registryDependencies: [],
    files: [
      { src: 'components/stepwise/typography.tsx', dest: 'components/stepwise/typography.tsx' },
      { src: 'lib/utils/cn.ts',                 dest: 'lib/utils/cn.ts' },
    ],
  },
  {
    name: 'test-button',
    description: 'Fully rounded pill with a subtle animated inner rainbow glow along the bottom edge.',
    category: 'components',
    dependencies: ['@lisse/react', 'clsx', 'tailwind-merge'],
    registryDependencies: [],
    files: [
      { src: 'components/stepwise/test-button.tsx', dest: 'components/stepwise/test-button.tsx' },
      { src: 'lib/utils/cn.ts',                   dest: 'lib/utils/cn.ts' },
    ],
  },
]
