import { Usuario } from "../../domain/entities/User";
import { UserRepository } from "../../domain/repositories/UserRepository";
import dbGluko from "../database/dbconfig";
import mysql from 'mysql2/promise';
import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'


export class MySQLUserRepository implements UserRepository{
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

            const token:string = jwt.sign({_id: id},process.env.TOKEN_SECRET || 'tokentest');
              
            const [updateResult] = await cnx.query(
                'UPDATE usuarios SET token = ? WHERE id = ?',
                [token, id]
            );
            await cnx.query('COMMIT');
            return token;
        }catch(err:any){
            await cnx.query('ROLLBACK');
            throw err;
          } finally {
            cnx.release();
          }
    }

}