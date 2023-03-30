import { Request,Response } from "express";
import { UserService } from "../../application/services/UserService";
import { Usuario } from "../../domain/entities/User";
import { MySQLUserRepository } from "../../infrastructure/repositories/MySQLUserRepository";

export class UserController{
    private userService: UserService;

    constructor(){
        this.userService = new UserService(new MySQLUserRepository());
    }

    public async addUser(req: Request, res:Response):Promise<void>{
        try{
            const { 
                nombre, 
                email, 
                password, 
                fechaNacimiento, 
                fechaDiagnostico, 
                telefono, 
                edad, 
                genero, 
                peso, 
                estatura, 
                tipoDiabetes, 
                tipoTerapia, 
                unidades, 
                rango, 
                sensitivity, 
                rate, 
                precis, 
                breakfast, 
                lunch, 
                dinner, 
                glucometer, 
                objective, 
                physicalctivity, 
                infoAdicional,
              } = req.body;
              const UserData: Usuario = new Usuario(nombre,email, password,fechaNacimiento,fechaDiagnostico,telefono,edad,genero,peso,estatura,tipoDiabetes,tipoTerapia,unidades,rango,sensitivity,rate,precis,breakfast,lunch,dinner,glucometer,objective,physicalctivity,infoAdicional);
              const resp = await this.userService.addUser(UserData);
              res.status(201).json({ "status": resp });
            }catch(err:any){
                console.error(err);
                res.status(400).send(err.message);
            }
    }

    public async login(req:Request, res:Response):Promise<void>{
        try{
            const {
                email,
                password,
            } = req.body;
            const token = await this.userService.login(email,password);
            res.status(200).json({"status":token})
        }catch(err:any){
            res.status(400).send(err.message);
        }
    }
}