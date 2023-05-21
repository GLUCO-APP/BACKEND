"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socketcon_1 = __importDefault(require("../interfaces/utils/socketcon"));
const supertest_1 = __importDefault(require("supertest"));
const chance_1 = __importDefault(require("chance"));
describe('Gluko', () => {
    describe('GET /allFoods', () => {
        it('debería devolver una lista con todos los alimentos y un parametro "success"', () => __awaiter(void 0, void 0, void 0, function* () {
            const server = new socketcon_1.default();
            const app = server.app;
            const request = (0, supertest_1.default)(app);
            // Realiza la solicitud GET a la ruta /api/example
            const response = yield request.get('/allFoods');
            // Verifica que la respuesta tenga un código 200 (OK)
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('success');
        }));
    });
    describe('POST /plate', () => {
        it('debería crear un plato en la base de datos y retorna sus datos con el id generado', () => __awaiter(void 0, void 0, void 0, function* () {
            const server = new socketcon_1.default();
            const app = server.app;
            const request = (0, supertest_1.default)(app);
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
            const response = yield request.post('/plate').send(data);
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
        }));
    });
    describe('POST /codebar/:code', () => {
        it('debería retornar un alimento dado un codigo de barras, si el alimento no esta en la bd lo registra', () => __awaiter(void 0, void 0, void 0, function* () {
            const server = new socketcon_1.default();
            const app = server.app;
            const request = (0, supertest_1.default)(app);
            const response = yield request.post('/codebar/3760020507350').send();
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id');
        }));
    });
    describe('POST /user', () => {
        it('debería crear un usuario en la base de datos y retona una confirmacion de creacion', () => __awaiter(void 0, void 0, void 0, function* () {
            const server = new socketcon_1.default();
            const app = server.app;
            const request = (0, supertest_1.default)(app);
            const chance = new chance_1.default();
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
            const response = yield request.post('/user').send(data);
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('status');
        }));
    });
    describe('POST /login', () => {
        it('valida la existencia y la concordancia de los datos proporcionados y autoriza el inicio de sesion', () => __awaiter(void 0, void 0, void 0, function* () {
            const server = new socketcon_1.default();
            const app = server.app;
            const request = (0, supertest_1.default)(app);
            const data = {
                email: 'juan@gmail.com',
                password: '12345'
            };
            const response = yield request.post('/login').send(data);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status');
        }));
    });
    describe('GET /user/:token', () => {
        it('prorporciona los datos de un usuario', () => __awaiter(void 0, void 0, void 0, function* () {
            const server = new socketcon_1.default();
            const app = server.app;
            const request = (0, supertest_1.default)(app);
            const response = yield request.get('/user/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imp1YW5oaXQ0NzE1MjNAZ21haWwuY29tIiwiaWF0IjoxNjg0MjEyMzcwfQ.KrqErZeDIVAU9N0WBahYfMJQS4P5s6zhn2tZJFf3gsg');
            expect(response.status).toBe(200);
        }));
    });
    describe('POST /report', () => {
        it('Crea un reporte en la base de datos', () => __awaiter(void 0, void 0, void 0, function* () {
            const server = new socketcon_1.default();
            const app = server.app;
            const request = (0, supertest_1.default)(app);
            const data = {
                id_plato: 5,
                token_usuario: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imp1YW5oaXQ0NzE1MjNAZ21haWwuY29tIiwiaWF0IjoxNjg0MjEyMzcwfQ.KrqErZeDIVAU9N0WBahYfMJQS4P5s6zhn2tZJFf3gsg",
                glucosa: 150,
                unidades_insulina: 3.5
            };
            const response = yield request.post('/report').send(data);
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
        }));
    });
    describe('GET /report/:token', () => {
        it('trae la informacion del ultimo reporte del ', () => __awaiter(void 0, void 0, void 0, function* () {
            const server = new socketcon_1.default();
            const app = server.app;
            const request = (0, supertest_1.default)(app);
            const response = yield request.get('/report/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imp1YW5oaXQ0NzE1MjNAZ21haWwuY29tIiwiaWF0IjoxNjg0MjEyMzcwfQ.KrqErZeDIVAU9N0WBahYfMJQS4P5s6zhn2tZJFf3gsg');
            expect(response.status).toBe(200);
        }));
    });
    describe('GET /allInsulin', () => {
        it('trae los datos de todas la insulinas', () => __awaiter(void 0, void 0, void 0, function* () {
            const server = new socketcon_1.default();
            const app = server.app;
            const request = (0, supertest_1.default)(app);
            const response = yield request.get('/allInsulin');
            expect(response.status).toBe(200);
        }));
    });
});
