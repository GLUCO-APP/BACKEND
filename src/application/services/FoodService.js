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
exports.FoodService = void 0;
const Food_1 = require("../../domain/entities/Food");
const axios = require('axios');
class FoodService {
    constructor(foodRepository) {
        this.foodRespository = foodRepository;
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.foodRespository.getall();
        });
    }
    addFood(food) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.foodRespository.add(food);
        });
    }
    addFoodCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiUrl = 'https://world.openfoodfacts.org/api/v2/product/';
            const url = apiUrl + code;
            try {
                const response = yield axios.get(url);
                const data = response.data;
                let cant_servicio;
                const productName = data.product.product_name;
                if ('serving_quantity' in data.product) {
                    cant_servicio = data.product.serving_quantity;
                }
                else {
                    cant_servicio = 100;
                }
                const nutriments = data.product.nutriments;
                const image = "atun.png";
                const protein = (cant_servicio / 100) * (nutriments.proteins_value);
                const carbohydrates = (cant_servicio / 100) * nutriments.carbohydrates_value;
                const fat = (cant_servicio / 100) * nutriments.fat_value;
                const foodData = new Food_1.Food(productName, carbohydrates, protein, fat, image, cant_servicio);
                const food = yield this.foodRespository.add(foodData);
                return food;
            }
            catch (error) {
                throw new Error(`Error al procesar la solicitud`);
            }
        });
    }
}
exports.FoodService = FoodService;
