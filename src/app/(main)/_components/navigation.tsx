import { ElementRef, MouseEvent, useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  ChevronsLeft,
  Menu,
  Plus,
  PlusCircle,
  Search,
  Settings,
  Trash,
} from 'lucide-react'
import { useMediaQuery } from 'usehooks-ts'
import { useMutation } from 'convex/react'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'
import { api } from '@/convex/_generated/api'
import { FEEDBACK_MESSAGES } from '@/constants/messages'
import { DEFAULT_STRINGS } from '@/constants/general'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import { useSearch } from '@/hooks/use-search'
import { useSettings } from '@/hooks/use-settings'

import { DocumentList } from './document-list'
import { UserItem } from './user-item'
import { Item } from './item'
import { TrashBox } from './trash-box'

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const search = useSearch()
  const settings = useSettings()
  const isMobile = useMediaQuery('(max-width: 768px)')
  const isMobileSmall = useMediaQuery('(max-width: 360px)')
  const create = useMutation(api.documents.create)

  const isResizingRef = useRef(false)
  const sidebarRef = useRef<ElementRef<'aside'>>(null)
  const navbarRef = useRef<ElementRef<'div'>>(null)

  const [isResetting, setIsResetting] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(isMobile)
  const [isScrolling, setIsScrolling] = useState(false)

  useEffect(() => {
    if (isMobile) {
      collapse()
    } else {
      resetWidth()
    }
  }, [isMobile])

  useEffect(() => {
    if (isMobile) {
      collapse()
    }
  }, [pathname, isMobile])

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

      sidebarRef.current.style.width = isMobile ? '90%' : '15rem'
      navbarRef.current.style.setProperty(
        'width',
        isMobile ? '0' : 'calc(100% - 240px)',
      )
      navbarRef.current.style.setProperty('left', isMobile ? '90%' : '15rem')
      setTimeout(() => setIsResetting(false), 300)
    }
  }

  const collapse = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true)
      setIsResetting(true)

      sidebarRef.current.style.width = '0'
      navbarRef.current.style.setProperty('width', '90%')
      navbarRef.current.style.setProperty('left', '0')
      setTimeout(() => setIsResetting(false), 300)
    }
  }

  function onScrolling(e: any) {
    if (e.target.scrollTop > 10) {
      setIsScrolling(true)
    } else {
      setIsScrolling(false)
    }
  }

  function handleCreate() {
    const promise = create({ title: DEFAULT_STRINGS.UNTITLED })
    // const promise = create({ title: DEFAULT_STRINGS.UNTITLED }).then(
    //   (documentId) => router.push(`/documents/${documentId}`),
    // )

    toast.promise(promise, {
      loading: FEEDBACK_MESSAGES.ON_NEWPAGE_LOADING,
      success: FEEDBACK_MESSAGES.ON_NEWPAGE_SUCCESS,
      error: FEEDBACK_MESSAGES.ON_NEWPAGE_ERROR,
    })
  }

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          `group/sidebar relative z-[99999] flex h-full w-60 flex-col
          overflow-y-hidden bg-secondary`,
          isResetting && 'transition-all duration-300 ease-in-out',
          isMobile && 'w-0',
        )}
      >
        <div
          role="button"
          onClick={collapse}
          className={cn(
            `group absolute right-2 top-3 h-6 w-6 rounded-sm text-muted-foreground
            opacity-0 transition hover:bg-neutral-300 group-hover/sidebar:opacity-100
          dark:hover:bg-neutral-600`,
            isMobile && 'opacity-100',
          )}
        >
          <ChevronsLeft className="h-6 w-6 text-indigo-600/40 transition-transform group-hover:animate-wiggle dark:text-indigo-300" />
        </div>

        <div className="flex flex-col gap-y-2">
          <UserItem />
          <Item
            onClick={search.onOpen}
            label="Pesquisar"
            icon={Search}
            isSearch
          />
          <Item
            onClick={settings.onOpen}
            label="Configurações"
            icon={Settings}
          />
          <Item
            onClick={handleCreate}
            label="Nova página"
            icon={PlusCircle}
            isNewPage
          />
        </div>

        <div
          onScroll={onScrolling}
          className={cn(
            `scrollbar-hide mt-4 max-h-[35rem] overflow-y-auto
            md:max-h-[45rem] lg:max-h-[30rem] xl:max-h-[35rem] 2xl:max-h-[50rem]`,
            isMobileSmall && 'max-h-[26rem]',
            isScrolling && 'border-t shadow-sm transition duration-150 ease-in',
          )}
        >
          <DocumentList />
          <Item
            onClick={handleCreate}
            label="Adicionar uma página"
            icon={Plus}
          />
          <Popover>
            <PopoverTrigger className="mt-4 w-full">
              <Item label="Lixeira" icon={Trash} />
            </PopoverTrigger>
            <PopoverContent
              side={isMobile ? 'bottom' : 'right'}
              sideOffset={0}
              className="w-72 p-0"
            >
              <TrashBox />
            </PopoverContent>
          </Popover>
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
            <Menu
              onClick={resetWidth}
              role="button"
              className="h-6 w-6 text-muted-foreground"
            />
          )}
        </nav>
      </div>
    </>
  )
}
