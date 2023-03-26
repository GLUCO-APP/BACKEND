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
                const { nombre, email, password, fechaNacimiento, fechaDiagnostico, telefono, edad, genero, peso, estatura, tipoDiabetes, tipoTerapia, unidades, rango, sensitivity, rate, precis, breakfast, lunch, dinner, glucometer, objective, physicalctivity, infoAdicional } = req.body;
                const UserData = new User_1.Usuario(nombre, email, password, fechaNacimiento, fechaDiagnostico, telefono, edad, genero, peso, estatura, tipoDiabetes, tipoTerapia, unidades, rango, sensitivity, rate, precis, breakfast, lunch, dinner, glucometer, objective, physicalctivity, infoAdicional);
                const User = yield this.userService.addUser(UserData);
                res.status(201).json(User);
            }
            catch (err) {
                console.error(err);
                res.status(400).send(err.message);
            }
        });
    }
}
exports.UserController = UserController;