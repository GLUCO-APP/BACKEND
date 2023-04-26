import { Plate } from "../entities/Plate";
import { trdata } from "../entities/trdata";

export interface PlateRepository {
    add(Plate: Plate):Promise<Plate>;
    training_data(token:string):Promise<trdata[]>;
    publicPlates():Promise<Plate[]>;
}
