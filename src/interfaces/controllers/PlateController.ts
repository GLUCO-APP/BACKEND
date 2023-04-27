import { Request,Response } from "express";
import { PlateService } from "../../application/services/PlateService";
import { FoodService } from "../../application/services/FoodService";
import { Plate } from "../../domain/entities/Plate";
import { MySQLPlateRepository } from "../../infrastructure/repositories/MySQLPlateRepository";
import { MySqlFoodRepository } from "../../infrastructure/repositories/MySQLFoodRepository";

export class PlateController {
    private plateService: PlateService;
    private foodService: FoodService;
    


    constructor(){
        this.plateService = new PlateService(new MySQLPlateRepository());
        this.foodService = new FoodService(new MySqlFoodRepository());
    }
  


    public async addPlate(req: Request, res:Response):Promise<void>{
        try{
            const fechac = new Date();
            const { foods, sugarEstimate, latitude, longitude, address, Carbohydrates, Proteins, Fats, Description, Title, type, public_plate} = req.body;
            const plateData: Plate = new Plate(foods, sugarEstimate, latitude, longitude, address, Carbohydrates, Proteins, Fats, Description, Title,fechac,type,public_plate);
            const plate = await this.plateService.addPlate(plateData);
            res.status(201).json(plate)
        }catch (err:any){
            res.status(400).send(err.message)
        }
    
    }
    public async trainTest(req: Request, res:Response):Promise<void>{
        try{
            const token = req.params.token;
            const recPlates = await this.plateService.trainModel(token);
            const platesJSON = recPlates.map((plate) => JSON.parse(JSON.stringify(plate)));
            const plateWithFood = await Promise.all( platesJSON.map(async (plateJSON) => {
                const plate_x_food = await this.foodService.getbyid(plateJSON.id);
                //console.log(plate_x_food)
                const foodIds = (await plate_x_food).map((pxf) => pxf.food_id)
                const foods = await this.foodService.getbyplate(foodIds)
                //console.log(foods)
                return await {
                    plateJSON,
                    foods: foods
                }
            }));
            console.log(plateWithFood)
            res.status(200).json( plateWithFood)
        }catch(err:any){
            res.status(400).send(err.message)
        }
    }
}