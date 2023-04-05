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
exports.UserController = void 0;
const UserService_1 = require("../../application/services/UserService");
const User_1 = require("../../domain/entities/User");
const MySQLUserRepository_1 = require("../../infrastructure/repositories/MySQLUserRepository");
class UserController {
    constructor() {
        this.userService = new UserService_1.UserService(new MySQLUserRepository_1.MySQLUserRepository());
    }
    addUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nombre, email, password, fechaNacimiento, fechaDiagnostico, telefono, edad, genero, peso, estatura, tipoDiabetes, tipoTerapia, unidades, rango, sensitivity, rate, precis, breakfast, lunch, dinner, glucometer, objective, physicalctivity, infoAdicional, } = req.body;
                const UserData = new User_1.Usuario(nombre, email, password, fechaNacimiento, fechaDiagnostico, telefono, edad, genero, peso, estatura, tipoDiabetes, tipoTerapia, unidades, rango, sensitivity, rate, precis, breakfast, lunch, dinner, glucometer, objective, physicalctivity, infoAdicional);
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
            try {
                const { email, password, } = req.body;
                const token = yield this.userService.login(email, password);
                res.status(200).json({ "status": token });
            }
            catch (err) {
                res.status(400).send(err.message);
            }
        });
    }
    getUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.id;
            const user = yield this.userService.getUser(userId);
            if (user === null) {
                res.status(404).json({ message: 'Usuario no encontrado' });
            }
            else {
                res.status(200).json(user);
            }
        });
    }
}
exports.UserController = UserController;
