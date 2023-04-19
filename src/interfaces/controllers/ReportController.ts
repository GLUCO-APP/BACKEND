import { Request,Response } from "express";
import { ReportService } from "../../application/services/ReportService";
import { MySQLReportRepository } from "../../infrastructure/repositories/MySQLReportRepository";
import { Report } from "../../domain/entities/Report";
import moment from 'moment-timezone';



export class ReportController{
    private reportService: ReportService

    constructor(){
        this.reportService = new ReportService(new MySQLReportRepository);
    }

    public async addReport(req: Request, res:Response):Promise<void>{
        try{
            const fechaActual = new Date();
            const {id_plato,token_usuario,glucosa,unidades_insulina} = req.body;
            const reportData: Report = new Report(id_plato,token_usuario,glucosa,fechaActual,unidades_insulina);
            const report = await this.reportService.addReport(reportData);
            res.status(201).json(report);
        }catch(err:any){
            res.status(400).send(err.message)
        }
    }

    public async dailyReports(req: Request, res:Response):Promise<void>{
        try{
            const token = req.params.token;
            const sum = await this.reportService.dailyReports(token);
            res.status(200).json({"suma":sum});
        }catch(err:any){
            res.status(400).send(err.message)
        }
    }
    public async lastReport(req: Request, res:Response):Promise<void>{
        try{
            const token = req.params.token;
            const report = await this.reportService.lastreport(token);
            res.status(200).json(report);
        }catch(err:any){
            res.status(400).send(err.message)
        }
    }
}