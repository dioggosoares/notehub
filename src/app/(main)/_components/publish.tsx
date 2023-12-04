import { useMutation } from 'convex/react'
import { useState } from 'react'
import { toast } from 'sonner'

import { api } from '@/convex/_generated/api'
import { Doc } from '@/convex/_generated/dataModel'

import { useOrigin } from '@/hooks/use-origin'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Check, Copy, Globe2 } from 'lucide-react'
import { FEEDBACK_MESSAGES } from '@/constants/messages'

interface PublishProps {
  initialData: Doc<'documents'>
}

export function Publish({ initialData }: PublishProps) {
  const origin = useOrigin()
  const update = useMutation(api.documents.update)

  const [copied, setCopied] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const url = `${origin}/preview/${initialData._id}`

  const onPublish = () => {
    setIsSubmitting(true)

    const promise = update({
      id: initialData._id,
      isPublished: true,
    }).finally(() => setIsSubmitting(false))

    toast.promise(promise, {
      loading: FEEDBACK_MESSAGES.ON_PUBLISHING_PAGE_LOADING,
      success: FEEDBACK_MESSAGES.ON_PUBLISHING_PAGE_SUCCESS,
      error: FEEDBACK_MESSAGES.ON_PUBLISHING_PAGE_ERROR,
    })
  }

  const onUnpublish = () => {
    setIsSubmitting(true)

    const promise = update({
      id: initialData._id,
      isPublished: false,
    }).finally(() => setIsSubmitting(false))

    toast.promise(promise, {
      loading: FEEDBACK_MESSAGES.ON_UNPUBLISHING_PAGE_LOADING,
      success: FEEDBACK_MESSAGES.ON_UNPUBLISHING_PAGE_LOADING,
      error: FEEDBACK_MESSAGES.ON_UNPUBLISHING_PAGE_LOADING,
    })
  }

  const onCopy = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 1000)
  }
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="ghost">
          Publicar
          {initialData.isPublished && (
            <Globe2 className="ml-2 h-4 w-4 text-sky-500" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end" alignOffset={8} forceMount>
        {initialData.isPublished ? (
          <div className="space-y-4">
            <div className="flex items-center gap-x-2">
              <Globe2 className="h-4 w-4 animate-pulse text-sky-500" />
              <p className="text-xs font-medium text-sky-500">
                Esta página está on-line na web.
              </p>
            </div>
            <div className="flex items-center">
              <input
                className="h-8 flex-1 truncate rounded-l-md border bg-muted px-2 text-xs"
                value={url}
                disabled
              />
              <Button
                onClick={onCopy}
                disabled={copied}
                className="h-8 rounded-l-none"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Button
              size="sm"
              className="w-full text-xs"
              disabled={isSubmitting}
              onClick={onUnpublish}
            >
              Despublicar
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <Globe2 className="mb-2 h-8 w-8 text-muted-foreground" />
            <p className="mb-2 text-sm font-medium">Publicar esta página</p>
            <span className="mb-4 text-[10px] text-muted-foreground">
              Compartilhe seu trabalho com outras pessoas.
            </span>
            <Button
              disabled={isSubmitting}
              onClick={onPublish}
              className="w-full text-xs"
              size="sm"
            >
              Publicar
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
