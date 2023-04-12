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
const MySQLReportRepository_1 = require("../../infrastructure/repositories/MySQLReportRepository");
const Report_1 = require("../../domain/entities/Report");
class ReportController {
    constructor() {
        this.reportService = new ReportService_1.ReportService(new MySQLReportRepository_1.MySQLReportRepository);
    }
    addReport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fechac = new Date();
                const { id_plato, id_usuario, glucosa, unidades_insulina } = req.body;
                const reportData = new Report_1.Report(id_plato, id_usuario, glucosa, fechac, unidades_insulina);
                const report = yield this.reportService.addReport(reportData);
                res.status(201).json(report);
            }
            catch (err) {
                res.status(400).send(err.message);
            }
        });
    }
}
exports.ReportController = ReportController;