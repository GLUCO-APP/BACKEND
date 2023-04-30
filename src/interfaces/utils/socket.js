"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnect = exports.connectClient = void 0;
const connectClient = (client) => {
    console.info(`Client connected [id=${client.id}]`);
    client.on('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imp1YW5AZXhhbXBsZS5jb20iLCJpYXQiOjE2ODE2MTkxMjl9.2sN6SSX6sC9OuANUhK3hbWYkwRj8BtUjV9s_kHttpzI', (value) => {
        console.log(`cliente`, client.id);
        console.log(value);
    });
    client.on('message', (value) => {
        console.log(`cliente`, client.id);
        client.emit('hello', { msg: 'yes' });
    });
};
exports.connectClient = connectClient;
const disconnect = (client) => {
    client.on('disconnect', () => {
        console.log(`client disconect`);
    });
};
exports.disconnect = disconnect;
