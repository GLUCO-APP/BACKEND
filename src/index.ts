import express from 'express';
import router from './interfaces/routes/routes';

const app = express();

app.use(express.json());
app.use(router);

app.listen(80, () => {
  console.log('Servidor corriendo en el puerto 80');
});
