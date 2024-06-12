'use client'

import { getCountryById } from '@/services/getCountryById'
import useSupabaseBrowser from '@/utils/supabase/client';

import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import { cookies } from 'next/headers';
import { useParams } from 'next/navigation';

export default function Country({ id }: { id: number }) {
  const supabase = useSupabaseBrowser()
  // This useQuery could just as well happen in some deeper
  // child to <Posts>, data will be available immediately either way
  const { data, isLoading } = useQuery(getCountryById(supabase, id))

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      <h1>SSR: {data?.title}</h1>
    </div>
  )
}