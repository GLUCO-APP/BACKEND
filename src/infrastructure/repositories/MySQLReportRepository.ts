import { Report } from "../../domain/entities/Report";
import { ReportRepository } from "../../domain/repositories/ReportRepository";
import dbGluko from "../database/dbconfig";
import mysql, { RowDataPacket } from 'mysql2/promise';

export class MySQLReportRepository implements ReportRepository{
    
    async lastReport(token: string): Promise<Report | null> {
        const cnx = await dbGluko.getConnection();
        try{
            await cnx.beginTransaction();
            const [rows, fields] = await cnx.execute(
                "SELECT * FROM Report WHERE token = ? ORDER BY fecha DESC LIMIT 1",
                [token]
            );
            const report = rows as Report[]
            if (report.length === 0) {
                return null;
              }
              return report[0];
        }catch (err:any) {
            await cnx.query('ROLLBACK');
            throw err;
        } finally {
            cnx.release();
        }
    }
    async lastReportI(token: string): Promise<Report> {
        throw new Error("Method not implemented.");
    }
    async add(Report: Report): Promise<Report> {
        const cnx = await dbGluko.getConnection();
        try{
            
            await cnx.beginTransaction();
            console.log(Report.fecha)
            const [result] = await cnx.query(
                'INSERT INTO Report (glucosa, fecha, unidades_insulina, id_plato, token) VALUES (?, ?, ?, ?, ?);',
                [Report.glucosa,Report.fecha,Report.unidades_insulina,Report.id_plato,Report.token_usuario]
            );
            const id = (result as mysql.OkPacket).insertId;
            const newReport = {
                id: id,
                token_usuario:Report.token_usuario,
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
    async dailyReports(token:string):Promise<number | undefined>{
        const cnx = await dbGluko.getConnection();
        try{
            await cnx.beginTransaction();
            const [rows, fields] = await cnx.execute(
                `SELECT SUM(pl.Carbohydrates) as sum_carbs 
                FROM Report rp 
                INNER JOIN Plate pl ON rp.id_plato = pl.id 
                WHERE rp.token = ? 
                AND DATE(rp.fecha) = CURDATE()`,
                [token]
              );


                const suma = Number((rows as RowDataPacket[]).length > 0 ? (rows as RowDataPacket[])[0].sum_carbs : 0)
                return suma
           

            
        }catch (err:any) {
            await cnx.query('ROLLBACK');
            throw err;
        } finally {
            cnx.release();
        }
    }
    
}