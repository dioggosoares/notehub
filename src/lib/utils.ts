import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function initialLetters(text: string) {
  const initials = text.split(' ')

  if (initials.length >= 1) {
    const firstLetter = initials[0][0]

    if (initials.length >= 2) {
      const secondLetter = initials[1][0]
      return firstLetter + secondLetter
    }

    return firstLetter
  }

  return null
}
