import { createClient } from '@/utils/supabase/server'
export const runtime = 'edge'
export default async function Home() {
  const supabase = createClient()
  const { data: notes } = await supabase.from('notes').select()

  console.log(notes)

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <h1 className='text-6xl font-bold'>Hello World!!!</h1>
      {notes?.map((note) => (
        <p
          className='text-2xl text-white'
          key={note.id}
        >
          {note.title}
        </p>
      ))}
    </main>
  )
}
