import { MealType } from "@/types/menu";
import { MenuCard } from "./MenuCard";
import { Separator } from "@/components/ui/separator";
import { MenuWithLike } from "@/hooks/query-options/menu-options";

interface MenuListProps {
  menus: MenuWithLike[];
  date: Date;
}

export function MenuList({ menus, date }: MenuListProps) {
  // 점심 메뉴 필터링 및 정렬: 일반식이 먼저, 도시락이 나중에
  const lunchMenus = menus
    .filter((menu) => menu.mealType === MealType.LUNCH)
    .sort((a, b) => {
      // 1. 일반식이 도시락보다 먼저
      if (a.isLunchBox !== b.isLunchBox) {
        return a.isLunchBox ? 1 : -1;
      }
      // 2. 같은 타입이면 이름순
      return a.name.localeCompare(b.name);
    });

  // 저녁 메뉴 필터링 및 정렬: 일반식이 먼저, 도시락이 나중에
  const dinnerMenus = menus
    .filter((menu) => menu.mealType === MealType.DINNER)
    .sort((a, b) => {
      // 1. 일반식이 도시락보다 먼저
      if (a.isLunchBox !== b.isLunchBox) {
        return a.isLunchBox ? 1 : -1;
      }
      // 2. 같은 타입이면 이름순
      return a.name.localeCompare(b.name);
    });

  if (lunchMenus.length === 0 && dinnerMenus.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>아직 없다용</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 점심 메뉴 */}
      {lunchMenus.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">점심</h2>
            <Separator className="flex-1" />
          </div>
          <div className="grid grid-cols-1 gap-4 [@media(min-width:600px)]:grid-cols-2">
            {lunchMenus.map((menu) => (
              <MenuCard key={menu.id} menu={menu} date={date} />
            ))}
          </div>
        </div>
      )}

      {/* 저녁 메뉴 */}
      {dinnerMenus.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">저녁</h2>
            <Separator className="flex-1" />
          </div>
          <div className="grid grid-cols-1 gap-4 [@media(min-width:600px)]:grid-cols-2">
            {dinnerMenus.map((menu) => (
              <MenuCard key={menu.id} menu={menu} date={date} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
