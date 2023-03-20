import { Food } from "../../domain/entities/Food";
import { MySqlFoodRepository } from "../../infrastructure/repositories/MySQLFoodRepository";

export class FoodService {

    private foodRespository: MySqlFoodRepository;

    constructor(foodRepository:MySqlFoodRepository){
        this.foodRespository = foodRepository;
    }
    
    public async getAll():Promise<Food[]> {
        return this.foodRespository.getall();
    }
}