import useSupabaseServer from "@/utils/supabase/server";
import Image from "next/image";
import { cookies } from "next/headers";
export default function CustomImage() {

  const cookieStore = cookies()
  const supabase = useSupabaseServer(cookieStore); // Предположим, что здесь вы получаете supabase инстанс

  // Получение публичного URL изображения
  const { data } = supabase.storage.from('test').getPublicUrl('test.png');
  console.log(data.publicUrl);
  
  return (
    <Image
      src={data.publicUrl}
      alt="test"
      width={1000}
      height={1000}
      placeholder="blur"
      blurDataURL={data.publicUrl}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      style={{ objectFit: 'cover' }}
    />
  );
}


