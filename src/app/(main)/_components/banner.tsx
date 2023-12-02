import { useMutation } from 'convex/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { Id } from '@/convex/_generated/dataModel'
import { api } from '@/convex/_generated/api'

import { FEEDBACK_MESSAGES } from '@/constants/messages'

import { Button } from '@/components/ui/button'
import { ConfirmModal } from '@/components/modals/confirm-modal'

interface BannerProps {
  documentId: Id<'documents'>
}

export function Banner({ documentId }: BannerProps) {
  const router = useRouter()

  const remove = useMutation(api.documents.remove)
  const restore = useMutation(api.documents.restore)

  function onRemove() {
    const promise = remove({ id: documentId })

    toast.promise(promise, {
      loading: FEEDBACK_MESSAGES.ON_REMOVE_PAGE_LOADING,
      success: FEEDBACK_MESSAGES.ON_REMOVE_PAGE_SUCCESS,
      error: FEEDBACK_MESSAGES.ON_REMOVE_PAGE_ERROR,
    })

    router.push('/documents')
  }

  function onRestore() {
    const promise = restore({ id: documentId })

    toast.promise(promise, {
      loading: FEEDBACK_MESSAGES.ON_RESTORE_PAGE_LOADING,
      success: FEEDBACK_MESSAGES.ON_RESTORE_PAGE_SUCCESS,
      error: FEEDBACK_MESSAGES.ON_RESTORE_PAGE_ERROR,
    })
  }

  return (
    <div
      className="flex w-full items-center justify-center gap-x-2 bg-destructive p-2
      text-center text-sm text-neutral-50"
    >
      <p>Esta página está na Lixeira</p>

      <Button
        size="sm"
        onClick={onRestore}
        variant="outline"
        className="h-auto border-zinc-50 bg-transparent p-1
        px-2 transition-all duration-300 ease-linear hover:bg-primary/10
        hover:text-zinc-50"
      >
        Restaurar página
      </Button>

      <ConfirmModal onConfirm={onRemove}>
        <Button
          size="sm"
          variant="outline"
          className="h-auto border-zinc-50 bg-transparent p-1
        px-2 transition-all duration-300 ease-linear hover:bg-primary/10
        hover:text-zinc-50"
        >
          Excluir permanentemente
        </Button>
      </ConfirmModal>
    </div>
  )
}
