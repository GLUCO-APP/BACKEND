import { token } from "morgan";
import { Report } from "../../domain/entities/Report";
import { MySQLReportRepository } from "../../infrastructure/repositories/MySQLReportRepository";
const PDFDocumentTable = require("pdfkit-table");
const PDFDocument = require("pdfkit");
import { Request, Response } from "express";






const fs = require('fs');

export class ReportService {
    private reportRepository: MySQLReportRepository;

    constructor(reportRepository: MySQLReportRepository) {
        this.reportRepository = reportRepository;
    }


    public async addReport(report: Report) {
        return this.reportRepository.add(report);
    }
    public async getCurdate(){
        return this.reportRepository.curDate();
    }
    public async getDuration(id:number){
        return this.reportRepository.getDuration(id);
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


    async generateTable(headers: string[], row: string[][]) {

        
        const table = {
            headers: ['Periodo', 'Hipo', 'normal', 'Hiper', 'Total'],
            rows: await Promise.all(row.map(async (report, index) => {
                return [report[0], report[1], report[2], report[3], report[4]];
            }))
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


        return table ;
    }


    public async generateCircle(token: string, res: Response) {
        const user = await this.reportRepository.getToken(token);
        const RCAL = await this.reportRepository.RCAL(token);
        const IMC = await this.reportRepository.IMC(token);
        const TMB = await this.reportRepository.TMB(token);
        const reports = await this.allReports(token, "30");
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
            const row = await this.reportRepository.variacion(token)
            const table2 = await this.generateTable(headers,row)
            
            doc.table(table2)
            doc.lineWidth(0.5);
            doc.end();
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=reporte.pdf`);
            doc.pipe(res);
        } catch (err: any) {
            res.status(400).send(err.message);
        }
    }
}
