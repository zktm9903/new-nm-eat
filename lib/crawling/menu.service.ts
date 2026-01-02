import { supabase } from "@/lib/supabase/server";
import { CreateMenuDto, Menu } from "@/types/menu";
import { CrawlingService } from "./crawling.service";

const isSameMenu = (menu1: Menu | CreateMenuDto, menu2: Menu | CreateMenuDto): boolean => {
  const date1 = menu1.date instanceof Date 
    ? menu1.date.toISOString().slice(0, 10)
    : new Date(menu1.date).toISOString().slice(0, 10);
  const date2 = menu2.date instanceof Date 
    ? menu2.date.toISOString().slice(0, 10)
    : new Date(menu2.date).toISOString().slice(0, 10);
  
  return menu1.name === menu2.name && date1 === date2;
};

export class MenuService {
  async findAll(date: Date): Promise<Menu[]> {
    const dateStr = date.toISOString().slice(0, 10);
    const { data, error } = await supabase
      .from("menus")
      .select("*")
      .eq("date", dateStr);

    if (error) {
      throw new Error(`Failed to fetch menus: ${error.message}`);
    }

    return (data || []).map((menu: any) => ({
      id: menu.id,
      name: menu.name,
      description: menu.description,
      calories: menu.calories,
      mealType: menu.meal_type,
      imageUrl: menu.image_url,
      isLunchBox: menu.is_lunch_box,
      date: new Date(menu.date),
      createdAt: menu.created_at ? new Date(menu.created_at) : undefined,
      updatedAt: menu.updated_at ? new Date(menu.updated_at) : undefined,
    })) as Menu[];
  }

  async createMenu(menu: CreateMenuDto): Promise<Menu> {
    const { data, error } = await supabase
      .from("menus")
      .insert({
        name: menu.name,
        description: menu.description,
        calories: menu.calories,
        meal_type: menu.mealType,
        image_url: menu.imageUrl,
        is_lunch_box: menu.isLunchBox || false,
        date: menu.date.toISOString().slice(0, 10),
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create menu: ${error.message}`);
    }

    return {
      ...data,
      date: new Date(data.date),
      mealType: data.meal_type as any,
      imageUrl: data.image_url,
      isLunchBox: data.is_lunch_box,
      createdAt: data.created_at ? new Date(data.created_at) : undefined,
      updatedAt: data.updated_at ? new Date(data.updated_at) : undefined,
    } as Menu;
  }

  async updateMenu(
    menu: Menu,
    updateData: Partial<CreateMenuDto>
  ): Promise<Menu> {
    const { data, error } = await supabase
      .from("menus")
      .update({
        name: updateData.name,
        description: updateData.description,
        calories: updateData.calories,
        meal_type: updateData.mealType,
        image_url: updateData.imageUrl,
        is_lunch_box: updateData.isLunchBox,
        date: updateData.date?.toISOString().slice(0, 10),
      })
      .eq("id", menu.id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update menu: ${error.message}`);
    }

    return {
      ...data,
      date: new Date(data.date),
      mealType: data.meal_type as any,
      imageUrl: data.image_url,
      isLunchBox: data.is_lunch_box,
      createdAt: data.created_at ? new Date(data.created_at) : undefined,
      updatedAt: data.updated_at ? new Date(data.updated_at) : undefined,
    } as Menu;
  }

  async deleteMenuByNameAndDate(name: string, date: string): Promise<void> {
    const dateStr = new Date(date).toISOString().slice(0, 10);
    const { error } = await supabase
      .from("menus")
      .delete()
      .eq("name", name)
      .eq("date", dateStr);

    if (error) {
      throw new Error(`Failed to delete menu: ${error.message}`);
    }
  }
}

export async function crawlAndSaveMenus(): Promise<{
  success: boolean;
  message: string;
  stats?: {
    datesProcessed: number;
    menusCreated: number;
    menusUpdated: number;
    menusDeleted: number;
  };
  menus?: Array<{
    name: string;
    description: string;
    calories: number;
    mealType: string;
    imageUrl: string | null;
    isLunchBox: boolean;
    date: string;
  }>;
  error?: string;
}> {
  try {
    const crawlingService = new CrawlingService();
    const menuService = new MenuService();

    const dates = await crawlingService.getPossibleDates();
    let menusCreated = 0;
    let menusUpdated = 0;
    let menusDeleted = 0;
    const allCrawledMenus: Array<{
      name: string;
      description: string;
      calories: number;
      mealType: string;
      imageUrl: string | null;
      isLunchBox: boolean;
      date: string;
    }> = [];

    for (const date of dates) {
      const duplicatedMenus = await crawlingService.getMenus(date);
      const menuSet = new Set(
        duplicatedMenus.map((menu) => JSON.stringify(menu))
      );

      const menus = Array.from(menuSet).map((menu) => {
        const parsed = JSON.parse(menu);
        // Date 객체 복원
        return {
          ...parsed,
          date: new Date(parsed.date),
        };
      }) as CreateMenuDto[];

      const previousMenus = await menuService.findAll(new Date(date));

      // 새로 생성할 메뉴
      const createMenus = menus.filter(
        (menu) => !previousMenus.find((m) => isSameMenu(m, menu))
      );
      for (const menu of createMenus) {
        try {
          await menuService.createMenu(menu);
          menusCreated++;
        } catch (error: any) {
          // 중복 키 에러는 무시 (이미 존재하는 메뉴)
          if (error?.message?.includes('duplicate key')) {
            // 이미 존재하므로 업데이트로 처리
            const existingMenu = previousMenus.find((m) => isSameMenu(m, menu));
            if (existingMenu) {
              await menuService.updateMenu(existingMenu, menu);
              menusUpdated++;
            }
          } else {
            throw error;
          }
        }
      }

      // 업데이트할 메뉴
      const updateMenus = previousMenus.filter((menu) =>
        menus.find((m) => isSameMenu(m, menu))
      );
      for (const menu of updateMenus) {
        const updateData = menus.find((m) => isSameMenu(m, menu));
        if (updateData) {
          await menuService.updateMenu(menu, updateData);
          menusUpdated++;
        }
      }

      // 삭제할 메뉴
      const deleteMenus = previousMenus.filter(
        (menu) => !menus.find((m) => isSameMenu(m, menu))
      );
      for (const menu of deleteMenus) {
        const dateToDelete = menu.date instanceof Date 
          ? menu.date.toISOString().slice(0, 10)
          : new Date(menu.date).toISOString().slice(0, 10);
        await menuService.deleteMenuByNameAndDate(
          menu.name,
          dateToDelete
        );
        menusDeleted++;
      }

      // 크롤링한 메뉴를 JSON 형식으로 수집
      menus.forEach((menu) => {
        allCrawledMenus.push({
          name: menu.name,
          description: menu.description,
          calories: menu.calories,
          mealType: menu.mealType,
          imageUrl: menu.imageUrl || null,
          isLunchBox: menu.isLunchBox || false,
          date: menu.date instanceof Date 
            ? menu.date.toISOString().slice(0, 10)
            : new Date(menu.date).toISOString().slice(0, 10),
        });
      });
    }

    return {
      success: true,
      message: "크롤링이 성공적으로 완료되었습니다.",
      stats: {
        datesProcessed: dates.length,
        menusCreated,
        menusUpdated,
        menusDeleted,
      },
      menus: allCrawledMenus,
    };
  } catch (error) {
    return {
      success: false,
      message: "크롤링 중 오류가 발생했습니다.",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
