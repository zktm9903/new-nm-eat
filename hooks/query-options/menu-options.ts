import { Menu } from "@/types/menu";

export interface MenuWithLike extends Menu {
  liked?: boolean;
  likeCount?: number;
}

export interface MenusResponse {
  menus: MenuWithLike[];
}

// 메뉴 목록 조회
export const menuQueryOptions = (date: Date) => ({
  queryKey: ["menus", date.toISOString().slice(0, 10)] as const,
  queryFn: async (): Promise<MenuWithLike[]> => {
    const dateStr = date.toISOString().slice(0, 10);
    const response = await fetch(`/api/menus?date=${dateStr}`);

    if (!response.ok) {
      throw new Error("Failed to fetch menus");
    }

    const data: MenusResponse = await response.json();
    return data.menus;
  },
  staleTime: 30 * 1000, // 30초
});

// 좋아요 토글 mutation
export const toggleLikeMutationOptions = (menuId: string) => ({
  mutationFn: async (): Promise<{ success: boolean }> => {
    const response = await fetch(`/api/menus/${menuId}/like`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Failed to toggle like");
    }

    return response.json();
  },
});
