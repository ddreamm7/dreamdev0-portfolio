import type { SkillCategory } from '@/types'

export interface SkillItem {
  name: string
  url: string
}

export const skillCategories: readonly { id: SkillCategory; items: readonly SkillItem[] }[] = [
  {
    id: 'engines',
    items: [
      { name: 'Unity', url: 'https://unity.com' },
      { name: 'Unreal Engine', url: 'https://www.unrealengine.com' },
    ],
  },
  {
    id: 'languages',
    items: [
      { name: 'Python', url: 'https://www.python.org' },
      { name: 'C#', url: 'https://learn.microsoft.com/en-us/dotnet/csharp/' },
      { name: 'JavaScript', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
      { name: 'TypeScript', url: 'https://www.typescriptlang.org' },
    ],
  },
  {
    id: 'frontend',
    items: [
      { name: 'Vue', url: 'https://vuejs.org' },
      { name: 'Nuxt', url: 'https://nuxt.com' },
      { name: 'Astro', url: 'https://astro.build' },
      { name: 'TailwindCSS', url: 'https://tailwindcss.com' },
      { name: 'GSAP', url: 'https://gsap.com' },
    ],
  },
  {
    id: 'design',
    items: [
      { name: 'Affinity', url: 'https://affinity.serif.com' },
      { name: 'Figma', url: 'https://www.figma.com' },
      { name: 'Premiere', url: 'https://www.adobe.com/products/premiere.html' },
    ],
  },
  {
    id: 'tools',
    items: [
      { name: 'Git', url: 'https://git-scm.com' },
      { name: 'GitHub', url: 'https://github.com' },
      { name: 'Vercel', url: 'https://vercel.com' },
      { name: 'JetBrains', url: 'https://www.jetbrains.com' },
    ],
  },
] as const
