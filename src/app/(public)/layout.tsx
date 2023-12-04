import { ReactNode } from 'react'

const PublicLayout = ({ children }: { children: ReactNode }) => {
  return <div className="h-full dark:bg-neutral-900">{children}</div>
}

export default PublicLayout
