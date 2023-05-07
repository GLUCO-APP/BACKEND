import { MySQLUserRepository } from "../../infrastructure/repositories/MySQLUserRepository";
import { Usuario } from "../../domain/entities/User"
import * as bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import * as tf from '@tensorflow/tfjs';
import * as Papa from 'papaparse';
import { rejects } from "assert";
import { Insulin } from "../../domain/entities/Insulin";
const nodemailer = require('nodemailer');


export class UserService {
    private userRepository: MySQLUserRepository;

    constructor(userRepository: MySQLUserRepository) {
        this.userRepository = userRepository;
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

    public async updateUser(usuario: Usuario, token: string): Promise<void> {
        const tkuser = this.userRepository.updateUser(usuario, token);
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


        // Obtener la contraseña del usuario
        const tkUser = await this.userRepository.getPass(token);
        // Comparar la contraseña antigua con la almacenada en la base de datos
        const match = tkUser && await bcrypt.compare(oldPass, tkUser);
        // Si la contraseña no coincide o el valor de tkUser está vacío, devolver un mensaje de error
        if (!match) {
            return "contraseña incorrecta";
        }
        // Si la contraseña coincide, actualizarla con la nueva contraseña
        try {
            const response = await this.userRepository.UpdatePass(token, newPass);
            if (!response) {
                // En caso de que el valor de respuesta sea null o undefined, se ejecuta esta condición.
                return "Ocurrió un error al actualizar la contraseña";
            }
            return "Contraseña actualizada exitosamente";
        } catch (error) {
            console.log(error);
            return "Ocurrió un error al actualizar la contraseña";
        }
    }

    public async resetPassword(token: string, newPass: string): Promise<string> {

        try {
            const response = await this.userRepository.UpdatePass(token, newPass);
            if (!response) {
                return "Ocurrió un error al actualizar la contraseña";
            }
            return "Contraseña actualizada exitosamente";
        } catch (error) {
            console.log(error);
            return "Ocurrió un error al actualizar la contraseña";
        }
    }


}