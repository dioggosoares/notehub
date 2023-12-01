'use client'

import { Poppins } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const font = Poppins({
  subsets: ['latin'],
  weight: ['400', '600'],
})

export default function NotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center space-y-4">
      <Image
        src="/notfound.png"
        height="300"
        width="300"
        alt="Error"
        className="dark:hidden"
      />
      <Image
        src="/notfound-dark.png"
        height="300"
        width="300"
        alt="Error"
        className="hidden dark:block"
      />
      <h2 className={cn('text-xl font-medium', font.className)}>
        Ops, não encontramos nada aqui!
      </h2>
      <Button asChild>
        <Link href="/">Voltar</Link>
      </Button>
    </div>
  )
}
