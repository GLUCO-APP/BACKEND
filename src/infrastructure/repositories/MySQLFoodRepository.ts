import { Food } from "../../domain/entities/Food";
import { FoodRepository } from "../../domain/repositories/FoodRepository";



export class MySqlFoodRepository implements FoodRepository{
    getall(): Promise<Food[]> {
        throw new Error("Method not implemented.");
    }
    
}