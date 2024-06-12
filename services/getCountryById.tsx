
import { TypedSupabaseClient } from '@/types/TypedSupabaseClient'

export function getCountryById(client: TypedSupabaseClient, countryId: number) {
  return client
    .from('notes')
    .select(
      'id, title'
    )
    .eq('id', countryId)
    .single()
}

