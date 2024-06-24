import { TypedSupabaseClient } from '@/types/TypedSupabaseClient'
import { PostgrestError } from '@supabase/supabase-js';

type Note = {
  id: number;
  title: string | null;
  desc: string | null;
  comment: string | null;
};

// export async function getAllNotes(client: TypedSupabaseClient): Promise<Note[]> {
//   const { data, error } = await client
//     .from('notes')
//     .select()

//   if (error || !data) {
//     console.error('Error fetching notes:', error);
//     return [];
//   }

//   return data
// }
export async function getAllNotes(client: TypedSupabaseClient) {
  try {
    const { data, error } = await client
      .from('notes')
      .select('*')
      .throwOnError()
      // .then((result) => result.data);
    
    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Ошибка при получении заметок:', error);
    throw error;
  }
}
// export async function fetchTodo() {
//   const response = await fetch('https://jsonplaceholder.typicode.com/todos');
//   if (!response.ok) {
//     throw new Error('Network response was not ok');
//   }
//   return response.json();
// }