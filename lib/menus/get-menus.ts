import { supabase } from '@/lib/supabase/server';
import { Menu, MealType } from '@/types/menu';
import { formatDateToYYYYMMDD } from '@/lib/utils/date';

export async function getMenusByDate(
  date: Date,
  mealType?: MealType
): Promise<Menu[]> {
  // 로컬 시간대 기준으로 날짜 문자열 생성 (시간대 문제 방지)
  const dateStr = formatDateToYYYYMMDD(date);
  
  let query = supabase
    .from('menus')
    .select('*')
    .eq('date', dateStr);

  if (mealType) {
    query = query.eq('meal_type', mealType);
  }

  const { data, error } = await query.order('meal_type', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch menus: ${error.message}`);
  }

  return (data || []).map((menu: any) => ({
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
  })) as Menu[];
}

