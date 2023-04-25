import { Request, Response } from "express";
import { ReportService } from "../../application/services/ReportService";
import { MySQLReportRepository } from "../../infrastructure/repositories/MySQLReportRepository";
import { Report } from "../../domain/entities/Report";
import moment from 'moment-timezone';
const PDFDocument = require('pdfkit');
const fs = require('fs');



export class ReportController {
    private reportService: ReportService

    constructor() {
        this.reportService = new ReportService(new MySQLReportRepository);
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
    fs = require('fs');
    PDFDocument = require('pdfkit');

    public async generatePdf(req: Request, res: Response): Promise<void> {
        try {
            const token = req.params.token;
            const report = await this.reportService.lastreport(token);
            const doc = new PDFDocument();

            // Agregar los datos del informe a la plantilla PDF
            doc.fontSize(24).font('Helvetica-Bold').text(`REPORTE DE DIABETES`, {
                align: 'center'
            });

            const startY = 150;
            const lineTopY = startY + 20;
            const lineBottomY = 120;

            doc.lineWidth(1).moveTo(50, lineTopY).lineTo(550, lineTopY).stroke();
            doc.lineWidth(1).moveTo(50, lineBottomY).lineTo(550, lineBottomY).stroke();

            doc.fontSize(12);
            doc.fillColor('black');
            doc.image('template/logo.png', 50, 50, { width: 60 });
            doc.text(`Fecha: ${report?.fecha}`, 100, startY + 40);
            doc.text(`Glucosa: ${report?.glucosa}`, 100, startY + 60);
            doc.text(`Unidades de insulina: ${report?.unidades_insulina}`, 100, startY + 80);
            doc.text(`ID plato: ${report?.id_plato}`, 100, startY + 100);       
            doc.text()
            doc.end()
            // Enviar el archivo PDF generado como respuesta a la solicitud
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=reporte.pdf`);
            doc.pipe(res);
        } catch (err: any) {
            res.status(400).send(err.message);
        }
    }





}