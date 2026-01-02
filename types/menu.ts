export enum MealType {
  LUNCH = 'lunch',
  DINNER = 'dinner',
}

export interface CreateMenuDto {
  name: string;
  description: string;
  calories: number;
  mealType: MealType;
  imageUrl?: string | null;
  isLunchBox?: boolean;
  date: Date;
}

export interface Menu {
  id?: string;
  name: string;
  description: string;
  calories: number;
  mealType: MealType;
  imageUrl?: string | null;
  isLunchBox?: boolean;
  date: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

