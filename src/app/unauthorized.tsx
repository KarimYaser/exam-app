

export default function Unauthorized() {
  return (
    <main className="grow bg-zinc-800 flex flex-col gap-4 items-center justify-center">
      <h1 className="text-red-500 text-4xl font-bold">Unauthorized</h1>

      <p className="text-white text-xl font-bold">You are not authorized to access this page.</p>
    </main>
  )
}
