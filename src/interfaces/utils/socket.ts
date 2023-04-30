import { Socket } from 'socket.io';

export const connectClient = (client: Socket) => {
    console.info(`Client connected [id=${client.id}]`);
    client.on('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imp1YW5AZXhhbXBsZS5jb20iLCJpYXQiOjE2ODE2MTkxMjl9.2sN6SSX6sC9OuANUhK3hbWYkwRj8BtUjV9s_kHttpzI', (value: any) => {
        console.log(`cliente`, client.id);
        console.log(value);
    });
    client.on('message', (value: any) => {
        console.log(`cliente`, client.id);
        client.emit('hello', { msg: 'yes' });
    });
};

export const disconnect = (client: Socket) => {
    client.on('disconnect', () => {
        console.log(`client disconect`);
    });
};