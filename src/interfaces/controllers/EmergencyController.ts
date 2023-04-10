import { Request,Response } from "express";
const axios = require('axios');

export class EmergencyController {

    public async getBarCode(req: Request,res:Response):Promise<void>{
        
        const codeBar = req.params.code;
        const apiUrl = 'https://world.openfoodfacts.org/api/v2/product/';
        const url = apiUrl + codeBar;

        try {
            const response = await axios.get(url);
            const data = response.data;
            const nutriments = data.product.nutriments;
            const productName = data.product.product_name; 


            const protein = nutriments.proteins_value;
            const carbohydrates = nutriments.carbohydrates_value;
            const fat = nutriments.fat_value;
            const jsonResponse = { productName, protein, carbohydrates , fat };
            

            res.status(200).send(jsonResponse); 
          } catch (error) {
            
            res.status(400).send('Producto no encontrado');
          }
    }

}