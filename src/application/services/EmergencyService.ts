import { MySQLUserRepository } from "../../infrastructure/repositories/MySQLUserRepository";
import { MySqlFoodRepository } from "../../infrastructure/repositories/MySQLFoodRepository";
import { FoodService } from "../../application/services/FoodService"
import { UserService } from "../../application/services/UserService";
import { Food } from "../../domain/entities/Food";

export class EmergencyService {

    private userService: UserService;
    private foodService: FoodService;

    constructor() {
        this.userService = new UserService(new MySQLUserRepository());
        this.foodService = new FoodService(new MySqlFoodRepository());

    }

    public async getAll(token: string, ind: number): Promise<{ status: number, body: any }> {

        const user = await this.userService.getToken(token);

        if (user !== null) {
            const min = user.hipo;
            const max = user.hyper;
            const obje = user.estable;
            if (ind < min) {
                const food = await this.foodService.getAll();
                const filteredFood = food.filter((foodItem) => {
                    return foodItem.tag == "drink"  && foodItem.carbs<= 30 && foodItem.cant_servicio > 100;
                });
                return {
                    status: 200,
                    body: {
                        state: 0,
                        message: 'Tienes hipoglucemia',
                        food: filteredFood
                    }
                };
            } else if (ind >= min && ind <= max) {
                return {
                    status: 200,
                    body: {
                        state: 1,
                        message: 'Tus niveles son normales',
                    }
                };
            } else if (ind > max) {
                const correcion = Math.abs((obje - ind) / user.sensitivity);
                return {
                    status: 200,
                    body: {
                        state: 2,
                        message: 'Tienes hiperglucemia',
                        correcion: correcion
                    }
                };
            }
        }
        return {
            status: 404,
            body: {
                message: 'Usuario no encontrado'
            }
        };
    }



}