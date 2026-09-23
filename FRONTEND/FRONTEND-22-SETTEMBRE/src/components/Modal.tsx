import { useEffect, useId, useRef, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'

export function Modal({ title, children, onClose, drawer = false }: { title: string; children: ReactNode; onClose: () => void; drawer?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  useEffect(() => {
    const dialog = ref.current!
    const previous = document.activeElement as HTMLElement | null
    dialog.showModal()
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { dialog.close(); document.body.style.overflow = overflow; previous?.focus() }
  }, [])
  return <dialog ref={ref} className={`modal ${drawer ? 'drawer' : ''}`} aria-labelledby={titleId}
    onCancel={(event) => { event.preventDefault(); onClose() }}
    onClick={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <motion.div initial={{ opacity: 0, y: drawer ? 0 : 16, x: drawer ? 24 : 0 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: .22 }} className="modal-content">
      <div className="modal-header"><h2 id={titleId}>{title}</h2><button className="icon-button" aria-label="Chiudi" onClick={onClose}><X size={20} /></button></div>
      {children}
    </motion.div>
  </dialog>
}
