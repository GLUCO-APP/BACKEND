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
exports.FoodController = void 0;
const MySQLFoodRepository_1 = require("../../infrastructure/repositories/MySQLFoodRepository");
const FoodService_1 = require("../../application/services/FoodService");
class FoodController {
    constructor() {
        this.foodService = new FoodService_1.FoodService(new MySQLFoodRepository_1.MySqlFoodRepository());
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const foods = yield this.foodService.getAll();
                res.status(200).json({ success: true, data: foods });
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Something went wrong' });
            }
        });
    }
    addFoodCode(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const codeBar = req.params.code;
            try {
                const foods = yield this.foodService.addFoodCode(codeBar);
                res.status(200).json(foods);
            }
            catch (err) {
                console.error(err);
                res.status(500).send('Producto no encontrado');
            }
        });
    }
}
exports.FoodController = FoodController;
