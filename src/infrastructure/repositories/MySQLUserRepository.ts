import { Usuario } from "../../domain/entities/User";
import { UsuarioUpd } from "../../domain/entities/UserUpd";
import { UserRepository } from "../../domain/repositories/UserRepository";
import dbGluko from "../database/dbconfig";
import mysql, { RowDataPacket } from 'mysql2/promise';
import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import { Insulin } from "../../domain/entities/Insulin";
import { glycemia } from "../../domain/entities/glycemia";


export class MySQLUserRepository implements UserRepository {


  async getglycemia(token: String): Promise<glycemia> {
    const cnx = await dbGluko.getConnection();
    try {
      const [rows] = await cnx.execute(
        "SELECT glucosa,fecha FROM gluko.Report where token = ?",
        [token]
      );
      const glucosaArr: number[] = (rows as RowDataPacket[]).map(row => row.glucosa);
      const fechaArr: string[] = (rows as RowDataPacket[]).map(row => row.fecha);


      const dataset = new glycemia(glucosaArr, fechaArr);
      return dataset;
    } finally {
      cnx.release();
    }
  }
  async getUsetype(token: String): Promise<String> {
    const cnx = await dbGluko.getConnection();
    try {
      const [rows] = await cnx.execute(
        "SELECT tipo_usuario FROM usuarios WHERE token  = ?",
        [token]
      );
      const tipo = (rows as RowDataPacket[]).length > 0 ? (rows as RowDataPacket[])[0].tipo_usuario.toString() : "";
      console.log(tipo)
      return tipo;
    } finally {
      cnx.release();
    }
  }
  async getInsulinsUser(ids: Number[]): Promise<Insulin[]> {
    const cnx = await dbGluko.getConnection();
    try {
      const placeholders = ids.map(() => '?').join(',');
      const query = `SELECT * FROM insulin WHERE id IN (${placeholders})`;
      const result = await cnx.query(query, ids);

      return result[0] as Insulin[]
    } finally {
      cnx.release();
    }
  }
  async getInsulinids(id: number): Promise<Number[]> {
    const cnx = await dbGluko.getConnection();
    try {
      const [rows] = await cnx.execute(
        "SELECT insulin_id FROM user_x_insulin WHERE user_id = ?",
        [id]
      );
      const insulinIds = (rows as RowDataPacket[]).map((row: any) => row.insulin_id);
      return insulinIds;
    } finally {
      cnx.release();
    }

  }
  async getId(token: string): Promise<number> {
    const cnx = await dbGluko.getConnection();
    try {
      const [rows] = await cnx.execute(
        "SELECT id FROM usuarios WHERE token = ? LIMIT 1",
        [token]
      );
      const id = (rows as RowDataPacket[]).length > 0 ? (rows as RowDataPacket[])[0].id.toString() : "";
      return Number(id);
    } finally {
      cnx.release();
    }
  }


