import { Request, Response } from "express";
import { ReportService } from "../../application/services/ReportService";
import { UserService } from "../../application/services/UserService";
import { PlateService } from "../../application/services/PlateService";
import { MySQLReportRepository } from "../../infrastructure/repositories/MySQLReportRepository";
import { Report } from "../../domain/entities/Report";
import moment from 'moment-timezone';
import { MySQLUserRepository } from "../../infrastructure/repositories/MySQLUserRepository";
import { MySQLPlateRepository } from "../../infrastructure/repositories/MySQLPlateRepository";

//const PDFDocument = require('pdfkit');
const PDFDocument = require("pdfkit-table");



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
            const report = await this.reportService.allReports(token, max );
            res.status(200).json(report);
        } catch (err: any) {
            res.status(400).send(err.message)
        }
    }

    public async generatePdf(req: Request, res: Response): Promise<void> {
        const token = req.params.token;
        const max = (req.params.max);
        const reports = await this.reportService.allReports(token , max );

        try {
            if (!reports) {
                throw new Error('No se encontraron informes para el token especificado');
            }
            const doc = new PDFDocument();
            const fecha = new Date(); // Fecha actual
            const fechaFormateada = fecha.toLocaleDateString(); // Formato de fecha
            const horaFormateada = fecha.toLocaleTimeString().slice(0, 5);  // Formato de hora
            doc.image('template/logo.png', 50, 50, { width: 60 });
            // Agregar los datos de cada informe a la plantilla PDF
            doc.fontSize(24).font('Helvetica-Bold').text(`REPORTE DE DIABETES`, {
                align: 'center'
            });
            const table = {
                headers: ['Nro.', 'Fecha', 'Glucemia (mg/dL)', "Insulina", 'CH', "Categoría"],
                rows: await Promise.all(reports.map(async (report, index) => {
                    return [
                        (index + 1).toString(),
                        report.fecha ? new Date(report.fecha).toLocaleString() : '',
                        report.glucosa ? report.glucosa.toString() : '',
                        report.unidades_insulina ? report.unidades_insulina.toString() : '',
                        report.Carbohydrates ? report.Carbohydrates.toString(): ' ',
                        report.type ? report.type.toString(): ' ',
                    ];
                }))
            };
            const tableOptions = {
                columns: {
                    0: { width: 50, align: 'center' },
                    1: { width: 100, align: 'center' },
                    2: { width: 100, align: 'center' },
                    3: { width: 100, align: 'center' },
                    4: { width: 100, align: 'center' }
                },
                header: {
                    fillColor: '#f2f2f2'
                },
                margin: { top: 50, bottom: 30 },
                layout: 'lightHorizontalLines'
            };

            doc.moveDown(2);
            doc.lineWidth(0.5);
            doc.table(table, tableOptions);
            doc.end();
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=reporte.pdf`);
            doc.pipe(res);
        } catch (err: any) {
            res.status(400).send(err.message);
        }
    }










}