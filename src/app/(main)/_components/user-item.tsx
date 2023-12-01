'use client'

import { SignOutButton, useUser } from '@clerk/clerk-react'

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { initialLetters } from '@/lib/utils'
import { ChevronsUpDown } from 'lucide-react'

export function UserItem() {
  const { user } = useUser()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          role="button"
          className="flex w-full items-center p-3 text-sm hover:bg-primary/5"
        >
          <div className="flex max-w-[9.375rem] items-center gap-x-2">
            <Avatar className="h-5 w-5 ring-2 ring-neutral-900">
              <AvatarImage src={user?.imageUrl} alt="Avatar do usuário" />
              <AvatarFallback>
                {user ? initialLetters(user.fullName!) : ''}
              </AvatarFallback>
            </Avatar>
            <span className="line-clamp-1 text-start font-medium">
              {user?.fullName}&apos;s Notehub
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-80"
        align="start"
        alignOffset={11}
        forceMount
      >
        <div className="flex flex-col space-y-4 p-2">
          <p className="text-xs font-medium leading-none text-muted-foreground">
            {user?.emailAddresses[0].emailAddress}
          </p>
          <div className="flex items-center gap-x-2">
            <div className="rounded-md bg-secondary p-1">
              <Avatar className="h-8 w-8 ring-2 ring-neutral-900">
                <AvatarImage src={user?.imageUrl} alt="Avatar do usuário" />
                <AvatarFallback>
                  {user ? initialLetters(user.fullName!) : ''}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="space-y-1">
              <p className="line-clamp-1 text-sm">
                {user?.fullName}&apos;s Notehub
              </p>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="w-full cursor-pointer text-muted-foreground"
          asChild
        >
          <SignOutButton>Sair</SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
