"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./interfaces/routes/routes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(routes_1.default);
app.listen(8080, () => {
    console.log('Servidor corriendo en el puerto 8080');
});
