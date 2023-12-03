import { QuestionMarkIcon } from '@radix-ui/react-icons'
import { Sparkles } from 'lucide-react'

export function Helpers() {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-y-4">
      <button
        className="group flex h-10 w-10 items-center justify-center rounded-full
          border border-dashed border-neutral-400 bg-neutral-50
          transition-colors duration-300 ease-linear hover:bg-neutral-200/50
          dark:bg-neutral-500 dark:hover:bg-neutral-600"
      >
        <Sparkles
          className="h-5 w-5 text-purple-600 transition-colors duration-300
            ease-linear dark:text-purple-400 dark:group-hover:text-neutral-50"
        />
      </button>

      <button
        className="group flex h-10 w-10 items-center justify-center rounded-full
          border border-dashed border-neutral-400 bg-neutral-50 transition
          duration-300 ease-linear hover:bg-neutral-200/50 dark:bg-neutral-500
          dark:hover:opacity-50"
      >
        <QuestionMarkIcon
          className="h-5 w-5 text-purple-600 transition-colors duration-300
            ease-linear dark:text-purple-400 dark:group-hover:text-neutral-50"
        />
      </button>
    </div>
  )
}
