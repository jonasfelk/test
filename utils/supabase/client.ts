import { TypedSupabaseClient } from '@/types/TypedSupabaseClient'
import { Database } from '@/types/database.types'
import { createBrowserClient } from '@supabase/ssr'
import { useMemo } from 'react'

// let client: TypedSupabaseClient | undefined
// console.log(client, 'client');

// function getSupabaseBrowserClient() {
//   if (client) {
//     return client
//   }

//   client = createBrowserClient<Database>(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
//   )

//   return client
// }

// function useSupabaseBrowser() {
//   return useMemo(getSupabaseBrowserClient, [])
// }

// export default useSupabaseBrowser

let client: TypedSupabaseClient | undefined;
console.log(client, 'client');

function getSupabaseBrowserClient(): TypedSupabaseClient {
  if (!client) {
    client = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return client;
}

export const browserClient = getSupabaseBrowserClient;