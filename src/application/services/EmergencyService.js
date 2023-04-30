"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmergencyService = void 0;
const MySQLUserRepository_1 = require("../../infrastructure/repositories/MySQLUserRepository");
const MySQLFoodRepository_1 = require("../../infrastructure/repositories/MySQLFoodRepository");
const FoodService_1 = require("../../application/services/FoodService");
const UserService_1 = require("../../application/services/UserService");
class EmergencyService {
    constructor() {
        this.userService = new UserService_1.UserService(new MySQLUserRepository_1.MySQLUserRepository());
        this.foodService = new FoodService_1.FoodService(new MySQLFoodRepository_1.MySqlFoodRepository());
    }
    getAll(token, ind) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userService.getToken(token);
            if (user !== null) {
                const min = user.hipo;
                const max = user.hyper;
                const obje = user.estable;
                if (ind < min) {
                    const food = yield this.foodService.getAll();
                    const filteredFood = food.filter((foodItem) => {
                        return foodItem.tag == "drink" && foodItem.carbs <= 30 && foodItem.cant_servicio > 100;
                    });
                    return {
                        status: 200,
                        body: {
                            state: 0,
                            message: 'Tienes hipoglucemia',
                            food: filteredFood
                        }
                    };
                }
                else if (ind >= min && ind <= max) {
                    return {
                        status: 200,
                        body: {
                            state: 1,
                            message: 'Tus niveles son normales',
                        }
                    };
                }
                else if (ind > max) {
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
        });
    }
}
exports.EmergencyService = EmergencyService;
