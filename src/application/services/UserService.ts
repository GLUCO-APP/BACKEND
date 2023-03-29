import { MySQLUserRepository } from "../../infrastructure/repositories/MySQLUserRepository";
import { Usuario } from "../../domain/entities/User"


export class UserService {
    private userRepository:MySQLUserRepository;

    constructor(userRepository:MySQLUserRepository){
        this.userRepository = userRepository;
    }

    public async addUser(usuario:Usuario):Promise<string>{
        return this.userRepository.add(usuario);
    }
}