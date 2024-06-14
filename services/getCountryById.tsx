import { TypedSupabaseClient } from '@/types/TypedSupabaseClient'

export async function getCountryById(client: TypedSupabaseClient, countryId: number) {
  return await client
    .from('notes')
    .select(
      'id, title'
    )
    .eq('id', countryId)
    .single()
}