  async getInsulins(): Promise<Insulin[]> {
    const cnx = await dbGluko.getConnection();
    try {
      await cnx.beginTransaction();
      const [rows] = await cnx.query('SELECT * FROM insulin');
      return rows as Insulin[];

    } finally {
      cnx.release();
    }
  }

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
  async findToken(email: string): Promise<string> {
    const cnx = await dbGluko.getConnection()
    try {
      const [rows] = await cnx.execute(
        "SELECT token FROM usuarios where email = ? LIMIT 1",
        [email]
      );
      const token = (rows as RowDataPacket[]).length > 0 ? (rows as RowDataPacket[])[0].token.toString() : "";
      return token;
    } finally {
      cnx.release();
    }
  }
  async updateToken(email: string, token: string): Promise<void> {
    const cnx = await dbGluko.getConnection()
    try {
      const [result] = await cnx.query(
        'UPDATE usuarios SET token = ? WHERE email = ?;',
        [token, email]
      );

    } finally {
      cnx.release();
    }

  }
  async add(usuario: Usuario): Promise<string> {
    const cnx = await dbGluko.getConnection()
    try {
      const token = jwt.sign({ email: usuario.email }, process.env.TOKEN_SECRET || 'tokentest')
      const salt = await bcrypt.genSalt(10);
      const hashedpass = await bcrypt.hash(usuario.password, salt);
      await cnx.beginTransaction();
      const [result] = await cnx.query(
        'INSERT INTO usuarios (nombre, email, password, fecha_nacimiento, fecha_diagnostico, edad, genero, peso, estatura, tipo_diabetes, tipo_terapia, hyper, estable, hipo, sensitivity, rate, basal, breakfast_start, breakfast_end, lunch_start, lunch_end, dinner_start, dinner_end, objective_carbs, physical_activity, info_adicional, token,tipo_usuario) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
        [usuario.nombre, usuario.email, hashedpass, usuario.fecha_nacimiento, usuario.fecha_diagnostico, usuario.edad, usuario.genero, usuario.peso, usuario.estatura, usuario.tipo_diabetes, usuario.tipo_terapia, usuario.hyper, usuario.estable, usuario.hipo, usuario.sensitivity, usuario.rate, usuario.basal, usuario.breakfast_start, usuario.breakfast_end, usuario.lunch_start, usuario.lunch_end, usuario.dinner_start, usuario.dinner_end, usuario.objective_carbs, usuario.physical_activity, usuario.info_adicional, token, usuario.tipo_usuario]
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

  async getToken(tkUser: string): Promise<Usuario | null> {
    let cnx;
    try {
      cnx = await dbGluko.getConnection();
      const [rows] = await cnx.execute(
        "SELECT nombre, email, fecha_nacimiento, fecha_diagnostico, edad, genero, peso, estatura, tipo_diabetes, tipo_terapia, hyper, estable, hipo, sensitivity, rate, basal, breakfast_start, breakfast_end, lunch_start, lunch_end, dinner_start, dinner_end, objective_carbs, physical_activity, info_adicional, tipo_usuario FROM usuarios WHERE token = ?",
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
  async updateUser(usuario: UsuarioUpd, tokenUser: string, insulinas: Insulin[]): Promise<UsuarioUpd> {
    let cnx;

    const id = await this.getId(tokenUser);
    
    try {
      cnx = await dbGluko.getConnection();
      const [rows] = await cnx.execute(
        "SELECT * FROM usuarios WHERE token = ?",
        [tokenUser]
      );
      const existingUser = Array.isArray(rows) ? rows[0] : null;
      if (!existingUser) {
        throw new Error(`No se encontró un usuario con el ID ${tokenUser}`);
      }
      await cnx.execute(
        "UPDATE usuarios SET nombre = ?, email = ?, fecha_nacimiento = ?, fecha_diagnostico = ?, edad = ?, genero = ?, peso = ?, estatura = ?, tipo_diabetes = ? , tipo_terapia = ? , hyper = ? , estable = ? , hipo = ? , sensitivity = ? , rate = ? , basal= ? , breakfast_start = ? , breakfast_end = ? , lunch_start = ? , lunch_end = ? , dinner_start = ? , dinner_end = ? , objective_carbs= ?, physical_activity = ? , info_adicional = ?, tipo_usuario = ? WHERE token = ?",
        [usuario.nombre, usuario.email, usuario.fecha_nacimiento, usuario.fecha_diagnostico, usuario.edad, usuario.genero, usuario.peso, usuario.estatura, usuario.tipo_diabetes, usuario.tipo_terapia, usuario.hyper, usuario.estable, usuario.hipo, usuario.sensitivity, usuario.rate, usuario.basal, usuario.breakfast_start, usuario.breakfast_end, usuario.lunch_start, usuario.lunch_end, usuario.dinner_start, usuario.dinner_end, usuario.objective_carbs, usuario.physical_activity, usuario.info_adicional,usuario.tipo_usuario ,  tokenUser]
      );
      await cnx.execute(
        "UPDATE gluko.user_x_insulin SET insulin_id = ? WHERE user_id = ? LIMIT 1;",
        [insulinas[0].id , id ]);
      await cnx.execute(
        "UPDATE gluko.user_x_insulin SET insulin_id = ? WHERE user_id = ? AND insulin_id !=  ?;",
        [insulinas[1].id , id , insulinas[0].id]);

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

  async getPass(tkUser: string): Promise<string | null> {
    let cnx;
    try {
      cnx = await dbGluko.getConnection();
      const [rows] = await cnx.execute(
        "SELECT password FROM usuarios WHERE token = ?",
        [tkUser]
      );
      const user = rows as Usuario[];
      if (user.length === 0) {
        return null;
      }
      return user[0].password;
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      if (cnx) {
        cnx.release();
      }
    }
  }


  async UpdatePass(email: string, newPass: string): Promise<string | null> {

    const saltRounds = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPass, saltRounds);

    let cnx;
    try {
      cnx = await dbGluko.getConnection();
      const [rows] = await cnx.execute(
        "UPDATE usuarios SET password = ? WHERE email = ?",
        [newHash, email]
      );
      const user = rows as Usuario[];
      if (user.length === 0) {
        return null;
      }
      return "se actualizo la contrasea";
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      if (cnx) {
        cnx.release();
      }
    }
  }
}