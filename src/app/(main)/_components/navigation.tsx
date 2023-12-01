import { ElementRef, MouseEvent, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { ChevronsLeft, Menu } from 'lucide-react'
import { useMediaQuery } from 'usehooks-ts'
// import { useMutation } from 'convex/react'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'
import { api } from '@/convex/_generated/api'

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const isMobile = useMediaQuery('(max-width: 768px)')
  // const create = useMutation(api.documents.create)

  const isResizingRef = useRef(false)
  const sidebarRef = useRef<ElementRef<'aside'>>(null)
  const navbarRef = useRef<ElementRef<'div'>>(null)

  const [isResetting, setIsResetting] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(isMobile)

  const handleMouseDown = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    isResizingRef.current = true
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleMouseMove = (event: MouseEvent | any) => {
    if (!isResizingRef.current) return
    let newWidth = event.clientX

    if (newWidth < 240) newWidth = 240
    if (newWidth > 480) newWidth = 480

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`
      navbarRef.current.style.setProperty('left', `${newWidth}px`)
      navbarRef.current.style.setProperty('width', `calc(100% - ${newWidth}px)`)
    }
  }

  const handleMouseUp = () => {
    isResizingRef.current = false
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  const resetWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false)
      setIsResetting(true)

      sidebarRef.current.style.width = isMobile ? '100%' : '15rem'
      navbarRef.current.style.setProperty(
        'width',
        isMobile ? '0' : 'calc(100% - 240px)',
      )
      navbarRef.current.style.setProperty('left', isMobile ? '100%' : '15rem')
      setTimeout(() => setIsResetting(false), 300)
    }
  }

  const collapse = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true)
      setIsResetting(true)

      sidebarRef.current.style.width = '0'
      navbarRef.current.style.setProperty('width', '100%')
      navbarRef.current.style.setProperty('left', '0')
      setTimeout(() => setIsResetting(false), 300)
    }
  }

  const handleCreate = () => {
    // const promise = create({ title: 'Untitled' }).then((documentId) =>
    //   router.push(`/documents/${documentId}`),
    // )
    // toast.promise(promise, {
    //   loading: 'Criando uma nova nota...',
    //   success: 'Nova nota criada!',
    //   error: 'Falha ao criar uma nova nota.',
    // })
  }

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          `group/sidebar relative z-[99999] flex h-full w-60
          flex-col overflow-y-auto bg-secondary`,
          isResetting && 'transition-all duration-300 ease-in-out',
          isMobile && 'w-0',
        )}
      >
        <div
          role="button"
          onClick={collapse}
          className={cn(
            `absolute right-2 top-3 h-6 w-6 rounded-sm text-muted-foreground
            opacity-0 transition hover:bg-neutral-300 group-hover/sidebar:opacity-100
          dark:hover:bg-neutral-600`,
            isMobile && 'opacity-100',
          )}
        >
          <ChevronsLeft className="h-6 w-6 text-indigo-600/40" />
        </div>

        <div>
          <p>Action items</p>
        </div>

        <div className="mt-4">
          <p>Documents</p>
        </div>

        <div
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
          className="absolute right-0 top-0 h-full w-1 cursor-ew-resize
          bg-primary/10 opacity-0 transition group-hover/sidebar:opacity-100"
        />
      </aside>

      <div
        ref={navbarRef}
        className={cn(
          `absolute left-60 top-0 z-[99999] w-[calc(100%-15rem)]`,
          isResetting && 'transition-all duration-300 ease-in-out',
          isMobile && 'left-0 w-full',
        )}
      >
        <nav className="w-full bg-transparent px-3 py-2">
          {isCollapsed && (
            <Menu role="button" className="h-6 w-6 text-muted-foreground" />
          )}
        </nav>
      </div>
    </>
  )
}
