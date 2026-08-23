'use client'

import { useRef, useState, useCallback, DragEvent, ChangeEvent } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Upload03Icon, ArrowDown01Icon, Cancel01Icon, File01Icon } from '@hugeicons/core-free-icons'
import { cn } from '@/lib/utils/cn'
import { Surface } from '@/components/stepwise/primitives/surface'
import { Button } from '@/components/stepwise/button'
import { Modal } from '@/components/stepwise/modal'
import { Folder, type FolderFile } from '@/components/stepwise/folder'

export type FileEntry = {
  id    : string
  file  : File
  /** 0–100. Undefined = waiting. */
  progress?: number
  error?: string
}

export interface FileUploaderProps {
  /** 'dropzone' | 'compact'. Default 'dropzone'. */
  variant?  : 'dropzone' | 'compact'
  accept?   : string
  multiple? : boolean
  maxMB?    : number
  /** Called with accepted File objects. Caller owns progress tracking. */
  onFiles?  : (files: File[]) => void
  /** Controlled file list (with optional progress). */
  files?    : FileEntry[]
  onRemove? : (id: string) => void
  /** Dropzone variant only — the folder's body colour. Default the same
   *  amber swatch Folder's own docs page shows first. */
  color?    : string
  className?: string
}

function fmtSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function FileList({ files, onRemove }: { files: FileEntry[]; onRemove?: (id: string) => void }) {
  const reduce = useReducedMotion()
  if (!files.length) return null
  return (
    <ul className="flex flex-col gap-1.5 w-full">
      <AnimatePresence initial={false}>
        {files.map(f => (
          <motion.li
            key={f.id}
            initial={{ opacity: 0, y: reduce ? 0 : -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: reduce ? 0 : 6 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            <Surface
              radius={10}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2',
                'bg-zinc-50 dark:bg-zinc-800/60',
                'border border-zinc-200/80 dark:border-zinc-700/60',
              )}
            >
              <HugeiconsIcon icon={File01Icon} size={16} strokeWidth={1.8} className="shrink-0 text-zinc-400 dark:text-zinc-500" />
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium text-zinc-700 dark:text-zinc-300 truncate leading-tight">
                  {f.file.name}
                </p>
                <p className="text-[11px] text-zinc-400 dark:text-zinc-500 leading-tight">
                  {fmtSize(f.file.size)}
                  {f.error && <span className="ml-2 text-red-500">{f.error}</span>}
                </p>
                {f.progress !== undefined && f.progress < 100 && !f.error && (
                  <div className="mt-1 h-[2px] w-full rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
                    <motion.div
                      className="h-full bg-zinc-800 dark:bg-zinc-100 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${f.progress}%` }}
                      transition={{ duration: 0.3, ease: 'linear' }}
                    />
                  </div>
                )}
              </div>
              {onRemove && (
                <Button
                  variant="ghost" size="sm" iconOnly
                  aria-label={`Remove ${f.file.name}`}
                  icon={<HugeiconsIcon icon={Cancel01Icon} size={14} strokeWidth={1.8} />}
                  onClick={() => onRemove(f.id)}
                  className="shrink-0"
                />
              )}
            </Surface>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  )
}

export function FileUploader({
  variant  = 'dropzone',
  accept,
  multiple = true,
  maxMB,
  onFiles,
  files    = [],
  onRemove,
  color    = '#f5d98b',
  className,
}: FileUploaderProps) {
  const inputRef   = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const reduce = useReducedMotion()
  // The confirmation is a separate step from the click — the click just
  // names a candidate, nothing is removed until Modal's own onConfirm fires.
  const [pendingRemoveId, setPendingRemoveId] = useState<string | null>(null)

  const handleFiles = useCallback((raw: FileList | null) => {
    if (!raw) return
    const accepted: File[] = []
    for (const file of Array.from(raw)) {
      if (maxMB && file.size > maxMB * 1024 * 1024) continue
      accepted.push(file)
    }
    if (accepted.length) onFiles?.(accepted)
  }, [maxMB, onFiles])

  const onDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }, [handleFiles])

  const onDragOver = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setDragging(true) }
  const onDragLeave = () => setDragging(false)
  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => handleFiles(e.target.files)

  const open = () => inputRef.current?.click()

  const input = (
    <input
      ref={inputRef}
      type="file"
      accept={accept}
      multiple={multiple}
      className="sr-only"
      onChange={onInputChange}
    />
  )

  if (variant === 'dropzone') {
    const peek: FolderFile[] = files.map(f => ({ name: f.file.name, progress: f.progress }))
    const tracked = files.filter(f => f.progress !== undefined)
    const overall = tracked.length
      ? Math.round(tracked.reduce((s, f) => s + (f.progress ?? 0), 0) / tracked.length)
      : undefined
    const pendingFile = files.find(f => f.id === pendingRemoveId)

    return (
      <div className={cn('flex w-full flex-col items-center gap-4', className)}>
        {input}
        {/* One drop target, not two widgets glued together — the dashed box
            IS the folder's own hit area. Dragging anywhere in the box (not
            just the folder's own small footprint) tilts it open. Sized well
            down from the folder's own 260px default: the fanned-out cards'
            reach scales with the folder itself, and even at 190px the fan
            could clip the dropzone's own box at five cards. */}
        <motion.div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={open}
          animate={reduce ? undefined : (dragging ? { scale: 1.01 } : { scale: 1 })}
          transition={{ type: 'spring', stiffness: 600, damping: 30 }}
          className={cn(
            'flex w-full cursor-pointer select-none flex-col items-center justify-center',
            // Deliberately top-heavy padding: the fan lifts the cards well
            // above the folder's own box on hover, so the headroom the cards
            // need is not symmetric with the space below it.
            'rounded-[28px] border-2 border-dashed px-8 pb-10 pt-20',
            'transition-colors duration-150',
            dragging
              ? 'border-zinc-500 dark:border-zinc-400 bg-zinc-100/80 dark:bg-zinc-800/80'
              : 'border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/30 hover:border-zinc-300 dark:hover:border-zinc-600',
          )}
        >
          <Folder
            size={136}
            color={color}
            icon={Upload03Icon}
            files={peek}
            // No `files` means no items — a synthetic 3-skeleton peek (the
            // "nothing given yet" default meant for showcasing the component)
            // otherwise kicks in and makes an empty uploader look pre-filled.
            peek={0}
            open={dragging || undefined}
            progress={overall}
            showLabel={false}
            showCount={false}
            // the dropzone around it already owns the click (browse files) —
            // the folder must not also claim it as a fan toggle. It still
            // needs to be reachable by keyboard, though — `focusable` puts it
            // in the tab order and reveals the fan on focus without letting
            // a tap toggle it (that's what `toggleOnClick` is for).
            toggleOnClick={false}
            focusable
            onRemoveFile={index => {
              const f = files[index]
              if (f) setPendingRemoveId(f.id)
            }}
          />
          <p className="mt-4 text-center text-[13px] text-zinc-500 dark:text-zinc-400">
            {files.length
              ? <>{files.length} file{files.length > 1 ? 's' : ''} — hover to view, drag more, or{' '}</>
              : <>Drag &amp; drop files, or{' '}</>}
            <button
              type="button"
              onClick={e => { e.stopPropagation(); open() }}
              onPointerDown={e => e.stopPropagation()}
              className="font-medium text-zinc-700 underline underline-offset-2 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
            >
              Select
            </button>
          </p>
        </motion.div>

        <Modal
          open={!!pendingRemoveId}
          onClose={() => setPendingRemoveId(null)}
          title="Remove file?"
          description={pendingFile ? `"${pendingFile.file.name}" will be removed. This can't be undone.` : undefined}
          variant="destructive"
          confirmLabel="Remove"
          onConfirm={() => {
            if (pendingRemoveId) onRemove?.(pendingRemoveId)
            setPendingRemoveId(null)
          }}
        />
      </div>
    )
  }

  // compact
  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      className={cn('flex flex-col items-start gap-3', className)}
    >
      {input}
      {/* The real slideIcon button, not a lookalike — left-side icon tucked
          away until hover/touch reveals it. Button owns that reveal
          animation itself now that slideIcon works on either side; no
          custom wrapper needed here. Drag-over is a real state change, so it
          borrows the same ring cue the dropzone uses on its own box. */}
      <Button
        variant="solid"
        size="default"
        icon={<HugeiconsIcon icon={dragging ? ArrowDown01Icon : Upload03Icon} size={16} strokeWidth={1.8} />}
        iconPosition="left"
        slideIcon
        onClick={open}
        className={cn(
          'transition-shadow duration-150',
          dragging && 'ring-2 ring-zinc-400 ring-offset-2 ring-offset-white dark:ring-zinc-500 dark:ring-offset-zinc-950',
        )}
      >
        {dragging ? 'Drop it here' : files.length ? `${files.length} file${files.length > 1 ? 's' : ''}` : multiple ? 'Upload files' : 'Upload file'}
      </Button>
      <FileList files={files} onRemove={onRemove} />
    </div>
  )
}
