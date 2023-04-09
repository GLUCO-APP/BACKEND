import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import router from './interfaces/routes/routes';
import morgan from 'morgan';

const app = express();

app.use(express.json());
app.use(router);
app.use(morgan('dev'));

app.listen(8080, () => {
  console.log('Servidor corriendo en el puerto 8080');
});
