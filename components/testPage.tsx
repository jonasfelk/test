// import useSupabaseBrowser from '@/utils/supabase/client';
import Comment from "@/components/comment";
import { browserClient } from "@/utils/supabase/client";
import { Suspense } from 'react';
// export const revalidate = 10
export default async function TestPage({ id }: { id: string }) {
  
  // const supabase = useSupabaseBrowser()
  const supabase = browserClient()
  const { data, error, statusText, status} = await supabase
    .from('notes')
    .select('*')
    .eq('id', parseInt(id))
  if (error) {
    console.error('Error fetching notes:', error);
    return <div>Error</div>;
  }
console.log(data, 'ssg');

  return (
    <div>
      <h1>Test Page 43</h1>
      <div>My Post: {id}</div>
      {data?.map((note) => (
        <div key={note.id}>
          {note.title}
        </div>
      ))}
     <Suspense fallback={<p>Loading123...</p>}>
          <Comment id={id}/>
       </Suspense>
    </div>
  );
}