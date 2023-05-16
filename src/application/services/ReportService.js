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
exports.ReportService = void 0;
const PDFDocumentTable = require("pdfkit-table");
const PDFDocument = require("pdfkit");
const fs = require('fs');
class ReportService {
    constructor(reportRepository) {
        this.reportRepository = reportRepository;
    }
    addReport(report) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.reportRepository.add(report);
        });
    }
    getCurdate() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.reportRepository.curDate();
        });
    }
    getDuration(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.reportRepository.getDuration(id);
        });
    }
    dailyReports(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.reportRepository.dailyReports(token);
        });
    }
    lastreport(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.reportRepository.lastReport(token);
        });
    }
    lastreportI(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.reportRepository.lastReportI(token);
        });
    }
    allReports(token, max) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.reportRepository.allReports(token, max);
        });
    }
    generate(token, max, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const reports = yield this.allReports(token, max);
            try {
                if (!reports) {
                    throw new Error('No se encontraron informes para el token especificado');
                }
                const doc = new PDFDocumentTable();
                const fecha = new Date(); // Fecha actual
                const fechaFormateada = fecha.toLocaleDateString(); // Formato de fecha
                const horaFormateada = fecha.toLocaleTimeString().slice(0, 5); // Formato de hora
                doc.image('template/logo.png', 50, 50, { width: 50 });
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
                        0: { width: 25 },
                        1: { width: 95, align: 'center' },
                        2: { width: 60, align: 'center' },
                        3: { width: 80, align: 'center' },
                        4: { width: 60, align: 'center' },
                        5: { width: 70, align: 'center' }
                    },
                    header: {
                        fillColor: '#f2f2f2'
                    },
                    margin: { top: 50, bottom: 30 },
                    layout: 'lightHorizontalLines'
                };
                doc.table(table, tableOptions);
                doc.moveDown(2);
                doc.lineWidth(0.5);
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
    generateTable(headers, row) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = {
                headers: ['Periodo', 'Hipo', 'normal', 'Hiper', 'Total'],
                rows: yield Promise.all(row.map((report, index) => __awaiter(this, void 0, void 0, function* () {
                    return [report[0], report[1], report[2], report[3], report[4]];
                })))
            };
            const tableOptions = {
                columns: {
                    0: { width: 25 },
                    1: { width: 95, align: 'center' },
                    2: { width: 60, align: 'center' },
                    3: { width: 80, align: 'center' },
                    4: { width: 60, align: 'center' },
                },
                header: {
                    fillColor: '#f2f2f2',
                },
                margin: { top: 50, bottom: 30 },
                layout: 'lightHorizontalLines',
            };
            return table;
        });
    }
    generateCircle(token, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.reportRepository.getToken(token);
            const RCAL = yield this.reportRepository.RCAL(token);
            const IMC = yield this.reportRepository.IMC(token);
            const TMB = yield this.reportRepository.TMB(token);
            const reports = yield this.allReports(token, "30");
            try {
                if (!reports || !user) {
                    throw new Error('No se encontraron informes para el token especificado');
                }
                const doc = new PDFDocumentTable();
                const fecha = new Date(); // Fecha actual
                doc.image('template/logo.png', 50, 50, { width: 50 });
                // Agregar los datos de cada informe a la plantilla PDF
                doc.fontSize(24).font('Helvetica-Bold').text(`INFORME DE DIABETES`, {
                    align: 'center'
                });
                doc.moveDown(0.5);
                doc.fontSize(16).font('Helvetica-Bold').text('Información Personal', { align: 'left' });
                doc.moveDown(0.8);
                doc.fontSize(12).font('Helvetica').text(`Nombre:  ${user.nombre}`, { align: 'left' });
                doc.text(`Fecha de nacimiento:  ${(user.fecha_nacimiento).toLocaleString()} (Edad: ${user.edad} años)`, { align: 'left' });
                doc.text(`Peso:  ${user.peso}`, { align: 'left' });
                doc.text(`Índice de masa corporal (IMC):  ${IMC} Normal`, { align: 'left' });
                doc.text(`Tasa metabólica basal (TMB):  ${TMB} kcal`, { align: 'left' });
                doc.text(`Necesidades calóricas diarias:  ${RCAL} kcal`, { align: 'left' });
                doc.text(`Insulina total (TDD):  ${user.basal} U`, { align: 'left' });
                doc.text(`Insulina basal total (TBD): ${user.basal} U`, { align: 'left' });
                doc.text(`Ratios de HC (I:C): 1 U :  ${user.rate}g`, { align: 'left' });
                doc.text(`Sensibilidad a la insulina (ISF):  ${user.sensitivity} mg/dL`, { align: 'left' });
                doc.moveDown(2);
                const headers = ['Periodo', 'Hipo', 'normal', 'Hiper', 'Total'];
                const row = yield this.reportRepository.variacion(token);
                const table2 = yield this.generateTable(headers, row);
                doc.table(table2);
                doc.lineWidth(0.5);
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
exports.ReportService = ReportService;
