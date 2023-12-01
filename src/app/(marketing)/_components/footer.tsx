import { Button } from '@/components/ui/button'

import { Logo } from './logo'

export function Footer() {
  return (
    <div className="z-50 flex w-full items-center bg-background p-6 dark:bg-neutral-900">
      <Logo />
      <div className="flex w-full items-center justify-between gap-x-2 text-muted-foreground md:ml-auto md:justify-end">
        <Button variant="ghost" size="sm">
          Política de Privacidade
        </Button>
        <Button variant="ghost" size="sm">
          Termos e Condições
        </Button>
      </div>
    </div>
  )
}
