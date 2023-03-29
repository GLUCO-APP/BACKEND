"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const bcrypt = __importStar(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class MySQLUserRepository {
    add(usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            const cnx = yield dbconfig_1.default.getConnection();
            try {
                const salt = yield bcrypt.genSalt(10);
                const hashedpass = yield bcrypt.hash(usuario.password, salt);
                yield cnx.beginTransaction();
                const [result] = yield cnx.query('INSERT INTO usuarios (nombre, email, password, fechaNacimiento, fechaDiagnostico, telefono, edad, genero, peso, estatura, tipoDiabetes, tipoTerapia, unidades, rango, sensitivity, rate, precis, breakfast, lunch, dinner, glucometer, objective, physicalctivity, infoAdicional, token) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);', [usuario.nombre, usuario.email, hashedpass, usuario.fechaNacimiento, usuario.fechaDiagnostico, usuario.telefono, usuario.edad, usuario.genero, usuario.peso, usuario.estatura, usuario.tipoDiabetes, usuario.tipoTerapia, usuario.unidades, usuario.rango, usuario.sensitivity, usuario.rate, usuario.precis, usuario.breakfast, usuario.lunch, usuario.dinner, usuario.glucometer, usuario.objective, usuario.physicalctivity, usuario.infoAdicional, "sin token"]);
                const id = result.insertId;
                const token = jsonwebtoken_1.default.sign({ _id: id }, process.env.TOKEN_SECRET || 'tokentest');
                const [updateResult] = yield cnx.query('UPDATE usuarios SET token = ? WHERE id = ?', [token, id]);
                yield cnx.query('COMMIT');
                return token;
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
