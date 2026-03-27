import { supabase } from "@/lib/supabase";

export async function uploadPropertyImage(
  file: File,
  sellerId: string,
  propertyId: string
) {
  const ext = file.name.split(".").pop();
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const storagePath = `listings/${sellerId}/${propertyId}/${filename}`;

  const { error } = await supabase.storage
    .from("properties")
    .upload(storagePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from("properties")
    .getPublicUrl(storagePath);

  return {
    storagePath,
    imageUrl: data.publicUrl,
  };
}
