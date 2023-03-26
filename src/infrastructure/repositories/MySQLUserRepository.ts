import { Usuario } from "../../domain/entities/User";
import { UserRepository } from "../../domain/repositories/UserRepository";
import dbGluko from "../database/dbconfig";
import mysql from 'mysql2/promise';



export class MySQLUserRepository implements UserRepository{
    async add(usuario: Usuario): Promise<Usuario> {
        const cnx = await dbGluko.getConnection()
        try{
            await cnx.beginTransaction();
            const [result] = await cnx.query(
                'INSERT INTO usuarios (nombre, email, password, fechaNacimiento, fechaDiagnostico, telefono, edad, genero, peso, estatura, tipoDiabetes, tipoTerapia, unidades, rango, sensitivity, rate, precis, breakfast, lunch, dinner, glucometer, objective, physicalctivity, infoAdicional) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);',
                [usuario.nombre, usuario.email, usuario.password, usuario.fechaNacimiento, usuario.fechaDiagnostico, usuario.telefono, usuario.edad, usuario.genero, usuario.peso, usuario.estatura, usuario.tipoDiabetes, usuario.tipoTerapia, usuario.unidades, usuario.rango, usuario.sensitivity, usuario.rate, usuario.precis, usuario.breakfast, usuario.lunch, usuario.dinner, usuario.glucometer, usuario.objective, usuario.physicalctivity, usuario.infoAdicional]
            );

            const id = (result as mysql.OkPacket).insertId;
              
            const newUser: Usuario = {
                nombre: usuario.nombre,
                email: usuario.email,
                password: usuario.password,
                fechaNacimiento: usuario.fechaNacimiento,
                fechaDiagnostico: usuario.fechaDiagnostico,
                telefono: usuario.telefono,
                edad: usuario.edad,
                genero: usuario.genero,
                peso: usuario.peso,
                estatura: usuario.estatura,
                tipoDiabetes: usuario.tipoDiabetes,
                tipoTerapia: usuario.tipoTerapia,
                unidades: usuario.unidades,
                rango: usuario.rango,
                sensitivity: usuario.sensitivity,
                rate: usuario.rate,
                precis: usuario.precis,
                breakfast: usuario.breakfast,
                lunch: usuario.lunch,
                dinner: usuario.dinner,
                glucometer: usuario.glucometer,
                objective: usuario.objective,
                physicalctivity: usuario.physicalctivity,
                infoAdicional: usuario.infoAdicional
            };
            await cnx.query('COMMIT');
            return newUser;
        }catch(err:any){
            await cnx.query('ROLLBACK');
            throw err;
          } finally {
            cnx.release();
          }
    }

}