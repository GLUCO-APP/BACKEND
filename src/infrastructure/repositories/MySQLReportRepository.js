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
exports.MySQLReportRepository = void 0;
const dbconfig_1 = __importDefault(require("../database/dbconfig"));
//const PDFDocument = require("pdfkit-table");
class MySQLReportRepository {
    getDuration(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            const cnx = yield dbconfig_1.default.getConnection();
            try {
                const placeholders = ids.map(() => '?').join(',');
                const query = `SELECT duration FROM insulin where type = 'Bolo' and id  IN (${placeholders})`;
                const result = yield cnx.query(query, ids);
                const duration = result.length > 0 ? result[0][0].duration.toString() : "";
                console.log(duration);
                return Number(duration);
            }
            catch (err) {
                yield cnx.query('ROLLBACK');
                throw err;
            }
            finally {
                cnx.release();
            }
        });
    }
    lastReport(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const cnx = yield dbconfig_1.default.getConnection();
            try {
                yield cnx.beginTransaction();
                const [rows, fields] = yield cnx.execute("SELECT * FROM Report WHERE token = ? ORDER BY fecha DESC LIMIT 1", [token]);
                const report = rows;
                if (report.length === 0) {
                    return null;
                }
                return report[0];
            }
            catch (err) {
                yield cnx.query('ROLLBACK');
                throw err;
            }
            finally {
                cnx.release();
            }
        });
    }
    lastReportI(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const cnx = yield dbconfig_1.default.getConnection();
            try {
                yield cnx.beginTransaction();
                const [rows, fields] = yield cnx.execute("SELECT * FROM Report WHERE token = ? AND unidades_insulina IS NOT NULL ORDER BY fecha DESC LIMIT 1;", [token]);
                const report = rows;
                if (report.length === 0) {
                    return null;
                }
                return report[0];
            }
            catch (err) {
                yield cnx.query('ROLLBACK');
                throw err;
            }
            finally {
                cnx.release();
            }
        });
    }
    allReports(token, max) {
        return __awaiter(this, void 0, void 0, function* () {
            const cnx = yield dbconfig_1.default.getConnection();
            try {
                yield cnx.beginTransaction();
                const [rows, fields] = yield cnx.execute("SELECT DISTINCT gluko.Report.glucosa, gluko.Report.fecha, gluko.Report.unidades_insulina, gluko.Plate.type, gluko.Plate.Carbohydrates  FROM gluko.Report INNER JOIN gluko.Plate ON gluko.Report.id_plato = gluko.Plate.id WHERE gluko.Report.token = ? AND gluko.Report.fecha >= DATE_SUB(NOW(), INTERVAL ? DAY) ORDER BY gluko.Report.fecha DESC", [token, max]);
                const reports = rows;
                if (reports.length === 0) {
                    return null;
                }
                return reports;
            }
            catch (err) {
                yield cnx.query('ROLLBACK');
                throw err;
            }
            finally {
                cnx.release();
            }
        });
    }
    curDate() {
        return __awaiter(this, void 0, void 0, function* () {
            const cnx = yield dbconfig_1.default.getConnection();
            try {
                const [rows] = yield cnx.query('SELECT NOW() as now');
                const serverTime = rows[0].now;
                return serverTime;
            }
            catch (err) {
                yield cnx.query('ROLLBACK');
                throw err;
            }
            finally {
                cnx.release();
            }
        });
    }
    add(Report) {
        return __awaiter(this, void 0, void 0, function* () {
            const cnx = yield dbconfig_1.default.getConnection();
            try {
                yield cnx.beginTransaction();
                console.log(Report.fecha);
                const [rows] = yield cnx.query('SELECT NOW() as now');
                const serverTime = rows[0].now;
                console.log(serverTime);
                const [result] = yield cnx.query('INSERT INTO Report (glucosa, fecha, unidades_insulina, id_plato, token) VALUES (?, ?, ?, ?, ?);', [Report.glucosa, serverTime, Report.unidades_insulina, Report.id_plato, Report.token_usuario]);
                const id = result.insertId;
                const newReport = {
                    id: id,
                    token_usuario: Report.token_usuario,
                    glucosa: Report.glucosa,
                    fecha: Report.fecha,
                    unidades_insulina: Report.unidades_insulina,
                    id_plato: Report.id_plato
                };
                yield cnx.query('COMMIT');
                return newReport;
            }
            catch (err) {
                yield cnx.query('ROLLBACK');
                throw err;
            }
            finally {
                cnx.release();
            }
        });
    }
    dailyReports(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const cnx = yield dbconfig_1.default.getConnection();
            try {
                yield cnx.beginTransaction();
                const [rows, fields] = yield cnx.execute(`SELECT usuarios.objective_carbs, SUM(Plate.Carbohydrates) as sum_carbs, 
                (SELECT glucosa FROM Report WHERE token = ?  AND DATE(Report.fecha) = curdate() ORDER BY fecha DESC LIMIT 1) as glucosa, 
                (SELECT fecha FROM Report WHERE token = ?  AND DATE(Report.fecha) = curdate() ORDER BY fecha DESC LIMIT 1) as fecha,
                (SELECT unidades_insulina FROM Report WHERE token = ? AND unidades_insulina IS NOT NULL  AND DATE(Report.fecha) = curdate() ORDER BY fecha DESC LIMIT 1) as unidades_insulina 
                
                FROM usuarios 
                    usuarios 
                    JOIN Report ON usuarios.token = Report.token 
                    JOIN Plate ON Report.id_plato = Plate.id 
                
                WHERE 
                    usuarios.token = ?
                    AND DATE(Report.fecha) = curdate()
                    ORDER BY Report.fecha DESC`, [token, token, token, token]);
                const daily = rows;
                if (daily.length === 0) {
                    return null;
                }
                return daily[0];
            }
            catch (err) {
                console.log('hola');
                yield cnx.query('ROLLBACK');
                throw err;
            }
            finally {
                cnx.release();
            }
        });
    }
    getToken(tkUser) {
        return __awaiter(this, void 0, void 0, function* () {
            let cnx;
            try {
                cnx = yield dbconfig_1.default.getConnection();
                const [rows] = yield cnx.execute("SELECT nombre, email, fecha_nacimiento, fecha_diagnostico, edad, genero, peso, estatura, tipo_diabetes, tipo_terapia, hyper, estable, hipo, sensitivity, rate, basal, breakfast_start, breakfast_end, lunch_start, lunch_end, dinner_start, dinner_end, objective_carbs, physical_activity, info_adicional, tipo_usuario FROM usuarios WHERE token = ?", [tkUser]);
                const user = rows;
                if (user.length === 0) {
                    return null;
                }
                return user[0];
            }
            catch (error) {
                console.error(error);
                return null;
            }
            finally {
                if (cnx) {
                    cnx.release();
                }
            }
        });
    }
    IMC(tkUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getToken(tkUser);
            if (!user) {
                return 'No se encontró el usuario';
            }
            const IMC = ((user.peso) / (user.estatura * user.estatura)) * 1000;
            return IMC.toFixed(2);
        });
    }
    TMB(tkUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getToken(tkUser);
            if (!user) {
                throw new Error('No se encontró el usuario');
            }
            let TMB = 0;
            if (user.genero == 'Masculino') {
                TMB = 10 * user.peso + 6.25 * user.estatura - 5 * user.edad + 5;
            }
            else {
                TMB = 10 * user.peso + 6.25 * user.estatura - 5 * user.edad - 161;
            }
            return TMB;
        });
    }
    RCAL(tkUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getToken(tkUser);
            if (!user) {
                throw new Error('No se encontró el usuario');
            }
            let req = 0;
            if (user.genero == 'Masculino') {
                req = 66 + (13.7 * user.peso) + (5 * user.estatura) - (6.5 * user.edad);
            }
            else {
                req = 655 + (9.6 * user.peso) + (1.8 * user.estatura) - (4.7 * user.edad);
            }
            return req;
        });
    }
    variacion(tkuser) {
        return __awaiter(this, void 0, void 0, function* () {
            const report7 = yield this.allReports(tkuser, "7");
            const report15 = yield this.allReports(tkuser, "15");
            const report30 = yield this.allReports(tkuser, "30");
            const user = yield this.getToken(tkuser);
            let hipo7 = 0, normal7 = 0, hyper7 = 0, hipo15 = 0, normal15 = 0, hyper15 = 0, hipo30 = 0, normal30 = 0, hyper30 = 0;
            if (!report7 || !user || !report15 || !report30) {
                throw new Error('No se encontró el usuario');
            }
            for (const report of report7) {
                if (report.glucosa < (user === null || user === void 0 ? void 0 : user.hipo)) {
                    hipo7++;
                }
                else if (report.glucosa >= user.hipo && report.glucosa <= user.hyper) {
                    normal7++;
                }
                else {
                    hyper7++;
                }
            }
            for (const report of report15) {
                if (report.glucosa < user.hipo) {
                    hipo15++;
                }
                else if (report.glucosa >= user.hipo && report.glucosa <= user.hyper) {
                    normal15++;
                }
                else {
                    hyper15++;
                }
            }
            for (const report of report30) {
                if (report.glucosa < user.hipo) {
                    hipo30++;
                }
                else if (report.glucosa >= user.hipo && report.glucosa <= user.hyper) {
                    normal30++;
                }
                else {
                    hyper30++;
                }
            }
            const data = [
                [
                    '7 dias',
                    hipo7.toString(),
                    normal7.toString(),
                    hyper7.toString(),
                    (hipo7 + normal7 + hyper7).toString(),
                ],
                [
                    '15 dias',
                    hipo15.toString(),
                    normal15.toString(),
                    hyper15.toString(),
                    (hipo15 + normal15 + hyper15).toString(),
                ],
                [
                    '30 dias',
                    hipo30.toString(),
                    normal30.toString(),
                    hyper30.toString(),
                    (hipo30 + normal30 + hyper30).toString(),
                ],
            ];
            return new Promise((resolve) => {
                resolve(data);
            });
        });
    }
}
exports.MySQLReportRepository = MySQLReportRepository;
