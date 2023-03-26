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
exports.MySQLUserRepository = void 0;
const dbconfig_1 = __importDefault(require("../database/dbconfig"));
class MySQLUserRepository {
    add(usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            const cnx = yield dbconfig_1.default.getConnection();
            try {
                yield cnx.beginTransaction();
                const [result] = yield cnx.query('INSERT INTO usuarios (nombre, email, password, fechaNacimiento, fechaDiagnostico, telefono, edad, genero, peso, estatura, tipoDiabetes, tipoTerapia, unidades, rango, sensitivity, rate, precis, breakfast, lunch, dinner, glucometer, objective, physicalctivity, infoAdicional) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);', [usuario.nombre, usuario.email, usuario.password, usuario.fechaNacimiento, usuario.fechaDiagnostico, usuario.telefono, usuario.edad, usuario.genero, usuario.peso, usuario.estatura, usuario.tipoDiabetes, usuario.tipoTerapia, usuario.unidades, usuario.rango, usuario.sensitivity, usuario.rate, usuario.precis, usuario.breakfast, usuario.lunch, usuario.dinner, usuario.glucometer, usuario.objective, usuario.physicalctivity, usuario.infoAdicional]);
                const id = result.insertId;
                const newUser = {
                    nombre: usuario.nombre,
                    email: usuario.email,
                    password: usuario.password,
                    fechaNacimiento: usuario.fechaNacimiento,
                    fechaDiagnostico: usuario.fechaDiagnostico,
                    telefono: usuario.telefono,
                    edad: usuario.edad,
                    genero: usuario.genero,
                    peso: usuario.peso,
                    estatura: usuario.estatura,
                    tipoDiabetes: usuario.tipoDiabetes,
                    tipoTerapia: usuario.tipoTerapia,
                    unidades: usuario.unidades,
                    rango: usuario.rango,
                    sensitivity: usuario.sensitivity,
                    rate: usuario.rate,
                    precis: usuario.precis,
                    breakfast: usuario.breakfast,
                    lunch: usuario.lunch,
                    dinner: usuario.dinner,
                    glucometer: usuario.glucometer,
                    objective: usuario.objective,
                    physicalctivity: usuario.physicalctivity,
                    infoAdicional: usuario.infoAdicional
                };
                yield cnx.query('COMMIT');
                return newUser;
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
exports.MySQLUserRepository = MySQLUserRepository;
