"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcrypt = __importStar(require("bcryptjs"));
const tf = __importStar(require("@tensorflow/tfjs"));
const nodemailer = require('nodemailer');
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    smartNotifications(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const glucolevel = yield this.userRepository.getglycemia(token);
            const glucosalevel = glucolevel.glucemias;
            const timeStamps = glucolevel.fechas;
            console.log(glucosalevel);
            console.log(timeStamps);
            const gl = glucosalevel.map((stringNumber) => Number(stringNumber));
            const formattedDates = [];
            timeStamps.forEach((timeStamps) => {
                const date = new Date(timeStamps);
                const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
                formattedDates.push(formattedDate);
            });
            console.log(formattedDates);
            // Dividir los datos en conjuntos de entrenamiento y prueba
            const numData = gl.length;
            const trainingDataSize = 0.8; // El 80% de los datos se usa para entrenamiento
            const numTrainingData = Math.floor(trainingDataSize * numData);
            const trainData = tf.tensor1d(gl.slice(0, numTrainingData)); // datos de entrenamiento de glucemia
            const testData = tf.tensor1d(gl.slice(numTrainingData)); // datos de prueba de glucemia
            const testTimeStamps = formattedDates.slice(numTrainingData); // tiempos de prueba
            // Crear modelo secuencial de red neuronal de una sola capa densa
            const model = tf.sequential();
            model.add(tf.layers.dense({
                inputShape: [1],
                units: 1, // Una única salida (predicción de glucemia)
            }));
            // Definir la función de pérdida y optimizador
            model.compile({
                loss: 'meanSquaredError',
                optimizer: 'adam',
            });
            // Entrenar el modelo
            const history = yield model.fit(trainData, trainData, { epochs: 1000 });
            console.log("llegue");
            // Usar el modelo para hacer predicciones
            const predictions = yield model.predict(testData);
            console.log(predictions);
            // asumiendo que las predicciones están almacenadas en una variable llamada "predictions"
            console.log(predictions.arraySync()); // muestra los valores de las predicciones en la consola
            const now = new Date();
            const options = {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric'
            };
            const formattedDate = now.toLocaleString('es-ES', options);
            console.log(formattedDate);
            console.log(now);
            return formattedDate;
        });
    }
    getUsetype(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userRepository.getUsetype(token);
        });
    }
    getInsulinUser(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userRepository.getInsulinsUser(ids);
        });
    }
    getInsulinids(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userRepository.getInsulinids(id);
        });
    }
    getId(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userRepository.getId(token);
        });
    }
    getInsulins() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userRepository.getInsulins();
        });
    }
    addUser(usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userRepository.add(usuario);
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = this.userRepository.findEmail(email);
            const foundUser = yield user;
            if (foundUser) {
                const match = yield bcrypt.compare(password, foundUser.password);
                if (!match) {
                    return "contraseña incorrecta";
                }
                //const token = jwt.sign({email:foundUser.email},process.env.TOKEN_SECRET || 'tokentest')
                const token = this.userRepository.findToken(email);
                return token;
            }
            else {
                return "usuario no encontrado";
            }
        });
    }
    getToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const tkUser = this.userRepository.getToken(token);
            const foundUser = yield tkUser;
            return foundUser;
        });
    }
    updateUser(usuario, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const tkuser = this.userRepository.updateUser(usuario, token);
            const foundUser = yield tkuser;
        });
    }
    tensorTest() {
        const model = tf.sequential();
        const inputShape = [3];
        model.add(tf.layers.dense({ units: 1, inputShape }));
        model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });
        const xs = tf.tensor2d([[250, 18, 1], [295, 21, 1], [270, 24, 1], [240, 14, 1], [250, 20, 1], [260, 19, 1], [250, 17, 1]]);
        const ys = tf.tensor2d([[110], [114], [175], [100], [159], [110], [116]]);
        model.fit(xs, ys, { epochs: 100 });
        const input = tf.tensor2d([[280, 16, 1]]);
        const prediction = model.predict(input);
        console.log(prediction.dataSync()[0]);
        const result = prediction.dataSync()[0].toString();
        return Promise.resolve(result);
    }
    verify(email) {
        return new Promise((resolve, reject) => {
            // Configurar transporte SMTP
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'glukoservice@gmail.com',
                    pass: 'nqfwmxpvzhissilq',
                },
            });
            const min = 10000;
            const max = 99999;
            const randomNumber = Math.floor(Math.random() * (max - min + 1) + min);
            console.log(randomNumber);
            const mailOptions = {
                from: 'glukoservice@gmail.com',
                to: email,
                subject: 'Verificación de correo electrónico de Gluko',
                html: `<div>
                        <style>
                            p { margin-bottom: 10px; }
                        </style>
                        <p>Estimado/a Usuario,</p>
            
                        <p>Gracias por registrarte en la aplicación Gluko. Para completar tu registro, necesitamos verificar tu dirección de correo electrónico.</p>
            
                        <p>Tu código de verificación es: <strong>${randomNumber}</strong></p>
            
                        <p>Por favor, introduce este código en la aplicación para confirmar tu dirección de correo electrónico y continuar el proceso de registro.</p>
            
                        <p>Si no te has registrado en Gluko, por favor ignora este correo electrónico.</p>
            
                        <p>Gracias por elegir Gluko. Si tienes alguna pregunta o problema, por favor no dudes en contactar con nosotros.</p>
            
                        <p>Atentamente,</p>
                        <p>Equipo de Gluko</p>
                    </div>`
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    reject(500);
                }
                else {
                    console.log('Correo electrónico enviado: ' + info.response);
                    resolve(randomNumber); // Resuelve la promesa con el número aleatorio generado
                }
            });
        });
    }
    verifyPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const existEmail = yield this.userRepository.findEmail(email);
            // Verificar si el correo electrónico está registrado
            if (!existEmail) {
                throw new Error('El correo electrónico no está registrado.');
            }
            return new Promise((resolve, reject) => {
                // Configurar transporte SMTP
                const transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: 'glukoservice@gmail.com',
                        pass: 'nqfwmxpvzhissilq',
                    },
                });
                const min = 10000;
                const max = 99999;
                const randomNumber = Math.floor(Math.random() * (max - min + 1) + min);
                const mailOptions = {
                    from: 'glukoservice@gmail.com',
                    to: email,
                    subject: 'Verificación de cambio de contraseña de Gluko',
                    html: `<div>
                    <style>
                        p { margin-bottom: 10px; }
                    </style>
                    <p>Estimado/a Usuario,</p>
    
                    <p>Hemos recibido una solicitud para cambiar la contraseña de tu cuenta Gluko. Para completar el cambio, necesitamos verificar que es realmente tú quien ha solicitado el cambio.</p>
    
                    <p>Tu código de verificación es: <strong>${randomNumber}</strong></p>
    
                    <p>Por favor, introduce este código en la aplicación para verificar y completar el cambio de contraseña.</p>
    
                    <p>Si no has solicitado cambiar tu contraseña en Gluko, por favor ignora este correo electrónico.</p>
    
                    <p>Gracias por elegir Gluko. Si tienes alguna pregunta o problema, por favor no dudes en contactar con nosotros.</p>
    
                    <p>Atentamente,</p>
                    <p>Equipo de Gluko</p>
                </div>`
                };
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error);
                        reject(500);
                    }
                    else {
                        console.log('Correo electrónico enviado: ' + info.response);
                        resolve(randomNumber);
                    }
                });
            });
        });
    }
    changePassword(token, oldPass, newPass) {
        return __awaiter(this, void 0, void 0, function* () {
            // Obtener la contraseña del usuario
            const tkUser = yield this.userRepository.getPass(token);
            // Comparar la contraseña antigua con la almacenada en la base de datos
            const match = tkUser && (yield bcrypt.compare(oldPass, tkUser));
            // Si la contraseña no coincide o el valor de tkUser está vacío, devolver un mensaje de error
            if (!match) {
                return "contraseña incorrecta";
            }
            // Si la contraseña coincide, actualizarla con la nueva contraseña
            try {
                const response = yield this.userRepository.UpdatePass(token, newPass);
                if (!response) {
                    // En caso de que el valor de respuesta sea null o undefined, se ejecuta esta condición.
                    return "Ocurrió un error al actualizar la contraseña";
                }
                return "Contraseña actualizada exitosamente";
            }
            catch (error) {
                console.log(error);
                return "Ocurrió un error al actualizar la contraseña";
            }
        });
    }
    resetPassword(token, newPass) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.userRepository.UpdatePass(token, newPass);
                if (!response) {
                    return "Ocurrió un error al actualizar la contraseña";
                }
                return "Contraseña actualizada exitosamente";
            }
            catch (error) {
                console.log(error);
                return "Ocurrió un error al actualizar la contraseña";
            }
        });
    }
}
exports.UserService = UserService;
