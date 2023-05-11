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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportService = void 0;
const PDFDocumentTable = require("pdfkit-table");
const PDFDocument = require("pdfkit");
const auto_1 = __importDefault(require("chart.js/auto"));
const jsdom = require("jsdom");
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
    generatePieChart(token, max, hipo, hiper) {
        return __awaiter(this, void 0, void 0, function* () {
            const reports = yield this.allReports(token, max);
            if (!reports) {
                throw new Error('No se encontraron reportes para el usuario especificado');
            }
            let countHipo = 0;
            let countNormal = 0;
            let countHiper = 0;
            for (const report of reports) {
                if (report.glucosa > hiper) {
                    countHiper++;
                }
                else if (report.glucosa < hipo) {
                    countHipo++;
                }
                else {
                    countNormal++;
                }
            }
            const total = countHipo + countNormal + countHiper;
            const data = [countHiper, countHipo, countNormal];
            const { JSDOM } = jsdom;
            const dom = new JSDOM();
            const canvas = dom.window.document.createElement('canvas');
            canvas.width = 200;
            canvas.height = 200;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                throw new Error('Canvas rendering context not available');
            }
            const labels = [`Hiper (${((countHiper / total) * 100).toFixed(2)}%)`, `Hipo (${((countHipo / total) * 100).toFixed(2)}%)`, `Normal (${((countNormal / total) * 100).toFixed(2)}%)`];
            const backgroundColor = [
                'rgba(255, 99, 132, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)'
            ];
            const myChart = new auto_1.default(ctx, {
                type: 'pie',
                data: {
                    labels,
                    datasets: [{
                            data,
                            backgroundColor
                        }]
                }
            });
            const chartDataUrl = canvas.toDataURL();
            const chartImage = Buffer.from(chartDataUrl.split(',')[1], 'base64');
            return chartImage;
        });
    }
    generateCircle(token, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = new PDFDocument();
            const user = yield this.reportRepository.getToken(token);
            const hipooo = user === null || user === void 0 ? void 0 : user.hipo;
            const hipo = typeof (user === null || user === void 0 ? void 0 : user.hipo) === 'number' ? user === null || user === void 0 ? void 0 : user.hipo : 0;
            const hiper = typeof (user === null || user === void 0 ? void 0 : user.hyper) === 'number' ? user === null || user === void 0 ? void 0 : user.hyper : 0;
            try {
                const chartImage7 = yield this.generatePieChart(token, "7", hipo, hiper);
                const chartImage15 = yield this.generatePieChart(token, "15", hipo, hiper);
                const chartImage30 = yield this.generatePieChart(token, "30", hipo, hiper);
                doc.image(chartImage7);
                doc.image(chartImage15);
                doc.image(chartImage30);
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `attachment; filename=report.pdf`);
                doc.pipe(res);
                doc.end();
            }
            catch (err) {
                res.status(400).send(err.message);
            }
        });
    }
}
exports.ReportService = ReportService;
