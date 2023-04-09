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
    add(Report) {
        return __awaiter(this, void 0, void 0, function* () {
            const cnx = yield dbconfig_1.default.getConnection();
            try {
                yield cnx.beginTransaction();
                const [result] = yield cnx.query('INSERT INTO Report (id_usuario, glucosa, fecha, unidades_insulina, id_plato) VALUES (?, ?, ?, ?, ?);'[Report.id_usuario, Report.glucosa, Report.fecha, Report.unidades_insulina, Report.id_plato]);
                const id = result.insertId;
                const newReport = {
                    id: id,
                    id_usuario: Report.id_usuario,
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
}
exports.MySQLReportRepository = MySQLReportRepository;
