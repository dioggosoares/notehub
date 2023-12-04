'use client'

import {
  ChevronRight,
  LucideIcon,
  MoreHorizontal,
  Plus,
  Trash,
} from 'lucide-react'
import { ComponentProps, MouseEvent } from 'react'
import { useUser } from '@clerk/clerk-react'
import { useRouter } from 'next/navigation'
import { useMutation } from 'convex/react'
import { toast } from 'sonner'

import { Id } from '@/convex/_generated/dataModel'
import { api } from '@/convex/_generated/api'

import { FEEDBACK_MESSAGES } from '@/constants/messages'

import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { DEFAULT_STRINGS } from '@/constants/general'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

interface ItemsProps extends ComponentProps<'div'> {
  id?: Id<'documents'>
  documentIcon?: string
  active?: boolean
  expanded?: boolean
  isSearch?: boolean
  isNewPage?: boolean
  level?: number
  onExpand?: () => void
  label: string
  icon: LucideIcon
  onClick?: () => void
}

export function Item({
  id,
  active,
  documentIcon,
  isSearch,
  isNewPage,
  level = 0,
  onExpand,
  expanded,
  icon: Icon,
  label,
  onClick,
}: ItemsProps) {
  const { user } = useUser()
  const router = useRouter()

  const create = useMutation(api.documents.create)
  const archive = useMutation(api.documents.archive)
  const restore = useMutation(api.documents.restore)

  function onRestore(documentId: Id<'documents'>) {
    const promise = restore({ id: documentId })

    toast.promise(promise, {
      loading: FEEDBACK_MESSAGES.ON_RESTORE_PAGE_LOADING,
      success: FEEDBACK_MESSAGES.ON_RESTORE_PAGE_SUCCESS,
      error: FEEDBACK_MESSAGES.ON_RESTORE_PAGE_ERROR,
    })
  }

  const onArchive = (event: MouseEvent) => {
    event.stopPropagation()
    if (!id) return
    const promise = archive({ id }).then(() => router.push(`/documents`))

    toast.promise(promise, {
      loading: FEEDBACK_MESSAGES.ON_DELETE_PAGE_LOADING,
      success: FEEDBACK_MESSAGES.ON_DELETE_PAGE_SUCCESS,
      error: FEEDBACK_MESSAGES.ON_DELETE_PAGE_ERROR,
      action: {
        label: 'Desfazer',
        onClick: () => onRestore(id),
      },
    })
  }

  function handleExpand(event: MouseEvent) {
    event.stopPropagation()
    onExpand?.()
  }

  function onCreate(event: MouseEvent) {
    event.stopPropagation()
    if (!id) return
    const promise = create({
      title: DEFAULT_STRINGS.UNTITLED,
      parentDocument: id,
    }).then((documentId: Id<'documents'>) => {
      if (!expanded) {
        onExpand?.()
      }
      router.push(`/documents/${documentId}`)
    })

    toast.promise(promise, {
      loading: FEEDBACK_MESSAGES.ON_NEWPAGE_LOADING,
      success: FEEDBACK_MESSAGES.ON_NEWPAGE_SUCCESS,
      error: FEEDBACK_MESSAGES.ON_NEWPAGE_ERROR,
    })
  }

  return (
    <div
      onClick={onClick}
      role="button"
      style={{ paddingLeft: level ? `${level * 12 + 12}px` : '.75rem' }}
      className={cn(
        `group flex min-h-[1.6875rem] w-full items-center py-1 pr-3
        text-sm font-medium text-muted-foreground hover:bg-primary/5`,
        active && 'bg-primary/5 text-primary',
      )}
    >
      {!!id && (
        <div
          role="button"
          onClick={handleExpand}
          className="group rounded-sm p-1"
        >
          <div
            className="mr-1 h-full rounded-sm hover:bg-neutral-300
          dark:hover:bg-neutral-600"
          >
            <ChevronRight
              className={cn(
                `h-4 w-4 shrink-0 text-muted-foreground/50 transition duration-300
                ease-in-out`,
                expanded ? 'rotate-90' : 'rotate-0',
              )}
            />
          </div>
        </div>
      )}
      {documentIcon ? (
        <div className="mr-2 h-[1.125rem] shrink-0 text-muted-foreground">
          {documentIcon}
        </div>
      ) : (
        <Icon
          className={cn(
            `mr-2 h-[1.125rem] w-[1.125rem] shrink-0`,
            isNewPage && !isSearch
              ? 'text-neutral-50'
              : 'text-muted-foreground',
          )}
          fill={isNewPage && !isSearch ? '#a3a3a3' : 'transparent'}
        />
      )}
      <span className="truncate">{label}</span>
      {isSearch && (
        <kbd
          className="pointer-events-none ml-auto inline-flex h-5 select-none
          items-center gap-1 rounded border bg-muted px-1.5 pt-[.1875rem]
          font-mono text-[.625rem] font-medium text-muted-foreground opacity-100"
        >
          <span className="text-xs">⌘</span>K
        </kbd>
      )}
      {!!id && (
        <div className="ml-auto flex items-center gap-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} asChild>
              <div
                role="button"
                className="ml-auto h-full rounded-sm opacity-0 hover:bg-neutral-300
                group-hover:opacity-100 dark:hover:bg-neutral-600"
              >
                <MoreHorizontal className="h-[1.125rem] w-[1.125rem] text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-60"
              align="start"
              side="right"
              forceMount
            >
              <DropdownMenuItem
                role="button"
                onClick={onArchive}
                className="cursor-pointer"
                variant="destructive"
              >
                <Trash className="mr-2 h-4 w-4" />
                Mover para a lixeira
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="p-2 text-xs text-muted-foreground">
                Última edição por: {user?.fullName}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <div
            role="button"
            onClick={onCreate}
            className="ml-auto h-full rounded-sm opacity-0 hover:bg-neutral-300
            group-hover:opacity-100 dark:hover:bg-neutral-600"
          >
            <Plus className="h-[1.125rem] w-[1.125rem] text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  )
}

Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
  return (
    <div
      style={{
        paddingLeft: level ? `${level * 12 + 25}px` : '12px',
      }}
      className="flex gap-x-2 py-[.1875rem]"
    >
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-[30%]" />
    </div>
  )
}
