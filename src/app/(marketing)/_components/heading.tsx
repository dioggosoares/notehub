'use client'

import { useConvexAuth } from 'convex/react'
import { ArrowRight } from 'lucide-react'
import { SignInButton } from '@clerk/clerk-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/spinner'

export function Heading() {
  const { isAuthenticated, isLoading } = useConvexAuth()
  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-3xl font-bold sm:text-5xl md:text-6xl">
        Suas ideias, documentos, tarefas e planos. Unificados. Bem-vindo ao{' '}
        <span className="underline">Notehub</span>
      </h1>
      <h3 className="text-base font-medium sm:text-xl md:text-2xl">
        O seu trabalho conectado, eficiente, <br />
        colaborativo, mais rápido e melhor.
      </h3>

      {isLoading && (
        <div className="flex w-full items-center justify-center">
          <Spinner size="lg" />
        </div>
      )}
      {isAuthenticated && !isLoading && (
        <Button asChild>
          <Link href="/documents" className="group">
            Acessar Notehub
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      )}
      {!isAuthenticated && !isLoading && (
        <SignInButton mode="modal">
          <Button>
            Obtenha Notehub gratuitamente
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </SignInButton>
      )}
    </div>
  )
}
