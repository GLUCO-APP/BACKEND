import { Food } from "../../domain/entities/Food";
import { Plate_x_Food } from "../../domain/entities/pl_x_food";
import { MySqlFoodRepository } from "../../infrastructure/repositories/MySQLFoodRepository";

const axios = require('axios');
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
    public async addFoodCode(code: String):Promise<Food | null> {
        const apiUrl = 'https://world.openfoodfacts.org/api/v2/product/';
        const url = apiUrl + code;
        try {
            const response = await axios.get(url);
            const data = response.data;
            let cant_servicio;
            const productName = data.product.product_name;
            if ('serving_quantity' in data.product) {
                cant_servicio = data.product.serving_quantity;
            } else {
                cant_servicio = 100; 
            }
            const nutriments = data.product.nutriments;
            const image = "atun.png"
            const protein = (cant_servicio/100)*(nutriments.proteins_value);
            const carbohydrates = (cant_servicio/100)*nutriments.carbohydrates_value;
            const fat = (cant_servicio/100)*nutriments.fat_value;
            const foodData: Food = new Food(productName, carbohydrates, protein, fat, image, cant_servicio);  
            const food = await this.foodRespository.add(foodData);
            return food;
            
        } catch (error) {
            throw new Error(`Error al procesar la solicitud`);
        }
    }
    public async getbyid(id:number):Promise<Plate_x_Food[]>{
        return this.foodRespository.getbyid(id);
    }
    public async getbyplate(ids:Number[]):Promise<Food[]>{
        return this.foodRespository.getbyplate(ids);
    }

}