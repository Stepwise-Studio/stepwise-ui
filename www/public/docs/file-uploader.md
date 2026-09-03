# File Uploader

A file picker with drag-and-drop, in a dropzone variant and a compact one.

## Install

```bash
npx stepwise-ui add file-uploader
```

Exports: `FileUploader`

## Usage

```tsx
import { FileUploader, type FileEntry } from '@/components/stepwise/file-uploader'

const [files, setFiles] = useState<FileEntry[]>([])

const onFiles = (incoming: File[]) => {
  setFiles(prev => [
    ...prev,
    ...incoming.map(f => ({ id: crypto.randomUUID(), file: f })),
  ])
}

// default variant - a real Folder as the drop target. Drag files onto it
// or click "Select" to browse; it tilts open on hover and shows progress
// both on the pocket and on each file's own card as it peeks out. Hovering
// a card shows its name - click the × on one to remove it (confirmed via
// the Modal component before it's actually gone).
<FileUploader
  files={files}
  onFiles={onFiles}
  onRemove={id => setFiles(prev => prev.filter(f => f.id !== id))}
  maxMB={10}
/>
```

## What gets written

- `components/stepwise/file-uploader.tsx`
- `components/stepwise/primitives/surface.tsx`
- `lib/utils/cn.ts`

Also installs: [button](https://ui.stepwise.studio/docs/button.md), [folder](https://ui.stepwise.studio/docs/folder.md), [modal](https://ui.stepwise.studio/docs/modal.md)

npm packages: `@hugeicons/core-free-icons`, `@hugeicons/react`, `@lisse/react`, `clsx`, `motion`, `tailwind-merge`

## Setup this needs

React 19, Tailwind CSS v4, an `@/*` path alias to the project root, and a
class-based dark variant in the global stylesheet:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

Full page: https://ui.stepwise.studio/docs/file-uploader
Whole library as text: https://ui.stepwise.studio/llms.txt
