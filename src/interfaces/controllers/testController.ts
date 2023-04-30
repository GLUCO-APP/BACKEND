import { Request, Response } from "express";
import { io } from "socket.io-client";


const socket = io("http://localhost:8080");
export class socketController{

    constructor(){}

    public async SocketTest(req: Request, res: Response): Promise<void> {
        // Escuchar un evento desde el servidor
        const message = req.params.message;
        socket.on("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imp1YW5AZXhhbXBsZS5jb20iLCJpYXQiOjE2ODE2MTkxMjl9.2sN6SSX6sC9OuANUhK3hbWYkwRj8BtUjV9s_kHttpzI", (msg: string) => {
            console.log("Mensaje recibido desde el servidor: ", msg);
        });
        
        // Enviar un mensaje al servidor
        socket.emit("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imp1YW5AZXhhbXBsZS5jb20iLCJpYXQiOjE2ODE2MTkxMjl9.2sN6SSX6sC9OuANUhK3hbWYkwRj8BtUjV9s_kHttpzI", message);
        
    }

}

