'use client'

import { getAllNotes } from '@/services/getAllNotes'
import useSupabaseBrowser from '@/utils/supabase/client'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'

export const runtime = 'edge'
export default function NotesTest() {
  const supabase = useSupabaseBrowser()
  
  const { data: notes, isLoading, isError } = useQuery({
    queryKey: ['notes321'],
    queryFn: async () => await getAllNotes(supabase),
  });
  // const { data: notes, isLoading, isError, status} = useQuery({
  //   queryKey: ['todo'],
  //   queryFn: async () => await fetchTodo(),
    
  // });
  

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError || !notes) {
    return <div>Error</div>
  }

  return (
    <div>
      {notes.data?.map((note: any) => (
        <div key={note.id}>

          <Link href={`/notes/${note.id}`}> {note.title}</Link>
        </div>
      ))}
    </div>
  )
}