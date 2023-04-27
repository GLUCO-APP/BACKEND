import { Food } from "../../domain/entities/Food";
import { Plate_x_Food } from "../../domain/entities/pl_x_food";
import { MySqlFoodRepository } from "../../infrastructure/repositories/MySQLFoodRepository";

export class FoodService {

    private foodRespository: MySqlFoodRepository;

    constructor(foodRepository:MySqlFoodRepository){
        this.foodRespository = foodRepository;
    }
    
    public async getAll():Promise<Food[]> {
        return this.foodRespository.getall();
    }

    public async addFood(food:Food):Promise<Food> {
        return this.foodRespository.add(food);
    }

    public async getbyid(id:number):Promise<Plate_x_Food[]>{
        return this.foodRespository.getbyid(id);
    }

    public async getbyplate(ids:Number[]):Promise<Food[]>{
        return this.foodRespository.getbyplate(ids);
    }
    
}