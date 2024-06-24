'use client'

import { browserClient } from '@/utils/supabase/client';
// import useSupabaseBrowser from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';

// export const runtime = 'edge'
export default function CommentID({ id }: { id: number }) {
  // const supabase = useSupabaseBrowser()
  const supabase = browserClient()
  // This useQuery could just as well happen in some deeper
  // child to <Posts>, data will be available immediately either way

  const { data, isLoading, error, refetch, isPending, isFetching } = useQuery({queryKey: ['todo'], queryFn: async () => await supabase
  .from('todo')
  .select('*')
  .eq('id', id)})
  console.log(data, 'ssr');
  if (isLoading || isPending) return <p>Loading...</p>;

  if (error) {
    console.error('Error fetching data:', error);
    return <p>Error fetching data: {error.message}</p>;
  }
  return (
    <div>
      <h1>SSR: {data?.data?.map((note) => note.title)}</h1>
      {isFetching ? <p>Загрузка...</p> : <button onClick={() => refetch()}>Обновить</button>}
    </div>
  )
}