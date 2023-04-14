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
exports.EmergencyContoller = void 0;
const MySQLUserRepository_1 = require("../../infrastructure/repositories/MySQLUserRepository");
const UserService_1 = require("../../application/services/UserService");
const MySQLFoodRepository_1 = require("../../infrastructure/repositories/MySQLFoodRepository");
const FoodService_1 = require("../../application/services/FoodService");
class EmergencyContoller {
    constructor() {
        this.userService = new UserService_1.UserService(new MySQLUserRepository_1.MySQLUserRepository());
        this.foodService = new FoodService_1.FoodService(new MySQLFoodRepository_1.MySqlFoodRepository());
    }
    getFood(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.params.token;
            const ind = parseInt(req.params.ind);
            const user = yield this.userService.getToken(token);
            console.log(user);
            if (user !== null) {
                const min = user.hipo;
                const max = user.hyper;
                const obje = user.estable;
                if (ind < min) {
                    const food = yield this.foodService.getAll();
                    const filteredFood = food.filter((foodItem) => {
                        return foodItem.carbs < 30;
                    });
                    res.status(200).json({
                        state: 0,
                        message: 'Tienes hipoglucemia',
                        food: filteredFood
                    });
                }
                else if (ind >= min && ind <= max) {
                    res.status(200).json({
                        state: 1,
                        message: 'Tus niveles son normales',
                    });
                }
                else if (ind > max) {
                    const correcion = Math.abs((obje - ind) / user.sensitivity);
                    res.status(200).json({
                        state: 2,
                        message: 'Tienes hiperglucemia',
                        correcion: correcion
                    });
                }
            }
            else {
                res.status(404).json({
                    message: 'Usuario no encontrado',
                });
            }
        });
    }
}
exports.EmergencyContoller = EmergencyContoller;
