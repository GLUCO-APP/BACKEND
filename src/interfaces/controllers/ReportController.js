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
const UserService_1 = require("../../application/services/UserService");
const PlateService_1 = require("../../application/services/PlateService");
const MySQLReportRepository_1 = require("../../infrastructure/repositories/MySQLReportRepository");
const Report_1 = require("../../domain/entities/Report");
const MySQLUserRepository_1 = require("../../infrastructure/repositories/MySQLUserRepository");
const MySQLPlateRepository_1 = require("../../infrastructure/repositories/MySQLPlateRepository");
//const PDFDocument = require('pdfkit');
const PDFDocument = require("pdfkit-table");
const fs = require('fs');
class ReportController {
    constructor() {
        this.reportService = new ReportService_1.ReportService(new MySQLReportRepository_1.MySQLReportRepository);
        this.userService = new UserService_1.UserService(new MySQLUserRepository_1.MySQLUserRepository);
        this.plateService = new PlateService_1.PlateService(new MySQLPlateRepository_1.MySQLPlateRepository);
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
    allReports(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const max = (req.params.max);
            try {
                const token = req.params.token;
                const report = yield this.reportService.allReports(token, max);
                res.status(200).json(report);
            }
            catch (err) {
                res.status(400).send(err.message);
            }
        });
    }
    generatePdf(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.params.token;
            const max = (req.params.max);
            const reports = yield this.reportService.allReports(token, max);
            try {
                if (!reports) {
                    throw new Error('No se encontraron informes para el token especificado');
                }
                const doc = new PDFDocument();
                const fecha = new Date(); // Fecha actual
                const fechaFormateada = fecha.toLocaleDateString(); // Formato de fecha
                const horaFormateada = fecha.toLocaleTimeString().slice(0, 5); // Formato de hora
                doc.image('template/logo.png', 50, 50, { width: 60 });
                // Agregar los datos de cada informe a la plantilla PDF
                doc.fontSize(24).font('Helvetica-Bold').text(`REPORTE DE DIABETES`, {
                    align: 'center'
                });
                const table = {
                    headers: ['Nro.', 'Fecha', 'Glucemia (mg/dL)', "Insulina", 'CH', "Categoría"],
                    rows: yield Promise.all(reports.map((report, index) => __awaiter(this, void 0, void 0, function* () {
                        return [
                            (index + 1).toString(),
                            report.fecha ? new Date(report.fecha).toLocaleString() : '',
                            report.glucosa ? report.glucosa.toString() : '',
                            report.unidades_insulina ? report.unidades_insulina.toString() : '',
                            report.Carbohydrates ? report.Carbohydrates.toString() : ' ',
                            report.type ? report.type.toString() : ' ',
                        ];
                    })))
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
            }
            catch (err) {
                res.status(400).send(err.message);
            }
        });
    }
}
exports.ReportController = ReportController;
