import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import router from './interfaces/routes/routes';
import morgan from 'morgan';
import Server from './interfaces/utils/socketcon'
import http from 'http';



const app = express();


const server = new Server();

if (!module.parent) {

  server.start(() => {
      console.log(`Server listening in port ${server.port} Test Git new image`);
    });
}