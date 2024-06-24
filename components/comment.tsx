import { getCountryById } from "@/services/getCountryById"
// import useSupabaseServer from "@/utils/supabase/server";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query"
import { cookies } from "next/headers"
import Country from "./country"
import CommentID from "./CommentID"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { serverClient } from "@/utils/supabase/server"

export default async function Comment({ id }: { id: string }) {
  const queryClient = new QueryClient()
  const cookieStore = cookies()
  // const supabase = useSupabaseServer(cookieStore)
  const supabase = serverClient(cookieStore)
  // await new Promise(resolve => setTimeout(resolve, 3000));
  await queryClient.prefetchQuery({queryKey: ['todo'], queryFn: async () => await supabase
  .from('todo')
  .select('*')
  .eq('id', id)})
  

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
    <>
      <CommentID id={parseInt(id)} />
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  </HydrationBoundary>
  )
}