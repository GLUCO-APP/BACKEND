import { MySQLUserRepository } from "../../infrastructure/repositories/MySQLUserRepository";
import { Usuario } from "../../domain/entities/User"
import * as bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import * as tf from '@tensorflow/tfjs';
import * as Papa from 'papaparse';


export class UserService {
    private userRepository:MySQLUserRepository;

    constructor(userRepository:MySQLUserRepository){
        this.userRepository = userRepository;
    }

    public async addUser(usuario:Usuario):Promise<string>{
        return this.userRepository.add(usuario);
    }

    public async login(email:string, password:string):Promise<string>{
        const user = this.userRepository.findEmail(email)
        const foundUser = await user;
        if(foundUser){
            const match = await bcrypt.compare(password,foundUser.password);
            if (!match){
                return "contraseña incorrecta";
            }
            const token = jwt.sign({email:foundUser.email},process.env.TOKEN_SECRET || 'tokentest')
            return token;
        }else{
            return "usuario no encontrado";
        }
        
    }

    public async getUser(id:string):Promise<Usuario>{
        const iduser = this.userRepository.getUser(id);
        const foundUser = await iduser;

        return foundUser
    }


    public async updateUser(usuario: Usuario , id:string):Promise<void>{
        const iduser=this.userRepository.updateUser(usuario ,id);
        const foundUser = await iduser;
    }

    public tensorTest():Promise<string>{

        
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

}