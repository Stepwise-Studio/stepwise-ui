'use client'

import { useState, useCallback, DragEvent } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { FileUploader, type FileEntry } from '@/components/stepwise/file-uploader'
import { SkeletonCard } from '@/components/stepwise/folder'

function useFiles() {
  const [files, setFiles] = useState<FileEntry[]>([])
  const onFiles = useCallback((incoming: File[]) => {
    const next: FileEntry[] = incoming.map(f => ({ id: crypto.randomUUID(), file: f }))
    setFiles(prev => [...prev, ...next])
    // Simulate progress
    next.forEach(entry => {
      let pct = 0
      const tick = setInterval(() => {
        pct += Math.random() * 25
        if (pct >= 100) { pct = 100; clearInterval(tick) }
        setFiles(prev => prev.map(f => f.id === entry.id ? { ...f, progress: Math.min(100, pct) } : f))
      }, 220)
    })
  }, [])
  const onRemove = useCallback((id: string) => setFiles(prev => prev.filter(f => f.id !== id)), [])
  return { files, onFiles, onRemove }
}

/* ── draggable demo chips - real HTML5 drag-and-drop onto the dropzone
   below, so the upload + progress animation is something to actually try,
   not just imagine from a code sample. They render the folder's own
   SkeletonCard at file-card proportions, so what you pick up is visibly the
   same object that lands in the fan - and each sits at a slight rest tilt
   that straightens as you hover it, marking it as something to grab. ───── */
const DEMO_MIME = 'application/x-stepwise-demo-file'
const DEMO_FILES = [
  { name: 'Roadmap.pdf', type: 'application/pdf' },
  { name: 'Brand-assets.zip', type: 'application/zip' },
  { name: 'Meeting-notes.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
]

function DemoFileChip({ name, type, tilt }: { name: string; type: string; tilt: number }) {
  const reduce = useReducedMotion()
  return (
    // `draggable` lives on a plain wrapper: motion.div's own onDragStart is
    // typed for its gesture system, not the native HTML5 drag event we need
    // the dataTransfer payload from. dragstart bubbles, so the handler still
    // fires from the animated card inside.
    <div
      draggable
      onDragStart={e => {
        e.dataTransfer.setData(DEMO_MIME, JSON.stringify({ name, type }))
        e.dataTransfer.effectAllowed = 'copy'
      }}
    >
    <motion.div
      initial={false}
      whileHover={reduce ? undefined : { y: -6, rotate: 0, scale: 1.04 }}
      whileTap={reduce ? undefined : { scale: 0.97 }}
      animate={{ rotate: reduce ? 0 : tilt }}
      transition={{ type: 'spring', stiffness: 420, damping: 28 }}
      className="flex cursor-grab flex-col items-center gap-2 active:cursor-grabbing"
    >
      <div
        className="overflow-hidden rounded-[7px] shadow-[0_4px_14px_rgba(0,0,0,0.14)] ring-1 ring-black/5 dark:ring-white/10"
        style={{ width: 46, height: 58 }}
      >
        <SkeletonCard />
      </div>
      <span className="max-w-[74px] truncate text-[10px] font-medium text-zinc-500 dark:text-zinc-400">{name}</span>
    </motion.div>
    </div>
  )
}

export function FileUploaderDropzonePreview() {
  const { files, onFiles, onRemove } = useFiles()

  const onDemoDrop = (e: DragEvent<HTMLDivElement>) => {
    const raw = e.dataTransfer.getData(DEMO_MIME)
    if (!raw) return
    e.preventDefault()
    const { name, type } = JSON.parse(raw) as { name: string; type: string }
    onFiles([new File([`Pretend contents of ${name}`], name, { type })])
  }

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="flex flex-col items-center gap-2.5">
        <p className="text-[12px] text-zinc-400 dark:text-zinc-500">Drag one onto the folder</p>
        <div className="flex flex-wrap items-start justify-center gap-4">
          {DEMO_FILES.map((f, i) => <DemoFileChip key={f.name} {...f} tilt={[-5, 2, 6][i] ?? 0} />)}
        </div>
      </div>
      <div onDrop={onDemoDrop} onDragOver={e => e.preventDefault()} className="w-full">
        <FileUploader files={files} onFiles={onFiles} onRemove={onRemove} maxMB={10} />
      </div>
    </div>
  )
}

export function FileUploaderCompactPreview() {
  const { files, onFiles, onRemove } = useFiles()
  return <FileUploader variant="compact" files={files} onFiles={onFiles} onRemove={onRemove} />
}
