import { Report } from "../../domain/entities/Report";
import { ReportPDF} from "../../domain/entities/ReportPDF";
import { dailyRep } from "../../domain/entities/dailyRep";
import { ReportRepository } from "../../domain/repositories/ReportRepository";
import dbGluko from "../database/dbconfig";
import mysql, { RowDataPacket } from 'mysql2/promise';

export class MySQLReportRepository implements ReportRepository {

    async getDuration(id:number):Promise<number>{
        const cnx = await dbGluko.getConnection();
        try{
            console.log(id);
            const [rows] = await cnx.execute(
                "SELECT duration FROM insulin where type = 'Bolo' and id = ? LIMIT 1",
                [id]
            );
            console.log(rows);
            const duration  = (rows as RowDataPacket[]).length > 0 ?(rows as RowDataPacket[])[0].duration.toString() : "";
            console.log(duration);
            return Number(duration);
        }catch (err: any) {
            await cnx.query('ROLLBACK');
            throw err;
        } finally {
            cnx.release();
        }
    }

    async lastReport(token: string): Promise<Report | null> {
        const cnx = await dbGluko.getConnection();
        try {
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
        } catch (err: any) {
            await cnx.query('ROLLBACK');
            throw err;
        } finally {
            cnx.release();
        }
    }
    async lastReportI(token: string): Promise<Report | null> {
        const cnx = await dbGluko.getConnection();
        try {
            await cnx.beginTransaction();
            const [rows, fields] = await cnx.execute(
                "SELECT * FROM Report WHERE token = ? AND unidades_insulina IS NOT NULL ORDER BY fecha DESC LIMIT 1;",
                [token]
            );
            const report = rows as Report[]
            if (report.length === 0) {
                return null;
            }
            return report[0];
        } catch (err: any) {
            await cnx.query('ROLLBACK');
            throw err;
        } finally {
            cnx.release();
        }
    }

    async allReports(token: string, max: string): Promise<ReportPDF[] | null> {
        const cnx = await dbGluko.getConnection();
        try {
            await cnx.beginTransaction();
            const [rows, fields] = await cnx.execute(
                "SELECT DISTINCT gluko.Report.glucosa, gluko.Report.fecha, gluko.Report.unidades_insulina, gluko.Plate.type, gluko.Plate.Carbohydrates  FROM gluko.Report INNER JOIN gluko.Plate ON gluko.Report.id_plato = gluko.Plate.id WHERE gluko.Report.token = ? AND gluko.Report.fecha >= DATE_SUB(NOW(), INTERVAL ? DAY) ORDER BY gluko.Report.fecha DESC",
                [token, max]
            );
            const reports = rows as ReportPDF[];
            if (reports.length === 0) {
                return null;
            }
            return reports;
        } catch (err: any) {
            await cnx.query('ROLLBACK');
            throw err;
        } finally {
            cnx.release();
        }
    }
    
    async curDate():Promise<Date>{
        const cnx = await dbGluko.getConnection();
        try{
            const [rows] = await cnx.query('SELECT NOW() as now');
            const serverTime = (rows as RowDataPacket)[0].now;
            return serverTime;
         } catch (err: any) {
            await cnx.query('ROLLBACK');
            throw err;
        } finally {
            cnx.release();
        }

    }
    async add(Report: Report): Promise<Report> {
        const cnx = await dbGluko.getConnection();
        try {

            await cnx.beginTransaction();
            console.log(Report.fecha)
            const [rows] = await cnx.query('SELECT NOW() as now');
            const serverTime = (rows as RowDataPacket)[0].now;
            console.log(serverTime);
            const [result] = await cnx.query(
                'INSERT INTO Report (glucosa, fecha, unidades_insulina, id_plato, token) VALUES (?, ?, ?, ?, ?);',
                [Report.glucosa, serverTime, Report.unidades_insulina, Report.id_plato, Report.token_usuario]
            );
            const id = (result as mysql.OkPacket).insertId;
            const newReport = {
                id: id,
                token_usuario: Report.token_usuario,
                glucosa: Report.glucosa,
                fecha: Report.fecha,
                unidades_insulina: Report.unidades_insulina,
                id_plato: Report.id_plato
            }
            await cnx.query('COMMIT');
            return newReport;
        } catch (err: any) {
            await cnx.query('ROLLBACK');
            throw err;
        } finally {
            cnx.release();
        }

    }
    async dailyReports(token: string): Promise<dailyRep | null> {
        const cnx = await dbGluko.getConnection();
        try {
            await cnx.beginTransaction();
            const [rows, fields] = await cnx.execute(
                `SELECT usuarios.objective_carbs, SUM(Plate.Carbohydrates) as sum_carbs, 
                (SELECT glucosa FROM Report WHERE token = ?  AND DATE(Report.fecha) = curdate() ORDER BY fecha DESC LIMIT 1) as glucosa, 
                (SELECT fecha FROM Report WHERE token = ?  AND DATE(Report.fecha) = curdate() ORDER BY fecha DESC LIMIT 1) as fecha,
                (SELECT unidades_insulina FROM Report WHERE token = ? AND unidades_insulina IS NOT NULL  AND DATE(Report.fecha) = curdate() ORDER BY fecha DESC LIMIT 1) as unidades_insulina 
                
                FROM usuarios 
                    usuarios 
                    JOIN Report ON usuarios.token = Report.token 
                    JOIN Plate ON Report.id_plato = Plate.id 
                
                WHERE 
                    usuarios.token = ?
                    AND DATE(Report.fecha) = curdate()
                    ORDER BY Report.fecha DESC`,
                [token, token, token, token]
            );
            const daily = rows as dailyRep[]

            if (daily.length === 0) {
                return null;
            }
            return daily[0];




        } catch (err: any) {
            console.log('hola')
            await cnx.query('ROLLBACK');
            throw err;
        } finally {
            cnx.release();
        }
    }

}