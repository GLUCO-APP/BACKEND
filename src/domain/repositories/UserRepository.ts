import { Insulin } from "../entities/Insulin";
import { Usuario } from "../entities/User";
import { glycemia } from "../entities/glycemia";

export interface UserRepository{
    add(usuario:Usuario):Promise<string>;
    findEmail(email:string):Promise<Usuario | null>
    getInsulins():Promise<Insulin[]>
    getId(token:string):Promise<number>
    getInsulinids(id:number):Promise<Number[]>
    getInsulinsUser(ids:Number[]):Promise<Insulin[]>
    getUsetype(token:String):Promise<String>
    getglycemia(token:String):Promise<glycemia>
}