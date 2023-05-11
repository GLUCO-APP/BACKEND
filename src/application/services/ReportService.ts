import { token } from "morgan";
import { Report } from "../../domain/entities/Report";
import { MySQLReportRepository } from "../../infrastructure/repositories/MySQLReportRepository";
const PDFDocumentTable = require("pdfkit-table");
const PDFDocument = require("pdfkit");
import { Request, Response } from "express";
import Chart from 'chart.js/auto';

const jsdom = require("jsdom")

const fs = require('fs');

export class ReportService {
    private reportRepository: MySQLReportRepository;

    constructor(reportRepository: MySQLReportRepository) {
        this.reportRepository = reportRepository;
    }

    public async addReport(report: Report) {
        return this.reportRepository.add(report);
    }
    public async dailyReports(token: string) {
        return this.reportRepository.dailyReports(token);
    }
    public async lastreport(token: string) {
        return this.reportRepository.lastReport(token);
    }
    public async lastreportI(token: string) {
        return this.reportRepository.lastReportI(token);
    }

    public async allReports(token: string, max: string) {
        return this.reportRepository.allReports(token, max);
    }

    public async generate(token: string, max: string, res: Response) {

        const reports = await this.allReports(token, max);
        try {
            if (!reports) {
                throw new Error('No se encontraron informes para el token especificado');
            }
            const doc = new PDFDocumentTable();
            const fecha = new Date(); // Fecha actual
            const fechaFormateada = fecha.toLocaleDateString(); // Formato de fecha
            const horaFormateada = fecha.toLocaleTimeString().slice(0, 5);  // Formato de hora
            doc.image('template/logo.png', 50, 50, { width: 50 });
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
                        report.Carbohydrates ? report.Carbohydrates.toString() : ' ',
                        report.type ? report.type.toString() : ' ',
                    ];
                }))
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
        } catch (err: any) {
            res.status(400).send(err.message);
        }
    }



    public async generatePieChart(token: string, max: string, hipo: number, hiper: number) {

        const reports = await this.allReports(token, max);
    
        if(!reports){
            throw new Error('No se encontraron reportes para el usuario especificado');
        }
    
        let countHipo = 0;
        let countNormal = 0;
        let countHiper = 0;
    
        for (const report of reports) {
            if (report.glucosa > hiper) {
                countHiper++;
            } else if (report.glucosa < hipo) {
                countHipo++;
            } else {
                countNormal++;
            }
        }
    
        const total = countHipo + countNormal + countHiper;
        const data = [countHiper, countHipo, countNormal];
        const { JSDOM } = jsdom;
        const dom = new JSDOM();
        const canvas = dom.window.document.createElement('canvas');
        canvas.width = 250;
        canvas.height = 250;
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
    
        const myChart = new Chart(ctx, {
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
    }



    public async generateCircle(token: string, res: Response) {
        const doc = new PDFDocument();
        const user = await this.reportRepository.getToken(token)
        const hipooo = user?.hipo;
        const hipo = typeof user?.hipo === 'number' ? user?.hipo : 0;
        const hiper = typeof user?.hyper === 'number' ? user?.hyper : 0;

        
        try {

            const chartImage7 = await this.generatePieChart(token, "7", hipo, hiper)
            const chartImage15 = await this.generatePieChart(token, "15", hipo, hiper);
            const chartImage30 = await this.generatePieChart(token, "30", hipo, hiper);


            doc.image(chartImage7);
            doc.image(chartImage15);
            doc.image(chartImage30);

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=report.pdf`);
            doc.pipe(res);
            doc.end();

        } catch (err: any) {
            res.status(400).send(err.message);
        }
    }
}