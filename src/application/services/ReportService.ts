import { token } from "morgan";
import { Report } from "../../domain/entities/Report";
import { MySQLReportRepository } from "../../infrastructure/repositories/MySQLReportRepository";

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
}