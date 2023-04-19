import {Report} from "../entities/Report";

export interface ReportRepository {
    add(Report: Report):Promise<Report>;
    dailyReports(token:string):Promise<number | undefined>;
}