import { supabase } from "@/lib/supabase/server";
import { Menu, MealType } from "@/types/menu";
import { getOrCreateUserToken } from "@/lib/auth/token";
import { MenuWithLike } from "@/hooks/query-options/menu-options";
import { formatDateToYYYYMMDD } from "@/lib/utils/date";

export async function getMenusWithLikeByDate(
  date: Date,
  mealType?: MealType
): Promise<MenuWithLike[]> {
  // 로컬 시간대 기준으로 날짜 문자열 생성 (시간대 문제 방지)
  const dateStr = formatDateToYYYYMMDD(date);

  // 메뉴 조회
  let query = supabase.from("menus").select("*").eq("date", dateStr);

  if (mealType) {
    query = query.eq("meal_type", mealType);
  }

  const { data, error } = await query.order("meal_type", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch menus: ${error.message}`);
  }

  const menus = (data || []).map((menu: any) => ({
    id: menu.id,
    name: menu.name,
    description: menu.description,
    calories: menu.calories,
    mealType: menu.meal_type as MealType,
    imageUrl: menu.image_url,
    isLunchBox: menu.is_lunch_box,
    date: new Date(menu.date),
    createdAt: menu.created_at ? new Date(menu.created_at) : undefined,
    updatedAt: menu.updated_at ? new Date(menu.updated_at) : undefined,
    likeCount: menu.liked || 0,
  })) as (Menu & { likeCount: number })[];

  // 사용자 토큰 가져오기
  const userToken = await getOrCreateUserToken();

  // 사용자 확인 또는 생성
  let { data: user, error: userError } = await supabase
    .from("users")
    .select("id")
    .eq("id", userToken)
    .single();

  if (userError || !user) {
    // 사용자가 없으면 생성
    const { data: newUser, error: createError } = await supabase
      .from("users")
      .insert({ id: userToken })
      .select()
      .single();

    if (createError || !newUser) {
      // 사용자 생성 실패 시 기본값으로 처리
      return menus.map((menu) => ({
        ...menu,
        liked: false,
      })) as MenuWithLike[];
    }

    user = newUser;
  }

  // 각 메뉴에 대한 좋아요 상태 조회
  const menuIds = menus.map((menu) => menu.id).filter(Boolean) as string[];

  if (menuIds.length > 0 && user) {
    const { data: userMenus } = await supabase
      .from("user_menus")
      .select("menu_id, liked")
      .eq("user_id", user.id)
      .in("menu_id", menuIds);

    // 메뉴에 좋아요 상태 추가 (likeCount는 이미 menus에 포함됨)
    return menus.map((menu) => {
      const userMenu = userMenus?.find((um) => um.menu_id === menu.id);

      return {
        ...menu,
        liked: userMenu?.liked || false,
      };
    }) as MenuWithLike[];
  }

  return menus.map((menu) => ({
    ...menu,
    liked: false,
  })) as MenuWithLike[];
}
