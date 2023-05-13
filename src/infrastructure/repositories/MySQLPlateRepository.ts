import { PlateRepository } from "../../domain/repositories/PlateRepository";
import { RowDataPacket } from 'mysql2';
import mysql from 'mysql2/promise';
import { Plate } from "../../domain/entities/Plate";
import dbGluko from "../database/dbconfig"
import { trdata } from "../../domain/entities/trdata";

export class MySQLPlateRepository implements PlateRepository {
  async publicPlates(): Promise<Plate[]> {
    const cnx = await dbGluko.getConnection();
    try {
      const [rows, fields] = await cnx.execute(
        'SELECT * FROM gluko.Plate where public_plate = 1;'
      );
      return rows as Plate[]
    } catch (err: any) {
      await cnx.query('ROLLBACK');
      throw err;
    } finally {
      cnx.release();
    }
  }

  async training_data(token: string): Promise<trdata[]> {
    const cnx = await dbGluko.getConnection();
    try {
      const [rows, fields] = await cnx.execute(
        'SELECT p.Carbohydrates, p.Proteins, p.Fats, p.sugarEstimate as Sugar FROM Plate p JOIN Report r ON r.id_plato = p.id WHERE r.token = ?',
        [token]
      );
      return rows as trdata[]
    } catch (err: any) {
      await cnx.query('ROLLBACK');
      throw err;
    } finally {
      cnx.release();
    }
  }
  async add(plate: Plate): Promise<Plate> {
    const cnx = await dbGluko.getConnection();
    try {
      await cnx.beginTransaction();

      // Insertar el nuevo plato en la tabla Plate


      const [result] = await cnx.query(
        'INSERT INTO Plate (sugarEstimate, latitude, longitude, address, Carbohydrates, Proteins, Fats, descript, Title, date,type,public_plate ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?);',
        [plate.sugarEstimate, plate.latitude, plate.longitude, plate.address, plate.Carbohydrates, plate.Proteins, plate.Fats, plate.Description, plate.Title, plate.date, plate.type, plate.public_plate]
      );


      const id = (result as mysql.OkPacket).insertId;


      const newPlate = {
        id: id,
        sugarEstimate: plate.sugarEstimate,
        latitude: plate.latitude,
        longitude: plate.longitude,
        address: plate.address,
        foods: plate.foods,
        Carbohydrates: plate.Carbohydrates,
        Proteins: plate.Proteins,
        Fats: plate.Fats,
        Description: plate.Description,
        Title: plate.Title,
        date: plate.date,
        type: plate.type,
        public_plate: plate.public_plate
      };

      // Insertar los registros correspondientes en la tabla Plate_x_Food
      for (const food of plate.foods) {
        const [rows]= await cnx.execute(
          'SELECT * FROM Plate_x_Food WHERE plate_id = ? AND food_id = ?;',
          [id, food.id]
        );
        if ((rows as RowDataPacket[]).length == 0){
          await cnx.execute(
            'INSERT INTO Plate_x_Food (plate_id, food_id) VALUES (?, ?);',
            [id, food.id]
          );
        }else{
          await cnx.execute(
            'UPDATE Plate_x_Food SET cantidad = cantidad + 1 WHERE plate_id = ? AND food_id = ?;',
            [id, food.id]
          );
        }
      
      }

      await cnx.query('COMMIT');
      return newPlate;
    } catch (err: any) {
      await cnx.query('ROLLBACK');
      throw err;
    } finally {
      cnx.release();
    }
  }

  }
