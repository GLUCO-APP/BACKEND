import { MySqlFoodRepository } from "../../infrastructure/repositories/MySQLFoodRepository";
import {FoodService} from "../../application/services/FoodService"
import { Request, Response } from 'express';
import { Food } from "../../domain/entities/Food";

export class FoodController {
        private foodService:FoodService;

        constructor(){
            this.foodService = new FoodService(new MySqlFoodRepository());
        }
        
        public async getAll(req: Request,res:Response):Promise<void>{
            try{
                const foods = await this.foodService.getAll();

                res.status(200).json({ success: true, data: foods});
            }catch(err){
                console.error(err); 
                res.status(500).json({ error: 'Something went wrong' });
            }
        }


}