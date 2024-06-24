import Comment from "@/components/comment";
import { browserClient } from "@/utils/supabase/client";

import { createClient } from "@/utils/supabase/clientStatic";
import Link from "next/link";



export const revalidate = 100
export async function generateStaticParams() {
  const supabase = browserClient()
  const { data, error } = await supabase.from('notes').select('id')
  if (error || !data) {
    console.error('Error fetching notes or no data found:', error);
    return [];
  }
  return data?.map((note) => ({
    id: note.id.toString(),
  }));
}

export default async function Page({ params }: { params: { id: string } }) {
  
  // const supabase = useSupabaseBrowser()
  const supabase = browserClient()

  const { data, error, statusText, status} = await supabase
    .from('notes')
    .select('*')
    .eq('id', parseInt(params.id))


  if (error) {
    console.error('Error fetching notes:', error);
    return <div>Error</div>;
  }
  
  return (
    <div>
      <h1>Test Page 43</h1>
      <Link href="/test">Link</Link>
      <div>My Post: {params.id}</div>
      {data?.map((note) => (
        <div key={note.id}>
          {note.title}
        </div>
      ))}
          <Comment id={params.id}/>
      
    </div>
  )
}



