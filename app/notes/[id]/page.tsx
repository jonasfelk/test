import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'

import { getCountryById } from '@/services/getCountryById'
import Country from '@/components/country'

import useSupabaseServer from '@/utils/supabase/server'
import { cookies } from 'next/headers'


export const runtime = 'edge'
export default async function CountryPage({ params }: { params: { id: number } }) {
  const queryClient = new QueryClient()
  const cookieStore = cookies()
  const supabase = useSupabaseServer(cookieStore)
 
  
  await queryClient.prefetchQuery({queryKey: ['notes321'], queryFn: async () => await getCountryById(supabase, params.id)})

  return (
    // Neat! Serialization is now as easy as passing props.
    // HydrationBoundary is a Client Component, so hydration will happen there.
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Country id={params.id} />
    </HydrationBoundary>
  )
}