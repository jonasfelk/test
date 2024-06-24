
import CustomImage from "@/components/CustomImage";
import AddNotes from "@/components/addNotes";
import NotesTest from "@/components/notesTest";

import { getAllNotes } from "@/services/getAllNotes";
import { Note } from "@/services/mutation";

import { serverClient } from "@/utils/supabase/server";

// import useSupabaseServer from "@/utils/supabase/server";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { cookies } from "next/headers";

export const runtime = 'edge'
export default async function Home() {
  const queryClient = new QueryClient()
  const cookieStore = cookies()
  // const supabase = useSupabaseServer(cookieStore)
  const supabase = serverClient(cookieStore)
  // await queryClient.prefetchQuery({queryKey: ['todo'], queryFn: async () => await fetchTodo()})
  await queryClient.prefetchQuery({
    queryKey: ['notes'],
    queryFn: () => getAllNotes(supabase)
  });

  // Получение предварительно загруженных данных
  const initialNotes = queryClient.getQueryData<Note[]>(['notes']);
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <h1 className='text-6xl font-bold'>Hello World!!!trrtrt</h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
      {/* <Notes/> */}
      <NotesTest initialData={initialNotes}/>
      <AddNotes/>
      <CustomImage/>
      <ReactQueryDevtools initialIsOpen={false} />
      </HydrationBoundary>
    </main>
  )
}
