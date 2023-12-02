import { MoreHorizontal, Trash } from 'lucide-react'
import { useUser } from '@clerk/clerk-react'
import { useMutation } from 'convex/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { Id } from '@/convex/_generated/dataModel'
import { api } from '@/convex/_generated/api'

import { FEEDBACK_MESSAGES } from '@/constants/messages'

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

interface MenuProps {
  documentId: Id<'documents'>
}

export function Menu({ documentId }: MenuProps) {
  const router = useRouter()
  const { user } = useUser()

  const archive = useMutation(api.documents.archive)

  const onArchive = () => {
    const promise = archive({ id: documentId })

    toast.promise(promise, {
      loading: FEEDBACK_MESSAGES.ON_DELETE_PAGE_LOADING,
      success: FEEDBACK_MESSAGES.ON_DELETE_PAGE_SUCCESS,
      error: FEEDBACK_MESSAGES.ON_DELETE_PAGE_ERROR,
    })

    router.push('/documents')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-60"
        align="end"
        alignOffset={8}
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
  )
}

Menu.Skeleton = function MenuSkeleton() {
  return <Skeleton className="h-10 w-10" />
}
