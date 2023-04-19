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
    findEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const cnx = yield dbconfig_1.default.getConnection();
            try {
                const [rows] = yield cnx.execute("SELECT * FROM usuarios WHERE email = ? LIMIT 1", [email]);
                const user = rows;
                if (user.length === 0) {
                    return null;
                }
                return user[0];
            }
            finally {
                cnx.release();
            }
        });
    }
    findToken(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const cnx = yield dbconfig_1.default.getConnection();
            try {
                const [rows] = yield cnx.execute("SELECT token FROM usuarios where email = ? LIMIT 1", [email]);
                const token = rows.length > 0 ? rows[0].token.toString() : "";
                return token;
            }
            finally {
                cnx.release();
            }
        });
    }
    updateToken(email, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const cnx = yield dbconfig_1.default.getConnection();
            try {
                const [result] = yield cnx.query('UPDATE usuarios SET token = ? WHERE email = ?;', [token, email]);
            }
            finally {
                cnx.release();
            }
        });
    }
    add(usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            const cnx = yield dbconfig_1.default.getConnection();
            try {
                const token = jsonwebtoken_1.default.sign({ email: usuario.email }, process.env.TOKEN_SECRET || 'tokentest');
                const salt = yield bcrypt.genSalt(10);
                const hashedpass = yield bcrypt.hash(usuario.password, salt);
                yield cnx.beginTransaction();
                const [result] = yield cnx.query('INSERT INTO usuarios (nombre, email, password, fecha_nacimiento, fecha_diagnostico, edad, genero, peso, estatura, tipo_diabetes, tipo_terapia, hyper, estable, hipo, sensitivity, rate, precis, breakfast_start, breakfast_end, lunch_start, lunch_end, dinner_start, dinner_end, objective_carbs, physical_activity, info_adicional, token) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);', [usuario.nombre, usuario.email, hashedpass, usuario.fecha_nacimiento, usuario.fecha_diagnostico, usuario.edad, usuario.genero, usuario.peso, usuario.estatura, usuario.tipo_diabetes, usuario.tipo_terapia, usuario.hyper, usuario.estable, usuario.hipo, usuario.sensitivity, usuario.rate, usuario.precis, usuario.breakfast_start, usuario.breakfast_end, usuario.lunch_start, usuario.lunch_end, usuario.dinner_start, usuario.dinner_end, usuario.objective_carbs, usuario.physical_activity, usuario.info_adicional, token]);
                const id = result.insertId;
                for (const insu of usuario.insulin) {
                    yield cnx.execute('INSERT INTO user_x_insulin (user_id, insulin_id) VALUES (?, ?);', [id, insu.id]);
                }
                yield cnx.query('COMMIT');
                return "Usuario creado";
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
    getToken(tkUser) {
        return __awaiter(this, void 0, void 0, function* () {
            let cnx;
            try {
                cnx = yield dbconfig_1.default.getConnection();
                const [rows] = yield cnx.execute("SELECT nombre, email, fecha_nacimiento, fecha_diagnostico, edad, genero, peso, estatura, tipo_diabetes, tipo_terapia, hyper, estable, hipo, sensitivity, rate, precis, breakfast_start, breakfast_end, lunch_start, lunch_end, dinner_start, dinner_end, objective_carbs, physical_activity, info_adicional FROM usuarios WHERE token = ?", [tkUser]);
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
    updateUser(usuario, tokenUser) {
        return __awaiter(this, void 0, void 0, function* () {
            let cnx;
            try {
                cnx = yield dbconfig_1.default.getConnection();
                const [rows] = yield cnx.execute("SELECT * FROM usuarios WHERE token = ?", [tokenUser]);
                const existingUser = Array.isArray(rows) ? rows[0] : null;
                if (!existingUser) {
                    throw new Error(`No se encontró un usuario con el ID ${tokenUser}`);
                }
                yield cnx.execute("UPDATE usuarios SET nombre = ?, email = ?, fecha_nacimiento = ?, fecha_diagnostico = ?, edad = ?, genero = ?, peso = ?, estatura = ?, tipo_diabetes = ? , tipo_terapia = ? , hyper = ? , estable = ? , hipo = ? , sensitivity = ? , rate = ?, precis = ? , breakfast_start = ? , breakfast_end = ? , lunch_start = ? , lunch_end = ? , dinner_start = ? , dinner_end = ? , objective_carbs= ?, physical_activity = ? , info_adicional = ? WHERE token = ?", [usuario.nombre, usuario.email, usuario.fecha_nacimiento, usuario.fecha_diagnostico, usuario.edad, usuario.genero, usuario.peso, usuario.estatura, usuario.tipo_diabetes, usuario.tipo_terapia, usuario.hyper, usuario.estable, usuario.hipo, usuario.sensitivity, usuario.rate, usuario.precis, usuario.breakfast_start, usuario.breakfast_end, usuario.lunch_start, usuario.lunch_end, usuario.dinner_start, usuario.dinner_end, usuario.objective_carbs, usuario.physical_activity, usuario.info_adicional, tokenUser]);
                return usuario;
            }
            catch (error) {
                console.error(error);
                throw error;
            }
            finally {
                if (cnx) {
                    cnx.release();
                }
            }
        });
    }
}
exports.MySQLUserRepository = MySQLUserRepository;
