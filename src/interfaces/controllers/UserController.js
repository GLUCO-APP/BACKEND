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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const UserService_1 = require("../../application/services/UserService");
const User_1 = require("../../domain/entities/User");
const MySQLUserRepository_1 = require("../../infrastructure/repositories/MySQLUserRepository");
const morgan_1 = __importDefault(require("morgan"));
class UserController {
    constructor() {
        this.userService = new UserService_1.UserService(new MySQLUserRepository_1.MySQLUserRepository());
    }
    getUsetype(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.params.token;
            try {
                const tipo = yield this.userService.getUsetype(token);
                console.log(tipo);
                res.status(200).json({ success: true, tipo: tipo });
            }
            catch (err) {
                console.error(err);
                res.status(500).send(err.message);
            }
        });
    }
    getInsulins(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const insulins = yield this.userService.getInsulins();
                res.status(200).json({ success: true, data: insulins });
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Something went wrong' });
            }
        });
    }
    addUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nombre, email, password, fecha_nacimiento, fecha_diagnostico, edad, genero, peso, estatura, tipo_diabetes, tipo_terapia, hyper, estable, hipo, sensitivity, rate, precis, breakfast_start, breakfast_end, lunch_start, lunch_end, dinner_start, dinner_end, insulin, objective_carbs, physical_activity, info_adicional, tipo_usuario } = req.body;
                const UserData = new User_1.Usuario(nombre, email, password, fecha_nacimiento, fecha_diagnostico, edad, genero, peso, estatura, tipo_diabetes, tipo_terapia, hyper, estable, hipo, sensitivity, rate, precis, breakfast_start, breakfast_end, lunch_start, lunch_end, dinner_start, dinner_end, insulin, objective_carbs, physical_activity, info_adicional, tipo_usuario);
                const resp = yield this.userService.addUser(UserData);
                res.status(201).json({ "status": resp });
            }
            catch (err) {
                console.error(err);
                res.status(400).send(err.message);
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, morgan_1.default)('dev')(req, res, () => { });
            try {
                const { email, password, } = req.body;
                const token = yield Promise.race([
                    this.userService.login(email, password),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
                ]);
                res.status(200).json({ "status": token });
            }
            catch (err) {
                res.status(400).send(err.message);
            }
        });
    }
    getUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.params.token;
            const user = yield this.userService.getToken(token);
            const id = yield this.userService.getId(token);
            const insulinIds = yield this.userService.getInsulinids(id);
            const ins = yield this.userService.getInsulinUser(insulinIds);
            console.log(ins);
            if (user === null) {
                res.status(404).json({ message: 'Usuario no encontrado' });
            }
            else {
                const { password } = user, usuario = __rest(user, ["password"]);
                const resultado = { usuario, ins };
                res.status(200).json(resultado);
            }
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.params.token;
            try {
                const { nombre, email, fecha_nacimiento, fecha_diagnostico, edad, genero, peso, estatura, tipo_diabetes, tipo_terapia, hyper, estable, hipo, sensitivity, rate, precis, breakfast_start, breakfast_end, lunch_start, lunch_end, dinner_start, dinner_end, insulin, objective_carbs, physical_activity, info_adicional, tipo_usuario } = req.body;
                const UserData = new User_1.Usuario(nombre, email, " ", fecha_nacimiento, fecha_diagnostico, edad, genero, peso, estatura, tipo_diabetes, tipo_terapia, hyper, estable, hipo, sensitivity, rate, precis, breakfast_start, breakfast_end, lunch_start, lunch_end, dinner_start, dinner_end, insulin, objective_carbs, physical_activity, info_adicional, tipo_usuario);
                const resp = yield this.userService.updateUser(UserData, token);
                res.status(201).json({ "status": resp, "message": "Usuario actualizado" });
            }
            catch (err) {
                console.error(err);
                res.status(400).send(err.message);
            }
        });
    }
    testPredict(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pre = yield this.userService.tensorTest();
                res.status(200).json({ "predict": pre });
            }
            catch (err) {
                res.status(400).send(err.message);
            }
        });
    }
    verifyEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const email = req.params.email;
            try {
                const code = yield this.userService.verify(email);
                res.status(200).json({ "codigo": code });
            }
            catch (err) {
                res.status(400).send(err.message);
            }
        });
    }
    verifyPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const email = req.params.email;
            try {
                const code = yield this.userService.verifyPassword(email);
                res.status(200).json({ "codigo": code });
            }
            catch (err) {
                res.status(404).send("Email not Found");
            }
        });
    }
    changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.params.token;
            const oldPass = req.params.old;
            const newPass = req.params.new;
            try {
                const code = yield this.userService.changePassword(token, oldPass, newPass);
                res.status(200).json({ "status": code });
            }
            catch (err) {
                res.status(400).send(err.message);
            }
        });
    }
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.params.token;
            const newPass = req.params.new;
            try {
                const code = yield this.userService.resetPassword(token, newPass);
                res.status(200).json({ "status": code });
            }
            catch (err) {
                res.status(400).send(err.message);
            }
        });
    }
}
exports.UserController = UserController;
