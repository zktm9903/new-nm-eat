import { MenuList } from "./MenuList";
import { getMenusWithLikeByDate } from "@/lib/menus/get-menus-with-like";

interface MenuListWrapperProps {
  date: Date;
}

export async function MenuListWrapper({ date }: MenuListWrapperProps) {
  const menus = await getMenusWithLikeByDate(date);
  return <MenuList menus={menus} date={date} />;
}
