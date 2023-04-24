import { MySqlFoodRepository } from "../../infrastructure/repositories/MySQLFoodRepository";
import { FoodService } from "../../application/services/FoodService"
import { Request, Response } from 'express';
import { Food } from "../../domain/entities/Food";
const axios = require('axios');

export class FoodController {
    private foodService: FoodService;

    constructor() {
        this.foodService = new FoodService(new MySqlFoodRepository());
    }

    public async getAll(req: Request, res: Response): Promise<void> {
        try {
            const foods = await this.foodService.getAll();

            res.status(200).json({ success: true, data: foods });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Something went wrong' });
        }
    }

    public async addFoodCode(req: Request, res: Response): Promise<void> {

        const codeBar = req.params.code;
        const apiUrl = 'https://world.openfoodfacts.org/api/v2/product/';
        const url = apiUrl + codeBar;

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
            
            const food = await this.foodService.addFood(foodData);
            res.status(201).json(food);
        } catch (error) {

            res.status(400).send('Producto no encontrado');
        }
    }


}