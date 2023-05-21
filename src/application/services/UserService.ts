import { MySQLUserRepository } from "../../infrastructure/repositories/MySQLUserRepository";
import { Usuario } from "../../domain/entities/User"
import { UsuarioUpd } from "../../domain/entities/UserUpd";
import * as bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import * as tf from '@tensorflow/tfjs';
import * as Papa from 'papaparse';
import { rejects } from "assert";
import { Insulin } from "../../domain/entities/Insulin";
const nodemailer = require('nodemailer');
import { Server } from 'socket.io';


export class UserService {
    private userRepository: MySQLUserRepository;

    constructor(userRepository: MySQLUserRepository) {
        this.userRepository = userRepository;
    }

    public async smartNotifications(token:String):Promise<number[]> {
        const glucolevel = await this.userRepository.getglycemia(token);

        const glucosalevel = glucolevel.glucemias;
        const timeStamps = glucolevel.fechas;

        console.log(glucosalevel);
        console.log(timeStamps);

        const gl: number[] = glucosalevel.map((stringNumber: number) => Number(stringNumber));

        const formattedDates: string[] = [];

        timeStamps.forEach((timeStamps: string) => {
        const date: Date = new Date(timeStamps);
        const formattedDate: string = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
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
        inputShape: [1], // Una única entrada (la glucemia)
        units: 1, // Una única salida (predicción de glucemia)
        }));

        // Definir la función de pérdida y optimizador
        model.compile({
        loss: 'meanSquaredError',
        optimizer: 'adam',
        });
        
        // Entrenar el modelo
        const history = await model.fit(trainData, trainData, { epochs: 1000 });
        console.log("llegue");
        // Usar el modelo para hacer predicciones
        const predictions = await model.predict(testData) as tf.Tensor;
        console.log(predictions);
        // asumiendo que las predicciones están almacenadas en una variable llamada "predictions"
        const predictionsArray = predictions.arraySync();
         // muestra los valores de las predicciones en la consola
        console.log(predictionsArray)
        return predictionsArray as number[]

    }
    public async getUsetype(token:String):Promise<String> {
        return this.userRepository.getUsetype(token);
    }

    public async getInsulinUser(ids:Number[]):Promise<Insulin[]>{
        return this.userRepository.getInsulinsUser(ids);
    }

    public async getInsulinids(id:number):Promise<Number[]>{
        return this.userRepository.getInsulinids(id);
    }

    public async getId(token:string):Promise<number>{
        return this.userRepository.getId(token);
    }

    public async getInsulins():Promise<Insulin[]>{
        return this.userRepository.getInsulins();
    }

    public async addUser(usuario: Usuario): Promise<string> {
        return this.userRepository.add(usuario);
    }

    public async login(email: string, password: string): Promise<string> {
        const user = this.userRepository.findEmail(email)
        const foundUser = await user;
        if (foundUser) {
            const match = await bcrypt.compare(password, foundUser.password);
            if (!match) {
                return "contraseña incorrecta";
            }
            //const token = jwt.sign({email:foundUser.email},process.env.TOKEN_SECRET || 'tokentest')
            const token = this.userRepository.findToken(email)
            return token;
        } else {
            return "usuario no encontrado";
        }
    }

    public async getToken(token: string): Promise<Usuario | null> {
        const tkUser = this.userRepository.getToken(token);
        const foundUser = await tkUser;
        return foundUser
    }

    public async updateUser(usuario: UsuarioUpd, token: string , insulinas : Insulin[]): Promise<void> {
        const tkuser = this.userRepository.updateUser(usuario, token , insulinas);
        const foundUser = await tkuser;
    }

    public tensorTest(): Promise<string> {

        const model = tf.sequential();
        const inputShape = [3];
        model.add(tf.layers.dense({ units: 1, inputShape }));
        model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });

        const xs = tf.tensor2d([[250, 18, 1], [295, 21, 1], [270, 24, 1], [240, 14, 1], [250, 20, 1], [260, 19, 1], [250, 17, 1]]);
        const ys = tf.tensor2d([[110], [114], [175], [100], [159], [110], [116]]);
        model.fit(xs, ys, { epochs: 100 });
        const input = tf.tensor2d([[280, 16, 1]]);
        const prediction = model.predict(input) as tf.Tensor1D;
        console.log(prediction.dataSync()[0]);
        const result = prediction.dataSync()[0].toString();

        return Promise.resolve(result);

    }



    public verify(email: string): Promise<number> {

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
            transporter.sendMail(mailOptions, (error: Error | null, info: any) => {
                if (error) {
                    console.log(error);
                    reject(500);
                } else {
                    console.log('Correo electrónico enviado: ' + info.response);
                    resolve(randomNumber); // Resuelve la promesa con el número aleatorio generado
                }
            });
        });
    }



    public async verifyPassword(email: string): Promise<number> {
        const existEmail = await this.userRepository.findEmail(email);

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
            transporter.sendMail(mailOptions, (error: Error | null, info: any) => {
                if (error) {
                    console.log(error);
                    reject(500);
                } else {
                    console.log('Correo electrónico enviado: ' + info.response);
                    resolve(randomNumber);
                }
            });
        });
    }


    public async changePassword(token: string, oldPass: string, newPass: string): Promise<string> {


        const tkUser = await this.userRepository.getPass(token);
        
        const match = tkUser && await bcrypt.compare(oldPass, tkUser);
        
        if (  !match ) {
            return "contraseña incorrecta";
        }
        const user = await this.userRepository.getToken(token)
        if (  !user ) {
            return "No se encontro el usuario";
        }
        try {
            const response = await this.userRepository.UpdatePass(user?.email, newPass);
            if (!response) {
                return "Ocurrió un error al actualizar la contraseña";
            }
            return "Contraseña actualizada exitosamente";
        } catch (error) {
            return "Ocurrió un error al actualizar la contraseña";
        }
    }

    public async resetPassword(email: string, newPass: string): Promise<string> {

        try {
            const response = await this.userRepository.UpdatePass(email, newPass);
            if (!response) {
                return "Ocurrió un error al actualizar la contraseña";
            }
            return "Contraseña actualizada exitosamente";
        } catch (error) {
            return "Ocurrió un error";
        }
    }


}