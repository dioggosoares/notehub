import { ChangeEvent, ElementRef, KeyboardEvent, useRef, useState } from 'react'
import { useOnClickOutside } from 'usehooks-ts'
import { useMutation } from 'convex/react'

import { api } from '@/convex/_generated/api'
import { Doc } from '@/convex/_generated/dataModel'

import { DEFAULT_STRINGS } from '@/constants/general'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

interface TitleProps {
  initialData: Doc<'documents'>
}

export function Title({ initialData }: TitleProps) {
  const inputRef = useRef<ElementRef<'input'>>(null)
  const update = useMutation(api.documents.update)

  const [title, setTitle] = useState(
    initialData.title || DEFAULT_STRINGS.UNTITLED,
  )
  const [isEditing, setIsEditing] = useState(false)

  function enableEditing() {
    setTitle(initialData.title)
    setIsEditing(true)
    setTimeout(() => {
      inputRef.current?.focus()
      inputRef.current?.select()
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length)
    })
  }

  function disableEditing() {
    setIsEditing(false)
  }

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value)
    update({
      id: initialData._id,
      title: event.target.value || DEFAULT_STRINGS.UNTITLED,
    })
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      disableEditing()
    }
  }

  // useEventListener('keydown', onKeyDown)
  useOnClickOutside(inputRef, disableEditing)

  return (
    <div className="flex items-center gap-x-1">
      {!!initialData.icon && <p>{initialData.icon}</p>}
      {isEditing ? (
        <Input
          ref={inputRef}
          onClick={enableEditing}
          onBlur={disableEditing}
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={title}
          className="h-7 px-2 focus-visible:ring-transparent"
        />
      ) : (
        <Button
          onClick={enableEditing}
          variant="ghost"
          size="sm"
          className="h-auto p-1 font-normal"
        >
          <span>{initialData.title}</span>
        </Button>
      )}
    </div>
  )
}

Title.Skeleton = function TitleSkeleton() {
  return <Skeleton className="h-7 w-40 rounded-md" />
}
