import { Food } from "../../domain/entities/Food";
import { FoodRepository } from "../../domain/repositories/FoodRepository";
import dbGluko from "../database/dbconfig" 
import mysql from 'mysql2/promise';
import { RowDataPacket } from 'mysql2';




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
              const existingFood: Food = {
                  name: rows[0].name,
                  carbs: rows[0].carbs,
                  protein: rows[0].protein,
                  fats: rows[0].fats,
                  image: rows[0].image,
                  id: rows[0].id,
                  getData() {
                      return {
                          name: this.name,
                          carbs: this.carbs,
                          protein: this.protein,
                          fats: this.fats,
                          image: this.image,
                          id: this.id,
                      };
                  },
              };
              await cnx.query('COMMIT');
              return existingFood;
          }
  
          const [result] = await cnx.query(
              'INSERT INTO Food (name, carbs, protein, fats, image) VALUES (?, ?, ?, ?, ?);',
              [food.name, food.carbs, food.protein, food.fats, food.image]
          );
  
          const id = (result as mysql.OkPacket).insertId;
  
          const newFood: Food = {
              name: food.name,
              carbs: food.carbs,
              protein: food.protein,
              fats: food.fats,
              image: food.image,
              id: id,
              getData() {
                  return {
                      name: this.name,
                      carbs: this.carbs,
                      protein: this.protein,
                      fats: this.fats,
                      image: this.image,
                      id: this.id,
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