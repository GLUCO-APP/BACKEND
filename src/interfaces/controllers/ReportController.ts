import { Request, Response } from "express";
import { ReportService } from "../../application/services/ReportService";
import { UserService } from "../../application/services/UserService";
import { PlateService } from "../../application/services/PlateService";
import { MySQLReportRepository } from "../../infrastructure/repositories/MySQLReportRepository";
import { Report } from "../../domain/entities/Report";
import moment from 'moment-timezone';
import { MySQLUserRepository } from "../../infrastructure/repositories/MySQLUserRepository";
import { MySQLPlateRepository } from "../../infrastructure/repositories/MySQLPlateRepository";
import { Server } from "socket.io";
import { unit } from "../../domain/entities/Units";





const fs = require('fs');



export class ReportController {
    private reportService: ReportService
    private userService: UserService
    private plateService: PlateService

    constructor() {
        this.reportService = new ReportService(new MySQLReportRepository);
        this.userService = new UserService(new MySQLUserRepository);
        this.plateService = new PlateService(new MySQLPlateRepository);
    }

    public async addReport(req: Request, res: Response): Promise<void> {
        try {
            const fechaActual = new Date();
            const { id_plato, token_usuario, glucosa, unidades_insulina } = req.body;
            const reportData: Report = new Report(id_plato, token_usuario, glucosa, fechaActual, unidades_insulina);
            const report = await this.reportService.addReport(reportData);
            const predict = await this.userService.smartNotifications(token_usuario)
            const io: Server = req.app.get('socketIo');
            for (let i = 0; i < predict.length; i++) {
                const prediction = predict[i];
                if(prediction>0){
                    if (prediction < 60) {
                        io.emit(token_usuario, "Tu glucemia podria bajar 😰");
                    } else if (prediction > 250) {
                        io.emit(token_usuario, "Tu glucemia podria subir 🥵");
                    }
                }
            }
            res.status(201).json(report);
        } catch (err: any) {
            res.status(400).send(err.message)
        }
    }

    public async dailyReports(req: Request, res: Response): Promise<void> {
        try {
            const token = req.params.token;
            const daily = await this.reportService.dailyReports(token);
            const userid = await this.userService.getId(token);
            const dur = await this.reportService.getDuration(userid);
            const unidades_administradas = daily?.unidades_insulina;
            const fecha_actual = await this.reportService.getCurdate();
            const fecha_toma = daily?.fecha;
            if(fecha_toma != undefined && unidades_administradas != undefined){
                const gasto = unidades_administradas/(dur*60)

                const diffTime = Math.abs(fecha_actual.getTime() - fecha_toma.getTime());
                const diffMinutes = Math.ceil(diffTime / (1000 * 60));
                console.log(diffMinutes)
                const gastado = gasto*diffMinutes;
                const unidades = new unit(unidades_administradas,(unidades_administradas-gastado));
                let response = {...daily, unidades_restantes: unidades_administradas-gastado};
                res.status(200).json(response);
            }
        } catch (err: any) {
            res.status(400).send(err.message)
        }
    }
    public async curUnits(req: Request, res: Response): Promise<void> {
        try{
            const token = req.params.token;
            const userid = await this.userService.getId(token);
            console.log(userid);
            const dur = await this.reportService.getDuration(userid);
            console.log(dur);
            const daily = await this.reportService.dailyReports(token);
            const unidades_administradas = daily?.unidades_insulina;
            console.log(unidades_administradas);
            const fecha_toma = daily?.fecha;
            console.log(fecha_toma);
            const fecha_actual = await this.reportService.getCurdate();
            console.log(fecha_actual);
            if(fecha_toma != undefined && unidades_administradas != undefined){
                const gasto = unidades_administradas/(dur*60)

                const diffTime = Math.abs(fecha_actual.getTime() - fecha_toma.getTime());
                const diffMinutes = Math.ceil(diffTime / (1000 * 60));
                console.log(diffMinutes)
                const gastado = gasto*diffMinutes;
                const unidades = new unit(unidades_administradas,(unidades_administradas-gastado));
                res.status(200).json(unidades);
            }



        }catch (err: any) {
            res.status(400).send(err.message)
        }
    }
    public async lastReport(req: Request, res: Response): Promise<void> {
        try {
            const token = req.params.token;
            const report = await this.reportService.lastreport(token);
            res.status(200).json(report);
        } catch (err: any) {
            res.status(400).send(err.message)
        }
    }
    public async lastReportI(req: Request, res: Response): Promise<void> {
        try {
            const token = req.params.token;
            const report = await this.reportService.lastreportI(token);
            res.status(200).json(report);
        } catch (err: any) {
            res.status(400).send(err.message)
        }
    }

    public async allReports(req: Request, res: Response): Promise<void> {
        const max = (req.params.max);
        try {
            const token = req.params.token;
            const report = await this.reportService.allReports(token, max);
            res.status(200).json(report);
        } catch (err: any) {
            res.status(400).send(err.message)
        }
    }

    public async generatePdf(req: Request, res: Response): Promise<void> {
        const token = req.params.token;
        const max = req.params.max;
        try {
            await this.reportService.generate(token, max, res);
        } catch (err: any) {
            res.status(400).send(err.message);
        }
    }










}