import { Food } from "../entities/Food";
export interface FoodRepository{
    getall():Promise<Food[]>;
}