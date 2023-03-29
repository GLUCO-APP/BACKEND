import { Usuario } from "../entities/User";

export interface UserRepository{
    add(usuario:Usuario):Promise<string>;
}