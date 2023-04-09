import { Usuario } from "../../domain/entities/User";
import { UserRepository } from "../../domain/repositories/UserRepository";
import dbGluko from "../database/dbconfig";
import mysql, { RowDataPacket } from 'mysql2/promise';
import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'


export class MySQLUserRepository implements UserRepository{
    async findEmail(email: string): Promise<Usuario | null> {
        const cnx = await dbGluko.getConnection()
        try{
          const [rows] = await cnx.execute(
            "SELECT * FROM usuarios WHERE email = ? LIMIT 1",
            [email]
          );
          const user = rows as Usuario[];
          if (user.length === 0) {
              return null;
          }
          return user[0];
        }finally {
          cnx.release();
        }
        
    }
    async add(usuario: Usuario): Promise<string> {
        const cnx = await dbGluko.getConnection()
        try{

            const salt = await bcrypt.genSalt(10);
            const hashedpass = await bcrypt.hash(usuario.password,salt);
            await cnx.beginTransaction();
            const [result] = await cnx.query(
                'INSERT INTO usuarios (nombre, email, password, fechaNacimiento, fechaDiagnostico, telefono, edad, genero, peso, estatura, tipoDiabetes, tipoTerapia, unidades, rango, sensitivity, rate, precis, breakfast, lunch, dinner, glucometer, objective, physicalctivity, infoAdicional, token) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);',
                [usuario.nombre, usuario.email, hashedpass, usuario.fechaNacimiento, usuario.fechaDiagnostico, usuario.telefono, usuario.edad, usuario.genero, usuario.peso, usuario.estatura, usuario.tipoDiabetes, usuario.tipoTerapia, usuario.unidades, usuario.rango, usuario.sensitivity, usuario.rate, usuario.precis, usuario.breakfast, usuario.lunch, usuario.dinner, usuario.glucometer, usuario.objective, usuario.physicalctivity, usuario.infoAdicional, "sin token"]
            );

            const id = (result as mysql.OkPacket).insertId;


            await cnx.query('COMMIT');
            return "Usuario creado";
        }catch(err:any){
            await cnx.query('ROLLBACK');
            throw err;
          } finally {
            cnx.release();
          }
    }

    async getUser(idUser: string): Promise<Usuario > {
        const cnx = await dbGluko.getConnection()
        const [rows] = await cnx.execute(
            "SELECT * FROM usuarios WHERE id = ?",
            [idUser]
        );
        const user = rows as Usuario[];
        if (user.length === 0) {
             return user[0] ;
         }
        return user[0];
    }


    async updateUser(usuario: Usuario , idUser: string): Promise<Usuario> {
        const cnx = await dbGluko.getConnection();
        const salt = await bcrypt.genSalt(10);
        const hashedpass = await bcrypt.hash(usuario.password,salt);
        const [rows] = await cnx.execute(
          "SELECT * FROM usuarios WHERE id = ?",
          [idUser]
        );
        const existingUser = rows as Usuario[];
        if (!existingUser) {
          throw new Error(`No se encontró un usuario con el ID ${idUser}`);
        }
        await cnx.execute(
          "UPDATE usuarios SET nombre = ?, email = ?, password = ?, fechaNacimiento = ?, fechaDiagnostico = ?, telefono = ?, edad = ?, genero = ?, peso = ?, estatura = ?, tipoDiabetes = ? , tipoTerapia = ? , unidades = ? , rango = ? , sensitivity = ? , rate = ?, precis = ? , breakfast = ? , lunch = ? , dinner = ? , glucometer = ?, objective = ?, physicalctivity = ? , infoAdicional = ? WHERE id = ?",
          [usuario.nombre, usuario.email, hashedpass, usuario.fechaNacimiento, usuario.fechaDiagnostico, usuario.telefono, usuario.edad, usuario.genero, usuario.peso, usuario.estatura, usuario.tipoDiabetes, usuario.tipoTerapia, usuario.unidades, usuario.rango, usuario.sensitivity, usuario.rate, usuario.precis, usuario.breakfast, usuario.lunch, usuario.dinner, usuario.glucometer, usuario.objective, usuario.physicalctivity, usuario.infoAdicional , idUser]
        );
        return usuario;
      }
      
    
    

}