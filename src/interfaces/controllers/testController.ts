import { Request, Response } from "express";
import { io } from "socket.io-client";
import { Server as socketServer } from 'socket.io';
import { Server } from 'socket.io';



export class socketController{

    constructor(){}

    public async SocketTest(req: Request, res: Response): Promise<void> {
        // Escuchar un evento desde el servidor
        const message = req.params.message;

        const io: Server = req.app.get('socketIo');
  
        // emit event to socket
        io.emit('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imp1YW5AZXhhbXBsZS5jb20iLCJpYXQiOjE2ODE2MTkxMjl9.2sN6SSX6sC9OuANUhK3hbWYkwRj8BtUjV9s_kHttpzI', message);
      
        res.send('Event emitted successfully');
    }

}

