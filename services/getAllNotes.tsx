import { TypedSupabaseClient } from '@/types/TypedSupabaseClient'

export function getAllNotes(client: TypedSupabaseClient) {
  return client
    .from('notes')
    .select('*')
}


export async function fetchTodo() {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}