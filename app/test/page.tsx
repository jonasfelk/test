
import { browserClient } from '@/utils/supabase/client';
import Link from 'next/link';

// export const revalidate = 10
export default async function Test() {
  // const supabase = useSupabaseBrowser()
  const supabase = browserClient()
  const { data, error } = await supabase
    .from('notes')
    .select('*')

  if (error || !data) {
    console.error('Error fetching notes or no data found:', error);
    return [];
  }
  console.log(data);
  
  return (
    <div>
      <h1>Test Page</h1>
      <Link href="/test/1">Link</Link>
      <p>
        {data?.map((note) => (
          <Link href={`/test/${note.id}`} key={note.id}>
            {note.title}
          </Link>
        ))}
      </p>      
    </div>
  );
}