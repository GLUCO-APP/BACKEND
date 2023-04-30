import express from 'express';
import asyncify from 'express-asyncify';
import http from 'http';
import socketIO from 'socket.io';
import router from '../routes/routes';
import morgan from 'morgan';

interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
    hello: () => void;
}

interface InterServerEvents {
    ping: () => void;
}

interface SocketData {
    name: string;
    age: number;
}

import { Server as socketServer } from 'socket.io';

import * as socket from './socket'


export default class Server {
    public app: express.Application;
    public port: number;
    static io: any;

    // public io: socketIO.Server;

    private httpServer: http.Server;
    static sockets: any;

    public constructor() {
        this.app = asyncify(express());
        this.port = 8080;

        this.httpServer = new http.Server(this.app);
        Server.io = new socketServer<
            ClientToServerEvents,
            ServerToClientEvents,
            InterServerEvents,
            SocketData
        >(this.httpServer);
        this.listenSockets();
        this.app.set('socketIo', Server.io);

        this.app.use(function (req: any, res, next) {
            req.io = Server.io;
            next();
        });
        this.app.use(express.json());
        this.app.use(router);
        this.app.use(morgan('dev'));
    }

    start(callback: any) {
        this.httpServer.listen(this.port, callback);
    }

    private listenSockets() {
        Server.io.on('connection', (client: any) => {
            // Connect Client with socket server
            // console.log(client)
            socket.connectClient(client);
            // Disconnect client
            socket.disconnect(client);
        });
    }
}