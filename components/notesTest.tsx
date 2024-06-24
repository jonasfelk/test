'use client'

import { getAllNotes } from '@/services/getAllNotes'
import { Note } from '@/services/mutation'
import { browserClient } from '@/utils/supabase/client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'

// export const runtime = 'edge'

type Props = {
  initialData: Note[] | undefined; // Указываем явно тип initialData как Note[] | undefined
}
export default function NotesTest({ initialData }: Props) {
  // const supabase = useSupabaseBrowser()
  const supabase = browserClient()
  const { data: notes, isLoading, isError, isFetching, refetch,  error } = useQuery({
    queryKey: ['notes'],
    queryFn: () => getAllNotes(supabase),
    initialData,
    staleTime: 1000 * 60,
    refetchOnMount: false,
    refetchOnReconnect: false,
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
          <Link prefetch={false} href={`/notes/${note.id}`}> {note.title}</Link>
        </div>
      ))}
    </div>
  )
}