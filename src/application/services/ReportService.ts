import { token } from "morgan";
import { Report } from "../../domain/entities/Report";
import { MySQLReportRepository } from "../../infrastructure/repositories/MySQLReportRepository";
const PDFDocument = require("pdfkit-table");
import { Request, Response } from "express";

export class ReportService{
    private reportRepository: MySQLReportRepository;

    constructor(reportRepository: MySQLReportRepository){
        this.reportRepository = reportRepository;
    }

    public async addReport(report:Report){
            return this.reportRepository.add(report);
    }
    public async dailyReports(token:string){
            return this.reportRepository.dailyReports(token);
    }
    public async lastreport(token:string){
        return this.reportRepository.lastReport(token);
    }
    public async lastreportI(token:string){
        return this.reportRepository.lastReportI(token);
    }

    public async allReports(token:string , max:string ){
        return this.reportRepository.allReports(token , max);
    }

    public async generate(token:string , max:string , res: Response){

        const reports = await this.allReports(token, max );
        try {
            if (!reports) {
                throw new Error('No se encontraron informes para el token especificado');
            }
            const doc = new PDFDocument();
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
                        report.Carbohydrates ? report.Carbohydrates.toString(): ' ',
                        report.type ? report.type.toString(): ' ',
                    ];
                }))
            };
            const tableOptions = {
                
                columns: {
                    0: { width: 25},
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
}