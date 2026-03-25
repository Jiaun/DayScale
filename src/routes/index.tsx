import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <>
      <main className="min-h-screen max-w-md bg-red-600"></main>
    </>
  )
}
