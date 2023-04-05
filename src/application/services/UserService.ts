import { MySQLUserRepository } from "../../infrastructure/repositories/MySQLUserRepository";
import { Usuario } from "../../domain/entities/User"
import * as bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";


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

    
}