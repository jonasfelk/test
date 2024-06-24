import { TypedSupabaseClient } from "@/types/TypedSupabaseClient"
export type Note = {
  id: number;
  title: string | null;
  desc: string | null;
  comment: string | null;
}
export async function mutationNotes(client: TypedSupabaseClient, newNote: Note) {
  const { data, error } = await client
  .from('notes')
  .insert(newNote)

  return { data, error }
}