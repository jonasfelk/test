'use client'

import { getCountryById } from '@/services/getCountryById';
import { browserClient } from '@/utils/supabase/client';


import { useQuery } from '@tanstack/react-query';



export const runtime = 'edge'
export default function Country({ id }: { id: number }) {
  // const supabase = useSupabaseBrowser()
  const supabase = browserClient()
  // This useQuery could just as well happen in some deeper
  // child to <Posts>, data will be available immediately either way
  const { data, isLoading } = useQuery({queryKey: ['notesId'], queryFn: () => getCountryById(supabase, id)})
  
  return (
    <div>
      {isLoading && <p>Loading...</p>}
      <h1>SSR: {data?.data?.title}</h1>
    </div>
  )
}