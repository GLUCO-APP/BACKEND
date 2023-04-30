import { Food } from "../../domain/entities/Food";
import { FoodRepository } from "../../domain/repositories/FoodRepository";
import dbGluko from "../database/dbconfig"
import mysql from 'mysql2/promise';
import { RowDataPacket } from 'mysql2';
import { Plate_x_Food } from "../../domain/entities/pl_x_food";




export class MySqlFoodRepository implements FoodRepository {
    async getbyplate(ids: Number[]): Promise<Food[]> {
        const cnx = await dbGluko.getConnection();
        try{
            const placeholders = ids.map(() => '?').join(',');
            const query = `SELECT * FROM Food WHERE id IN (${placeholders})`;
            const result = await cnx.query(query, ids);

            return result[0] as Food[]
        }finally {
            cnx.release();
        }
        
    }
    async getbyid(id:number): Promise<Plate_x_Food[]> {
        const cnx = await dbGluko.getConnection();
        try {
            const [rows, fields] = await cnx.execute(
                'SELECT * FROM gluko.Plate_x_Food where plate_id = ?;',
                [id]
              );
              return rows as Plate_x_Food[]
              
        } finally {
            cnx.release();
        }
    }
    async getall(): Promise<Food[]> {
        const cnx = await dbGluko.getConnection();
        try {
            await cnx.beginTransaction();

            const [rows] = await cnx.query('SELECT * FROM Food');
            return rows as Food[];
        } finally {
            cnx.release();
        }
    }

    async updateFood(food: Food): Promise<Food> {
        const cnx = await dbGluko.getConnection();
        try {
            await cnx.beginTransaction();
            const value = (food.cant_servicio / 100);

            food.carbs = value * food.carbs ;
            food.protein = (value * food.protein);
            food.fats = (value * food.fats);

            const [result] = await cnx.query(
                'UPDATE Food SET carbs=?, protein=?, fats=?, image=?,tag=? , cant_servicio=? WHERE name=?;',
                [food.carbs, food.protein, food.fats, food.image, food.tag , food.cant_servicio, food.name]
            );
            const affectedRows = (result as mysql.OkPacket).affectedRows;

            if (affectedRows === 0) {
                // Si no se actualizó ningún alimento, lanzamos un error
                throw new Error(`No se pudo encontrar el alimento ${food.name}`);
            }

            const updatedFood: Food = {
                name: food.name,
                carbs: food.carbs,
                protein: food.protein,
                fats: food.fats,
                image: food.image,
                id: food.id,
                tag: food.tag,
                cant_servicio: food.cant_servicio,
                getData() {
                    return {
                        name: this.name,
                        carbs: this.carbs,
                        protein: this.protein,
                        fats: this.fats,
                        image: this.image,
                        id: this.id,
                        tag : this.tag,
                        cant_servicio: this.cant_servicio,
                    };
                },
            };

            await cnx.query('COMMIT');
            return updatedFood;

        } catch (err) {
            await cnx.query('ROLLBACK');
            throw err;
        } finally {
            cnx.release();
        }
    }



    async add(food: Food): Promise<Food> {
        const cnx = await dbGluko.getConnection();
        try {
            await cnx.beginTransaction();
            const [rows] = await cnx.query(
                'SELECT * FROM Food WHERE name = ?;',
                [food.name]
            ) as RowDataPacket[];

            if (rows.length > 0) {
                // Si el alimento ya existe, se devuelve el objeto Food sin guardar en la base de datos

                let existingFood: Food = {
                    name: rows[0].name,
                    carbs: rows[0].carbs,
                    protein: rows[0].protein,
                    fats: rows[0].fats,
                    image: rows[0].image,
                    id: rows[0].id,
                    cant_servicio: rows[0].cant_servicio,
                    tag :rows[0].tag,
                    getData() {
                        return {
                            name: this.name,
                            carbs: this.carbs,
                            protein: this.protein,
                            fats: this.fats,
                            image: this.image,
                            id: this.id,
                            cant_servicio: this.cant_servicio,
                            tag: this.tag,
                        };
                    },
                };
                await cnx.query('COMMIT');

                if (existingFood.cant_servicio != 100 && food.carbs == existingFood.carbs) {
                    try {
                        existingFood = await this.updateFood(existingFood);
                        return existingFood;
                    } catch (error) {
                        console.log(`No se encontró ningún alimento con el nombre ${food.name}`);
                    }
                }

                return existingFood;
            }

            const [result] = await cnx.query(
                'INSERT INTO Food (name, carbs, protein, fats, image , tag , cant_servicio) VALUES (?, ?, ?, ?, ? , "snack" , ?);',
                [food.name, food.carbs, food.protein, food.fats, food.image, food.cant_servicio]
            );
            const id = (result as mysql.OkPacket).insertId;
            const newFood: Food = {
                name: food.name,
                carbs: food.carbs,
                protein: food.protein,
                fats: food.fats,
                image: food.image,
                id: id,
                cant_servicio: food.cant_servicio,
                tag : food.tag,
                getData() {
                    return {
                        name: this.name,
                        carbs: this.carbs,
                        protein: this.protein,
                        fats: this.fats,
                        image: this.image,
                        id: this.id,
                        cant_servicio: this.cant_servicio,
                        tag : this.tag,
                    };
                },
            };
            await cnx.query('COMMIT');
            return newFood;
        } catch (err) {
            await cnx.query('ROLLBACK');
            throw err;
        } finally {
            cnx.release();
        }
    }



}