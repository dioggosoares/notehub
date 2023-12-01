import Image from 'next/image'
import { Poppins } from 'next/font/google'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const font = Poppins({
  subsets: ['latin'],
  weight: ['400', '600'],
})

export function Logo() {
  return (
    <Button
      variant="transparent"
      className="hidden select-none items-center gap-x-2 md:flex"
      asChild
    >
      <Link href="/">
        <Image
          src="/logo.svg"
          height="40"
          width="40"
          alt="Logo"
          className="dark:hidden"
        />
        <Image
          src="/logo-dark.svg"
          height="40"
          width="40"
          alt="Logo"
          className="hidden dark:block"
        />
        <p className={cn('font-semibold', font.className)}>Notehub</p>
      </Link>
    </Button>
  )
}
