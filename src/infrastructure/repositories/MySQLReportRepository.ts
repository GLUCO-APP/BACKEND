import { Report } from "../../domain/entities/Report";
import { ReportRepository } from "../../domain/repositories/ReportRepository";
import dbGluko from "../database/dbconfig";
import mysql, { RowDataPacket } from 'mysql2/promise';

export class MySQLReportRepository implements ReportRepository{
    async add(Report: Report): Promise<Report> {
        const cnx = await dbGluko.getConnection();
        try{
            
            await cnx.beginTransaction();
            const [result] = await cnx.query(
                'INSERT INTO Report (id_usuario, glucosa, fecha, unidades_insulina, id_plato) VALUES (?, ?, ?, ?, ?);',
                [Report.id_usuario,Report.glucosa,Report.fecha,Report.unidades_insulina,Report.id_plato]
            );
            const id = (result as mysql.OkPacket).insertId;
            const newReport = {
                id: id,
                id_usuario:Report.id_usuario,
                glucosa:Report.glucosa,
                fecha:Report.fecha,
                unidades_insulina:Report.unidades_insulina,
                id_plato:Report.id_plato
            }
            await cnx.query('COMMIT');
            return newReport;
        }catch (err:any) {
            await cnx.query('ROLLBACK');
            throw err;
        } finally {
            cnx.release();
        }
        
    }
    
}