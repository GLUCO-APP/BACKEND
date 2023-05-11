import { Request, Response } from "express";
import { io } from "socket.io-client";
import { Server as socketServer } from 'socket.io';
import { Server } from 'socket.io';



export class socketController{

    constructor(){}

    public async SocketTest(req: Request, res: Response): Promise<void> {
        // Escuchar un evento desde el servidor
        const message = req.params.message;
        const socket = req.params.socket;

        const io: Server = req.app.get('socketIo');
  
        // emit event to socket
        io.emit(socket, message);
      
        res.send('Event emitted successfully');
    }

}

