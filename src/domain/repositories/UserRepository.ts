import { Insulin } from "../entities/Insulin";
import { Usuario } from "../entities/User";

export interface UserRepository{
    add(usuario:Usuario):Promise<string>;
    findEmail(email:string):Promise<Usuario | null>
    getInsulins():Promise<Insulin[]>
    getId(token:string):Promise<number>
    getInsulinids(id:number):Promise<Number[]>
    getInsulinsUser(ids:Number[]):Promise<Insulin[]>
}