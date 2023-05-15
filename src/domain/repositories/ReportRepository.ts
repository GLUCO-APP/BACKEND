import {Report} from "../entities/Report";
import { dailyRep } from "../entities/dailyRep";

export interface ReportRepository {
    add(Report: Report):Promise<Report>;
    dailyReports(token:string):Promise<dailyRep | null>;
    lastReport(token:string):Promise<Report | null>
    lastReportI(token:string):Promise<Report | null>
    getDuration(id:number):Promise<number>
}