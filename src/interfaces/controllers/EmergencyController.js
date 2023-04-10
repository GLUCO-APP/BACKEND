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
exports.EmergencyController = void 0;
const axios = require('axios');
class EmergencyController {
    getBarCode(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const codeBar = req.params.code;
            const apiUrl = 'https://world.openfoodfacts.org/api/v2/product/';
            const url = apiUrl + codeBar;
            try {
                const response = yield axios.get(url);
                const data = response.data;
                const nutriments = data.product.nutriments;
                const productName = data.product.product_name;
                const protein = nutriments.proteins_value;
                const carbohydrates = nutriments.carbohydrates_value;
                const fat = nutriments.fat_value;
                const jsonResponse = { productName, protein, carbohydrates, fat };
                res.status(200).send(jsonResponse);
            }
            catch (error) {
                res.status(400).send('Producto no encontrado');
            }
        });
    }
}
exports.EmergencyController = EmergencyController;
