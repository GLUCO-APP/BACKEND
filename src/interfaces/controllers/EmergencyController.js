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
exports.EmergencyContoller = void 0;
const EmergencyService_1 = require("../../application/services/EmergencyService");
class EmergencyContoller {
    constructor() {
        this.emergencyService = new EmergencyService_1.EmergencyService();
    }
    getFood(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.params.token;
            const ind = parseInt(req.params.ind);
            try {
                const response = yield this.emergencyService.getAll(token, ind);
                res.status(response.status).json(response.body);
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Something went wrong' });
            }
        });
    }
}
exports.EmergencyContoller = EmergencyContoller;
