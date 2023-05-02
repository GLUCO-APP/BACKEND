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
const UserService_1 = require("../../application/services/UserService");
const PlateService_1 = require("../../application/services/PlateService");
const MySQLReportRepository_1 = require("../../infrastructure/repositories/MySQLReportRepository");
const Report_1 = require("../../domain/entities/Report");
const MySQLUserRepository_1 = require("../../infrastructure/repositories/MySQLUserRepository");
const MySQLPlateRepository_1 = require("../../infrastructure/repositories/MySQLPlateRepository");
const fs = require('fs');
class ReportController {
    constructor() {
        this.reportService = new ReportService_1.ReportService(new MySQLReportRepository_1.MySQLReportRepository);
        this.userService = new UserService_1.UserService(new MySQLUserRepository_1.MySQLUserRepository);
        this.plateService = new PlateService_1.PlateService(new MySQLPlateRepository_1.MySQLPlateRepository);
    }
    addReport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fechaActual = new Date();
                const { id_plato, token_usuario, glucosa, unidades_insulina } = req.body;
                const reportData = new Report_1.Report(id_plato, token_usuario, glucosa, fechaActual, unidades_insulina);
                const report = yield this.reportService.addReport(reportData);
                res.status(201).json(report);
            }
            catch (err) {
                res.status(400).send(err.message);
            }
        });
    }
    dailyReports(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.params.token;
                const daily = yield this.reportService.dailyReports(token);
                res.status(200).json(daily);
            }
            catch (err) {
                res.status(400).send(err.message);
            }
        });
    }
    lastReport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.params.token;
                const report = yield this.reportService.lastreport(token);
                res.status(200).json(report);
            }
            catch (err) {
                res.status(400).send(err.message);
            }
        });
    }
    lastReportI(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.params.token;
                const report = yield this.reportService.lastreportI(token);
                res.status(200).json(report);
            }
            catch (err) {
                res.status(400).send(err.message);
            }
        });
    }
    allReports(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const max = (req.params.max);
            try {
                const token = req.params.token;
                const report = yield this.reportService.allReports(token, max);
                res.status(200).json(report);
            }
            catch (err) {
                res.status(400).send(err.message);
            }
        });
    }
    generatePdf(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.params.token;
            const max = req.params.max;
            try {
                yield this.reportService.generate(token, max, res);
            }
            catch (err) {
                res.status(400).send(err.message);
            }
        });
    }
}
exports.ReportController = ReportController;
