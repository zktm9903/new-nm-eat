export const ANIMALS = [
  { key: "cat", src: "https://xoxdkbgdszmlrblcscwp.supabase.co/storage/v1/object/public/animal/1-no-image-cat.webp", label: "고양이" },
  { key: "dog", src: "https://xoxdkbgdszmlrblcscwp.supabase.co/storage/v1/object/public/animal/1-no-image-dog.webp", label: "개" },
  { key: "guinea-pig", src: "https://xoxdkbgdszmlrblcscwp.supabase.co/storage/v1/object/public/animal/1-no-image-guinea-pig.webp", label: "기니피그" },
  { key: "red-panda", src: "https://xoxdkbgdszmlrblcscwp.supabase.co/storage/v1/object/public/animal/1-no-image-red-panda.webp", label: "레서판다" },
] as const;

export { useSelectedAnimalsContext as useSelectedAnimals } from "@/components/providers/SelectedAnimalsProvider";
