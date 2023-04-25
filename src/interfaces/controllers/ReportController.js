"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportController = void 0;
const ReportService_1 = require("../../application/services/ReportService");
const MySQLReportRepository_1 = require("../../infrastructure/repositories/MySQLReportRepository");
const Report_1 = require("../../domain/entities/Report");
const PDFDocument = require('pdfkit');
const fs = require('fs');
class ReportController {
    constructor() {
        this.fs = require('fs');
        this.PDFDocument = require('pdfkit');
        this.reportService = new ReportService_1.ReportService(new MySQLReportRepository_1.MySQLReportRepository);
    }
    addReport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fechaActual = new Date();
                const { id_plato, token_usuario, glucosa, unidades_insulina } = req.body;
                const reportData = new Report_1.Report(id_plato, token_usuario, glucosa, fechaActual, unidades_insulina);
                const report = yield this.reportService.addReport(reportData);
                res.status(201).json(report);
            }
            catch (err) {
                res.status(400).send(err.message);
            }
        });
    }
    dailyReports(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.params.token;
                const daily = yield this.reportService.dailyReports(token);
                res.status(200).json(daily);
            }
            catch (err) {
                res.status(400).send(err.message);
            }
        });
    }
    lastReport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.params.token;
                const report = yield this.reportService.lastreport(token);
                res.status(200).json(report);
            }
            catch (err) {
                res.status(400).send(err.message);
            }
        });
    }
    lastReportI(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.params.token;
                const report = yield this.reportService.lastreportI(token);
                res.status(200).json(report);
            }
            catch (err) {
                res.status(400).send(err.message);
            }
        });
    }
    generatePdf(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.params.token;
                const report = yield this.reportService.lastreport(token);
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
                doc.text(`Fecha: ${report === null || report === void 0 ? void 0 : report.fecha}`, 100, startY + 40);
                doc.text(`Glucosa: ${report === null || report === void 0 ? void 0 : report.glucosa}`, 100, startY + 60);
                doc.text(`Unidades de insulina: ${report === null || report === void 0 ? void 0 : report.unidades_insulina}`, 100, startY + 80);
                doc.text(`ID plato: ${report === null || report === void 0 ? void 0 : report.id_plato}`, 100, startY + 100);
                doc.text();
                doc.end();
                // Enviar el archivo PDF generado como respuesta a la solicitud
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `attachment; filename=reporte.pdf`);
                doc.pipe(res);
            }
            catch (err) {
                res.status(400).send(err.message);
            }
        });
    }
}
exports.ReportController = ReportController;
