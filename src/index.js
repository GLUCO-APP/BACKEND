"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const socketcon_1 = __importDefault(require("./interfaces/utils/socketcon"));
const app = (0, express_1.default)();
const server = new socketcon_1.default();
if (!module.parent) {
    server.start(() => {
        console.log(`Server listening in port ${server.port} Test Git new image`);
    });
}
