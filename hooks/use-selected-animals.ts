export const ANIMALS = [
  { key: "cat", src: "/1-no-image-cat.gif", label: "고양이" },
  { key: "dog", src: "/1-no-image-dog.gif", label: "개" },
  { key: "guinea-pig", src: "/1-no-image-guinea-pig.gif", label: "기니피그" },
  { key: "nakta", src: "/1-no-image-nakta.gif", label: "낙타" },
] as const;

export { useSelectedAnimalsContext as useSelectedAnimals } from "@/components/providers/SelectedAnimalsProvider";
