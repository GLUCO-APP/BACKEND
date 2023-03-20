"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
const dbGluko = promise_1.default.createPool({
    host: 'glukodb.c1kq28okfsde.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'admin2023',
    database: 'gluko',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
exports.default = dbGluko;
