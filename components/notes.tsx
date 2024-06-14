'use client'

import { getAllNotes } from '@/services/getAllNotes'
import { createBrowserClient } from '@supabase/ssr';
import useSupabaseBrowser from '@/utils/supabase/client'
import { useQuery } from '@tanstack/react-query'

export const runtime = 'edge'
export default function Notes() {
  const supabase = useSupabaseBrowser()
  
  const { data: notes, isLoading, isError } = useQuery({
    queryKey: ['notes123'],
    queryFn: async () => await getAllNotes(supabase),
  });


  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError || !notes) {
    return <div>Error</div>
  }

  return (
    <div>
      {notes?.map((note) => (
        <div key={note.id}>
          {note.title}
        </div>
      ))}
     {/* {notes?.map((note) => (
        <div key={note.id}>
          {note.title}
        </div>
      ))} */}
    </div>
  )
}