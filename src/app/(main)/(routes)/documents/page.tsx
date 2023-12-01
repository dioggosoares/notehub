'use client'

import { useUser } from '@clerk/clerk-react'
import { useMutation } from 'convex/react'
import { PlusCircle } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

import { api } from '@/convex/_generated/api'
import { Button } from '@/components/ui/button'

export default function Documents() {
  const { user } = useUser()
  const create = useMutation(api.documents.create)

  function onCreate() {
    const promise = create({ title: 'Sem título' })

    toast.promise(promise, {
      loading: 'Criando um novo documento...',
      success: 'Novo documento criado!',
      error: 'Falha ao criar novo documento.',
    })
  }

  return (
    <div className="flex h-full flex-col items-center justify-center space-y-4">
      <Image
        src="/empty.png"
        width={300}
        height={300}
        alt="Empty"
        className="dark:hidden"
      />
      <Image
        src="/empty-dark.png"
        width={300}
        height={300}
        alt="Empty"
        className="hidden dark:block"
      />
      <h2 className="text-lg font-medium">
        Bem-vindo ao {user?.firstName}&apos;s Notehub
      </h2>
      <Button onClick={onCreate}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Criar um documento
      </Button>
    </div>
  )
}
