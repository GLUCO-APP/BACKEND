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
class MySQLReportRepository {
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
                (SELECT glucosa FROM Report WHERE token = ? ORDER BY fecha DESC LIMIT 1) as glucosa, 
                (SELECT fecha FROM Report WHERE token = ? ORDER BY fecha DESC LIMIT 1) as fecha,
                (SELECT unidades_insulina FROM Report WHERE token = ? AND unidades_insulina IS NOT NULL ORDER BY fecha DESC LIMIT 1) as unidades_insulina 
                
                FROM usuarios 
                    usuarios 
                    JOIN Report ON usuarios.token = Report.token 
                    JOIN Plate ON Report.id_plato = Plate.id 
                
                WHERE 
                    usuarios.token = ? 
                    AND DATE(Report.fecha) = curdate()
                    ORDER BY Report.fecha DESC `, [token, token, token, token]);
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
}
exports.MySQLReportRepository = MySQLReportRepository;
