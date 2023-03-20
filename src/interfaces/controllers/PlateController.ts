import { Request,Response } from "express";
import { PlateService } from "../../application/services/PlateService";
import { Plate } from "../../domain/entities/Plate";
import { MySQLPlateRepository } from "../../infrastructure/repositories/MySQLPlateRepository";

export class PlateController {
    private plateService: PlateService;


    constructor(){
        this.plateService = new PlateService(new MySQLPlateRepository());
    }
  


    public async addPlate(req: Request, res:Response):Promise<void>{
        try{
            const {foods,sugarEstimate,latitude,longitude,address} = req.body;
            const plateData: Plate = new Plate(foods,sugarEstimate,latitude,longitude,address);
            const plate = await this.plateService.addPlate(plateData);
            res.status(201).json(plate)
        }catch (err:any){
            res.status(400).send(err.message)
        }
    
    }
}