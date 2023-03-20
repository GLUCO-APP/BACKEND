import { Plate } from "../entities/Plate";

export interface PlateRepository {
    add(Plate: Plate):Promise<Plate>;
}
