'use client'
import { Note, mutationNotes } from "@/services/mutation"
import { browserClient } from "@/utils/supabase/client";
// import useSupabaseBrowser from "@/utils/supabase/client";

import { useMutation, useQueryClient } from "@tanstack/react-query"

export default function AddNotes() {
  // const supabase = useSupabaseBrowser()
  
  const queryClient = useQueryClient();
  const supabase = browserClient()
  const mutation = useMutation({
    mutationFn: async (newNote: Note) => {
      const { data, error } = await mutationNotes(supabase, newNote);
      console.log(data);
      
      if (error) {
        throw new Error(error.message)
      }

      return data;
    },
    onMutate: async (newNote) => {
      // Отменяем все исходящие refetch-запросы, чтобы не перезаписать оптимистическое обновление
      await queryClient.cancelQueries({ queryKey: ['notes'] });

      // Сохраняем предыдущие данные
      const previousNotes = queryClient.getQueryData(['notes']);

      // Оптимистически обновляем данные
      queryClient.setQueryData(['notes'], (old: Note[] = []) => [...old, newNote]);

      // Возвращаем контекст с предыдущими данными
      return { previousNotes };
    },
    onError: (error, newNote, context) => {
      console.error('Error inserting note:', error.message);
      // Откатываем оптимистическое обновление в случае ошибки
      queryClient.setQueryData(['notes'], context?.previousNotes);
    },
    onSettled: () => {
      // Всегда делаем повторный запрос после успешного или неуспешного завершения мутации
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  return (
    <div>
      {mutation.isPending ? (
        'Adding note...'
      ) : (
        <>
          {mutation.isError ? (
            <div>An error occurred: {mutation.error.message}</div>
          ) : null}

          {mutation.isSuccess ? <div>Note added!</div> : null}

          <button
            onClick={() => {
              mutation.mutate({ id: Number(new Date().getUTCMilliseconds().toFixed(2)), title: 'Do Laundry', desc: null, comment: null });
            }}
          >
            Create Note
          </button>
        </>
      )}
    </div>
  );
}
