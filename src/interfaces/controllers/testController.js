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
exports.socketController = void 0;
class socketController {
    constructor() { }
    SocketTest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Escuchar un evento desde el servidor
            const message = req.params.message;
            const io = req.app.get('socketIo');
            // emit event to socket
            io.emit('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imp1YW5AZXhhbXBsZS5jb20iLCJpYXQiOjE2ODE2MTkxMjl9.2sN6SSX6sC9OuANUhK3hbWYkwRj8BtUjV9s_kHttpzI', message);
            res.send('Event emitted successfully');
        });
    }
}
exports.socketController = socketController;
