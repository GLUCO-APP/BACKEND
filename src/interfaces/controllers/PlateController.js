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
exports.PlateController = void 0;
const PlateService_1 = require("../../application/services/PlateService");
const Plate_1 = require("../../domain/entities/Plate");
const MySQLPlateRepository_1 = require("../../infrastructure/repositories/MySQLPlateRepository");
class PlateController {
    constructor() {
        this.plateService = new PlateService_1.PlateService(new MySQLPlateRepository_1.MySQLPlateRepository());
    }
    addPlate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fechac = new Date();
                const { foods, sugarEstimate, latitude, longitude, address, Carbohydrates, Proteins, Fats, Description, Title, type, public_plate } = req.body;
                const plateData = new Plate_1.Plate(foods, sugarEstimate, latitude, longitude, address, Carbohydrates, Proteins, Fats, Description, Title, fechac, type, public_plate);
                const plate = yield this.plateService.addPlate(plateData);
                res.status(201).json(plate);
            }
            catch (err) {
                res.status(400).send(err.message);
            }
        });
    }
}
exports.PlateController = PlateController;
