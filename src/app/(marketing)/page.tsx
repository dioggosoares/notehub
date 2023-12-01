import { Footer } from './_components/footer'
import { Heading } from './_components/heading'
import { Heroes } from './_components/heroes'

export default function Marketing() {
  return (
    <div className="flex min-h-full flex-col">
      <div
        className="flex flex-1 flex-col items-center justify-center
        gap-y-8 text-center md:justify-start"
      >
        <Heading />
        <Heroes />
      </div>
      <Footer />
    </div>
  )
}
