
import CustomImage from "@/components/CustomImage";
import VideoShorts from "@/components/VideoShorts";
import AddNotes from "@/components/addNotes";
import NotesTest from "@/components/notesTest";

import { getAllNotes } from "@/services/getAllNotes";
import useSupabaseServer from "@/utils/supabase/server";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { cookies } from "next/headers";
import Image from "next/image";


export const runtime = 'edge'
export default async function Home() {
  const queryClient = new QueryClient()
  const cookieStore = cookies()
  const supabase = useSupabaseServer(cookieStore)
  
  // await queryClient.prefetchQuery({queryKey: ['todo'], queryFn: async () => await fetchTodo()})
  await queryClient.prefetchQuery({queryKey: ['notes'], queryFn: () => getAllNotes(supabase)})
  

  
  
  return (
    <main className='"flex flex-col items-center justify-between overflow-hidden bg-black"'>
      {/* <h1 className='text-6xl font-bold'>Hello World!!!trrtrt</h1> */}
      <HydrationBoundary state={dehydrate(queryClient)}>
      <VideoShorts />
      {/* <Notes/> */}
      {/* <NotesTest/>
      <AddNotes/>
      <CustomImage/> */}
      <ReactQueryDevtools initialIsOpen={false} />
      </HydrationBoundary>
    </main>
  )
}
