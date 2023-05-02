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
const PDFDocument = require("pdfkit-table");
class ReportService {
    constructor(reportRepository) {
        this.reportRepository = reportRepository;
    }
    addReport(report) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.reportRepository.add(report);
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
                const doc = new PDFDocument();
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
}
exports.ReportService = ReportService;
