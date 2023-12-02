'use client'

import { redirect } from 'next/navigation'
import { useConvexAuth } from 'convex/react'

import { Spinner } from '@/components/spinner'
import { Navigation } from './_components/navigation'
import { SearchCommand } from '@/components/search-command'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, isLoading } = useConvexAuth()

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return redirect('/')
  }

  return (
    <div className="flex h-full dark:bg-neutral-900">
      <Navigation />
      <main className="h-full flex-1 overflow-y-auto">
        <SearchCommand />
        {children}
      </main>
    </div>
  )
}
