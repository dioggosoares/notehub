import { MouseEvent, MouseEventHandler, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useMutation, useQuery } from 'convex/react'
import { Search, Trash, Undo } from 'lucide-react'
import { toast } from 'sonner'

import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'

import { FEEDBACK_MESSAGES } from '@/constants/messages'

import { Spinner } from '@/components/spinner'
import { Input } from '@/components/ui/input'
import { ConfirmModal } from '@/components/modals/confirm-modal'

export function TrashBox() {
  const params = useParams()
  const router = useRouter()

  const documents = useQuery(api.documents.getTrash)
  const restore = useMutation(api.documents.restore)
  const remove = useMutation(api.documents.remove)

  const [search, setSearch] = useState('')

  const filteredDocuments = documents?.filter((document) => {
    return document.title.toLowerCase().includes(search.toLowerCase())
  })

  function onRedirect(documentId: string) {
    router.push(`/documents/${documentId}`)
  }

  function onRestore(
    event: MouseEvent<HTMLDivElement, MouseEventHandler>,
    documentId: Id<'documents'>,
  ) {
    event.stopPropagation()
    const promise = restore({ id: documentId })

    toast.promise(promise, {
      loading: FEEDBACK_MESSAGES.ON_RESTORE_PAGE_LOADING,
      success: FEEDBACK_MESSAGES.ON_RESTORE_PAGE_SUCCESS,
      error: FEEDBACK_MESSAGES.ON_RESTORE_PAGE_ERROR,
    })
  }

  function onRemove(documentId: Id<'documents'>) {
    const promise = remove({ id: documentId })

    toast.promise(promise, {
      loading: FEEDBACK_MESSAGES.ON_REMOVE_PAGE_LOADING,
      success: FEEDBACK_MESSAGES.ON_REMOVE_PAGE_SUCCESS,
      error: FEEDBACK_MESSAGES.ON_REMOVE_PAGE_ERROR,
    })

    if (params.documentId === documentId) {
      router.push('/documents')
    }
  }

  if (documents === undefined) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="text-sm">
      <div className="flex items-center gap-x-1 p-2">
        <Search className="h-4 w-4 text-purple-600" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-7 bg-secondary px-2 focus-visible:ring-transparent"
          placeholder="Filtrar pelo título da página..."
        />
      </div>
      <div className="mt-2 px-1 pb-1">
        <div className="hidden w-full flex-col items-center justify-center gap-y-2 last:flex">
          <Trash className="h-6 w-6 text-muted-foreground" />
          <div className=" flex flex-col items-center justify-center">
            <p className="pb-2 text-center text-sm font-semibold text-muted-foreground">
              Nada por aqui.
            </p>
            <span className="pb-2 text-center text-xs text-muted-foreground">
              Páginas da lixeira aparecem aqui.
            </span>
          </div>
        </div>
        {filteredDocuments?.map((document) => (
          <div
            key={document._id}
            role="button"
            onClick={() => onRedirect(document._id)}
            className="flex w-full items-center justify-between rounded-sm text-sm text-primary hover:bg-primary/5"
          >
            <span className="truncate pl-2">{document.title}</span>
            <div className="flex items-center">
              <div
                onClick={(e: any) => onRestore(e, document._id)}
                role="button"
                className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
              >
                <Undo className="h-4 w-4 text-muted-foreground" />
              </div>
              <ConfirmModal onConfirm={() => onRemove(document._id)}>
                <div
                  role="button"
                  className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                >
                  <Trash className="h-4 w-4 text-muted-foreground" />
                </div>
              </ConfirmModal>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
