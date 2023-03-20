import { PlateRepository } from "../../domain/repositories/PlateRepository";
import { RowDataPacket } from 'mysql2';
import mysql from 'mysql2/promise';
import { Plate } from "../../domain/entities/Plate";
import dbGluko from "../database/dbconfig"

export class MySQLPlateRepository implements PlateRepository{
  async add(plate: Plate): Promise<Plate> {
  const cnx = await dbGluko.getConnection();
  try {
    await cnx.beginTransaction();
    
    // Insertar el nuevo plato en la tabla Plate

    const [result] = await cnx.query(
      'INSERT INTO Plate (sugarEstimate, latitude, longitude, address) VALUES (?,?,?,?);',
      [plate.sugarEstimate, plate.latitude, plate.longitude, plate.address]
    );


    const id = (result as mysql.OkPacket).insertId;
    
    const newPlate: Plate = {
      id: id,
      sugarEstimate: plate.sugarEstimate,
      latitude: plate.latitude,
      longitude: plate.longitude,
      address: plate.address,
      foods: plate.foods,
    };

    // Insertar los registros correspondientes en la tabla Plate_x_Food
    for (const food of plate.foods) {
      await cnx.execute(
        'INSERT INTO Plate_x_Food (plate_id, food_id) VALUES (?, ?);',
        [id, food.id]
      );
    }

    await cnx.query('COMMIT');
    return newPlate;
  } catch (err:any) {
    await cnx.query('ROLLBACK');
    throw err;
  } finally {
    cnx.release();
  }
}

    
      
}
  