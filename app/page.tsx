
import NotesTest from "@/components/notesTest";

import { getAllNotes } from "@/services/getAllNotes";
import useSupabaseServer from "@/utils/supabase/server";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { cookies } from "next/headers";


export const runtime = 'edge'
export default async function Home() {
  const queryClient = new QueryClient()
  const cookieStore = cookies()
  const supabase = useSupabaseServer(cookieStore)
  
  // await queryClient.prefetchQuery({queryKey: ['todo'], queryFn: async () => await fetchTodo()})
  await queryClient.prefetchQuery({queryKey: ['notes'], queryFn: () => getAllNotes(supabase)})

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <h1 className='text-6xl font-bold'>Hello World!!!trrtrt</h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
      {/* <Notes/> */}
      <NotesTest/>
      
      <ReactQueryDevtools initialIsOpen={false} />
      </HydrationBoundary>
    </main>
  )
}
