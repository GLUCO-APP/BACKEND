import { Request,Response } from "express";
import { MySQLUserRepository } from "../../infrastructure/repositories/MySQLUserRepository";
import { UserService } from "../../application/services/UserService";
import { MySqlFoodRepository } from "../../infrastructure/repositories/MySQLFoodRepository";
import {FoodService} from "../../application/services/FoodService"
import { abs } from "@tensorflow/tfjs";


export class EmergencyContoller {

    private userService: UserService;
    private foodService:FoodService;
    
    constructor(){
        this.userService = new UserService(new MySQLUserRepository());
        this.foodService = new FoodService(new MySqlFoodRepository());
    }

    public async getFood(req: Request, res: Response): Promise<void> {
        const token = req.params.token;
        const ind = parseInt(req.params.ind);

        const user = await this.userService.getToken(token);
        console.log(user)


        if (user !== null) {
            

            const min = user.hipo;
            const max = user.hyper;
            const obje = user.estable;
            


            if (ind < min) {
                const food = await this.foodService.getAll();
                const filteredFood = food.filter((foodItem) => {
                    return foodItem.carbs < 30;
                });
                res.status(200).json({
                    state: 0,
                    message: 'Tienes hipoglucemia',
                    food : filteredFood
                    
                });     
            } else if (ind >= min && ind <= max) {
                res.status(200).json({
                    state: 1,
                    message: 'Tus niveles son normales',
                });     
            } else if (ind > max) {
                
                const correcion = Math.abs((obje - ind) / user.sensitivity);
                res.status(200).json({
                    state: 2,
                    message: 'Tienes hiperglucemia',
                    correcion: correcion
                });
            }
        } else {
            res.status(404).json({
                
                message: 'Usuario no encontrado',
            });
        }
    }

}