import { Food } from "../../domain/entities/Food";
import { FoodRepository } from "../../domain/repositories/FoodRepository";
import dbGluko from "../database/dbconfig" 



export class MySqlFoodRepository implements FoodRepository{
    async getall(): Promise<Food[]> {
        const cnx = await dbGluko.getConnection();
        try{
            await cnx.beginTransaction();

            const [rows] = await cnx.query('SELECT * FROM Food');
            return rows as Food[];
        } finally {
            cnx.release();
        }
    }
    
}