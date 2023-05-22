
import Server from '../interfaces/utils/socketcon'
import  request  from 'supertest'
import supertest from 'supertest';
import Chance from "chance";





describe('Gluko', () => {
    describe('GET /allFoods', () => {
      it('debería devolver una lista con todos los alimentos y un parametro "success"', async () => {
        const server = new Server();
        const app = server.app;
        const request = supertest(app);
  
        // Realiza la solicitud GET a la ruta /api/example
        const response = await request.get('/allFoods');
  
        // Verifica que la respuesta tenga un código 200 (OK)
        expect(response.status).toBe(200);
  
        expect(response.body).toHaveProperty('success');
      });
    });
    describe('POST /plate', () => {
        it('debería crear un plato en la base de datos y retorna sus datos con el id generado', async () => {
            const server = new Server();
            const app = server.app;
            const request = supertest(app);
            
            const data = {
                foods: [
                  {
                    id: 9
                  },
                  {
                    id: 10
                  },
                  {
                    id: 12
                  }
                ],
                sugarEstimate: 2,
                latitude: 40.7128,
                longitude: -74.0060,
                address: "New York City"
              };

              const response = await request.post('/plate').send(data);
              expect(response.status).toBe(201);
              expect(response.body).toHaveProperty('id');
           
          });
    });
    describe('POST /codebar/:code', () => {
        it('debería retornar un alimento dado un codigo de barras, si el alimento no esta en la bd lo registra', async () => {
            const server = new Server();
            const app = server.app;
            const request = supertest(app);
            
            const response = await request.post('/codebar/3760020507350').send();
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id');
           
          });
    });
    describe('POST /user', () => {
        it('debería crear un usuario en la base de datos y retona una confirmacion de creacion', async () => {
            const server = new Server();
            const app = server.app;
            const request = supertest(app);
            const chance = new Chance();
            const data = {
                nombre: "Juan Rincon",
                email: chance.email(),
                password: "contraseña123",
                fecha_nacimiento: "1990-01-01",
                fecha_diagnostico: "2020-01-01",
                edad: 31,
                genero: "Masculino",
                peso: 80,
                estatura: 175,
                tipo_diabetes: "Tipo 1",
                tipo_terapia: "Insulina",
                hyper: 160,
                estable: 120,
                hipo: 70,
                sensitivity: 50,
                rate: 1,
                basal: "22:00",
                breakfast_start: "08:00",
                breakfast_end: "10:00",
                lunch_start: "13:00",
                lunch_end: "15:00",
                dinner_start: "20:00",
                dinner_end: "22:00",
                insulin: [
                  { id: 1 },
                  { id: 2 }
                ],
                objective_carbs: 60,
                physical_activity: 1.5,
                info_adicional: "Ninguna",
                tipo_usuario: "Tutor"
              };
              const response = await request.post('/user').send(data);
              expect(response.status).toBe(201);
              expect(response.body).toHaveProperty('status');
           
          });
    });
    describe('POST /login', () => {
      it('valida la existencia y la concordancia de los datos proporcionados y autoriza el inicio de sesion', async () => {
        const server = new Server();
        const app = server.app;
        const request = supertest(app);
        const data = {
          email: 'juan@gmail.com',
          password: '12345'
        }
        const response = await request.post('/login').send(data);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('status'); 
       
      });
    });
    describe('GET /user/:token', () => {
      it('prorporciona los datos de un usuario', async () => {
        const server = new Server();
        const app = server.app;
        const request = supertest(app);
        const response = await request.get('/user/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imp1YW5oaXQ0NzE1MjNAZ21haWwuY29tIiwiaWF0IjoxNjg0MjEyMzcwfQ.KrqErZeDIVAU9N0WBahYfMJQS4P5s6zhn2tZJFf3gsg');
        expect(response.status).toBe(200);
      });
    });
    describe('POST /report', () => {
      it('Crea un reporte en la base de datos', async () => {
        const server = new Server();
        const app = server.app;
        const request = supertest(app);
        const data = {
          id_plato: 5,
          token_usuario: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRvd2lAbGFhYmUucGwiLCJpYXQiOjE2ODQ2MjM4NTd9.2Jsh4lUdmLRtBsCkkTERMoMOIBZGan7qcZ-jZ0bBNf8",
          glucosa: 150,
          unidades_insulina: 3.5
        };
        const response = await request.post('/report').send(data);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
      });
    });
    describe('GET /report/:token', () => {
      it('trae la informacion del ultimo reporte del ', async () => {
        const server = new Server();
        const app = server.app;
        const request = supertest(app);
        const response = await request.get('/report/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imp1YW5oaXQ0NzE1MjNAZ21haWwuY29tIiwiaWF0IjoxNjg0MjEyMzcwfQ.KrqErZeDIVAU9N0WBahYfMJQS4P5s6zhn2tZJFf3gsg');
        expect(response.status).toBe(200);
      });
    });
    describe('GET /allInsulin', () => {
      it('trae los datos de todas la insulinas', async () => {
        const server = new Server();
        const app = server.app;
        const request = supertest(app);
        const response = await request.get('/allInsulin');
        expect(response.status).toBe(200);
      });
    });
    describe('GET /update', () => {
      it('actualiza los datos del usuario', async () => {
        const server = new Server();
        const app = server.app;
        const request = supertest(app);
        const data = {
          usuario: {
            nombre: "Mateo Andrés Arenas Angel",
            email: "mathe.andres99@gmail.com",
            fecha_nacimiento: "1999-02-16T05:00:00.000Z",
            fecha_diagnostico: "2019-04-25T05:00:00.000Z",
            edad: 24,
            genero: "Masculino",
            peso: 63,
            estatura: 176,
            tipo_diabetes: "Tipo 1",
            tipo_terapia: "Insulina",
            hyper: 180,
            estable: 120,
            hipo: 60,
            sensitivity: 40,
            rate: 14,
            basal: "22:00:00",
            breakfast_start: "06:00:00",
            breakfast_end: "10:00:00",
            lunch_start: "12:30:00",
            lunch_end: "14:00:00",
            dinner_start: "19:00:00",
            dinner_end: "21:30:00",
            objective_carbs: 300,
            physical_activity: 1,
            info_adicional: "no aplica",
            tipo_usuario: "paciente",
          },
          ins: [
            {
              id: 4,
              name: "Novorapid Aspart",
              type: "Bolo",
              iprecision: 0.5,
              duration: 4,
            },
            {
              id: 8,
              name: "Lantus Glargina",
              type: "Basal",
              iprecision: 1,
              duration: 24,
            },
          ],
        };
        const response = await request.put('/update/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1hdGhlLmFuZHJlczk5QGdtYWlsLmNvbSIsImlhdCI6MTY4Mzc2OTM2MH0.8N5VhuXAWvwXDpmGZr06im1OBrUA4TpeF2d46XI-t84').send(data);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('status');
      });
    });

  });


