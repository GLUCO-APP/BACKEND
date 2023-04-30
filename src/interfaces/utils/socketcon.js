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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_asyncify_1 = __importDefault(require("express-asyncify"));
const http_1 = __importDefault(require("http"));
const routes_1 = __importDefault(require("../routes/routes"));
const morgan_1 = __importDefault(require("morgan"));
const socket_io_1 = require("socket.io");
const socket = __importStar(require("./socket"));
class Server {
    constructor() {
        this.app = (0, express_asyncify_1.default)((0, express_1.default)());
        this.port = 8080;
        this.httpServer = new http_1.default.Server(this.app);
        Server.io = new socket_io_1.Server(this.httpServer);
        this.listenSockets();
        this.app.set('socketIo', Server.io);
        this.app.use(function (req, res, next) {
            req.io = Server.io;
            next();
        });
        this.app.use(express_1.default.json());
        this.app.use(routes_1.default);
        this.app.use((0, morgan_1.default)('dev'));
    }
    start(callback) {
        this.httpServer.listen(this.port, callback);
    }
    listenSockets() {
        Server.io.on('connection', (client) => {
            // Connect Client with socket server
            // console.log(client)
            socket.connectClient(client);
            // Disconnect client
            socket.disconnect(client);
        });
    }
}
exports.default = Server;
