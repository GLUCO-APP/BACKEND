import { Food } from "../entities/Food";
import { Plate_x_Food } from "../entities/pl_x_food";
export interface FoodRepository{
    getall():Promise<Food[]>;
    getbyid(id:number):Promise<Plate_x_Food[]>;
    getbyplate(ids:Number[]):Promise<Food[]>
}