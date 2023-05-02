import { Request, Response } from "express";
import { ReportService } from "../../application/services/ReportService";
import { UserService } from "../../application/services/UserService";
import { PlateService } from "../../application/services/PlateService";
import { MySQLReportRepository } from "../../infrastructure/repositories/MySQLReportRepository";
import { Report } from "../../domain/entities/Report";
import moment from 'moment-timezone';
import { MySQLUserRepository } from "../../infrastructure/repositories/MySQLUserRepository";
import { MySQLPlateRepository } from "../../infrastructure/repositories/MySQLPlateRepository";





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
            res.status(201).json(report);
        } catch (err: any) {
            res.status(400).send(err.message)
        }
    }

    public async dailyReports(req: Request, res: Response): Promise<void> {
        try {
            const token = req.params.token;
            const daily = await this.reportService.dailyReports(token);
            res.status(200).json(daily);
        } catch (err: any) {
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