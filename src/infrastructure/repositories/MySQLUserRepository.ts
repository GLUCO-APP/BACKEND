import { Usuario } from "../../domain/entities/User";
import { UserRepository } from "../../domain/repositories/UserRepository";
import dbGluko from "../database/dbconfig";
import mysql, { RowDataPacket } from 'mysql2/promise';
import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'


export class MySQLUserRepository implements UserRepository {
  
  async findEmail(email: string): Promise<Usuario | null> {
    const cnx = await dbGluko.getConnection()
    try {
      const [rows] = await cnx.execute(
        "SELECT * FROM usuarios WHERE email = ? LIMIT 1",
        [email]
      );
      const user = rows as Usuario[];
      if (user.length === 0) {
        return null;
      }
      return user[0];
    } finally {
      cnx.release();
    }

  }
  async updateToken(email: string, token:string):Promise<void>{
    const cnx = await dbGluko.getConnection()
    try{
        const [result] = await cnx.query(
          'UPDATE usuarios SET token = ? WHERE email = ?;',
          [token,email]
        );

    }finally {
      cnx.release();
    }

  }
  async add(usuario: Usuario): Promise<string> {
    const cnx = await dbGluko.getConnection()
    try {

      const salt = await bcrypt.genSalt(10);
      const hashedpass = await bcrypt.hash(usuario.password, salt);
      await cnx.beginTransaction();
      const [result] = await cnx.query(
        'INSERT INTO usuarios (nombre, email, password, fecha_nacimiento, fecha_diagnostico, edad, genero, peso, estatura, tipo_diabetes, tipo_terapia, hyper, estable, hipo, sensitivity, rate, precis, breakfast_start, breakfast_end, lunch_start, lunch_end, dinner_start, dinner_end, objective_carbs, physical_activity, info_adicional, token) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
        [usuario.nombre, usuario.email, hashedpass, usuario.fecha_nacimiento, usuario.fecha_diagnostico, usuario.edad, usuario.genero, usuario.peso, usuario.estatura, usuario.tipo_diabetes, usuario.tipo_terapia, usuario.hyper, usuario.estable, usuario.hipo, usuario.sensitivity, usuario.rate, usuario.precis, usuario.breakfast_start, usuario.breakfast_end, usuario.lunch_start, usuario.lunch_end, usuario.dinner_start, usuario.dinner_end, usuario.objective_carbs, usuario.physical_activity, usuario.info_adicional, "sin token"]
      );

      const id = (result as mysql.OkPacket).insertId;
      for (const insu of usuario.insulin) {
        await cnx.execute(
          'INSERT INTO user_x_insulin (user_id, insulin_id) VALUES (?, ?);',
          [id, insu.id]
        );
      }

      await cnx.query('COMMIT');
      return "Usuario creado";
    } catch (err: any) {
      await cnx.query('ROLLBACK');
      throw err;
    } finally {
      cnx.release();
    }
  }

  async getUser(idUser: string): Promise<Usuario> {
    const cnx = await dbGluko.getConnection();
    try {
      const [rows] = await cnx.execute(
        "SELECT * FROM usuarios WHERE id = ?",
        [idUser]
      );
      const user = rows as Usuario[];
      if (user.length === 0) {
        return user[0];
      }
      return user[0];
    } finally {
      cnx.release();
    }
  }

  async getToken(tkUser: string): Promise<Usuario | null> {
    let cnx;
    try {
      cnx = await dbGluko.getConnection();
      const [rows] = await cnx.execute(
        "SELECT * FROM usuarios WHERE token = ?",
        [tkUser]
      );
      const user = rows as Usuario[];
      if (user.length === 0) {
        return null;
      }
      return user[0];
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      if (cnx) {
        cnx.release();
      }
    }
  }

  async updateUser(usuario: Usuario, idUser: string): Promise<Usuario> {
    let cnx;
    try {
      cnx = await dbGluko.getConnection();
      const salt = await bcrypt.genSalt(10);
      const hashedpass = await bcrypt.hash(usuario.password, salt);
      const [rows] = await cnx.execute(
        "SELECT * FROM usuarios WHERE id = ?",
        [idUser]
      );
      const existingUser = rows as Usuario[];
      if (!existingUser) {
        throw new Error(`No se encontró un usuario con el ID ${idUser}`);
      }
      await cnx.execute(
        "UPDATE usuarios SET nombre = ?, email = ?, password = ?, fecha_nacimiento = ?, fecha_diagnostico = ?, edad = ?, genero = ?, peso = ?, estatura = ?, tipo_diabetes = ? , tipo_terapia = ? , hyper = ? , estable = ? , hipo = ? , sensitivity = ? , rate = ?, precis = ? , breakfast_start = ? , breakfast_end = ? , lunch_start = ? , lunch_end = ? , dinner_start = ? , dinner_end = ? , objective_carbs= ?, physical_activity = ? , info_adicional = ? WHERE id = ?",
        [usuario.nombre, usuario.email, hashedpass, usuario.fecha_nacimiento, usuario.fecha_diagnostico, usuario.edad, usuario.genero, usuario.peso, usuario.estatura, usuario.tipo_diabetes, usuario.tipo_terapia, usuario.hyper, usuario.estable, usuario.hipo, usuario.sensitivity, usuario.rate, usuario.precis, usuario.breakfast_start, usuario.breakfast_end, usuario.lunch_start, usuario.lunch_end, usuario.dinner_start, usuario.dinner_end, usuario.objective_carbs, usuario.physical_activity, usuario.info_adicional, idUser]
      );
      return usuario;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      if (cnx) {
        cnx.release();
      }
    }
  }

}