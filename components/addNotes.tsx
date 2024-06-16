'use client'
import { Note, mutationNotes } from "@/services/mutation"
import useSupabaseBrowser from "@/utils/supabase/client"
import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query"

export default function AddNotes() {
  const supabase = useSupabaseBrowser()
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (newNote: Note) => {
      const { data, error } = await mutationNotes(supabase, newNote)
      console.log(data);
      
      if (error) {
        throw new Error(error.message)
      }

      return data
    },
    onError: (error) => {
      console.error('Error inserting note:', error.message)
    },
    onSuccess: (data) => {
      console.log('Note inserted successfully:', data)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  })
  return (
    <div>
      {mutation.isPending ? (
        'Adding todo...'
      ) : (
        <>
          {mutation.isError ? (
            <div>An error occurred: {mutation.error.message}</div>
          ) : null}

          {mutation.isSuccess ? <div>Todo added!</div> : null}

          <button
            onClick={() => {
              mutation.mutate({ id: Number(new Date().getUTCMilliseconds().toFixed(2)), title: 'Do Laundry' })
            }}
          >
            Create Todo
          </button>
        </>
      )}
    </div>
  )
}