import { MySQLPlateRepository } from "../../infrastructure/repositories/MySQLPlateRepository";
import { Plate } from "../../domain/entities/Plate";

export class PlateService {

    private plateRepository: MySQLPlateRepository;

    constructor(plateRepository:MySQLPlateRepository){
        this.plateRepository = plateRepository;
    }

    public async addPlate(plate:Plate):Promise<Plate> {
        return this.plateRepository.add(plate);
    }
}