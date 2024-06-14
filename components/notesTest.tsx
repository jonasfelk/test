'use client'

import { getAllNotes } from '@/services/getAllNotes'
import useSupabaseBrowser from '@/utils/supabase/client'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'

export const runtime = 'edge'
export default function NotesTest() {
  const supabase = useSupabaseBrowser()
  
  const { data: notes, isLoading, isError, isFetching, refetch,  error } = useQuery({
    queryKey: ['notes'],
    queryFn: () => getAllNotes(supabase),
    staleTime: 1000 * 60,
  });
  // const { data: notes, isLoading, isError, status} = useQuery({
  //   queryKey: ['todo'],
  //   queryFn: async () => await fetchTodo(),
    
  // });
  
// console.log(notes);

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    console.error('Ошибка при получении заметок:', error);
    return <div>Ошибка: {error.message}</div>;
  }

  return (
    <div>
       <button onClick={() => {
        console.log('Refetching...');
        refetch().then(() => {
          console.log('Refetch completed');
        }).catch(err => {
          console.error('Refetch error:', err);
        });
      }}>
        Обновить
      </button>
      {isFetching && <div>Обновление данных...</div>}
      {notes?.map((note) => (
        <div key={note.id}>

          <Link href={`/notes/${note.id}`}> {note.title}</Link>
        </div>
      ))}
    </div>
  )
}