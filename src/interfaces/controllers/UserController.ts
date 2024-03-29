import { Request, Response } from "express";
import { UserService } from "../../application/services/UserService";
import { Usuario } from "../../domain/entities/User";
import { UsuarioUpd } from "../../domain/entities/UserUpd";
import { Insulin } from "../../domain/entities/Insulin";
import { MySQLUserRepository } from "../../infrastructure/repositories/MySQLUserRepository";
import morgan from "morgan";
import { Server } from 'socket.io';

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService(new MySQLUserRepository());
    }

    public async testgluService(req: Request, res: Response): Promise<void> {
        const token = req.params.token;
        try {
            await this.userService.smartNotifications(token);
            res.status(200).send("Prueba ejecutada");
        } catch (err: any) {
            console.error(err);
            res.status(500).send(err.message);
        }
    }
    public async getUsetype(req: Request, res: Response): Promise<void> {
        const token = req.params.token;
        try {
            const tipo = await this.userService.getUsetype(token);
            console.log(tipo)
            res.status(200).json({ success: true, tipo: tipo });

        } catch (err: any) {
            console.error(err);
            res.status(500).send(err.message);
        }
    }
    public async getInsulins(req: Request, res: Response): Promise<void> {
        try {
            const insulins = await this.userService.getInsulins();
            res.status(200).json({ success: true, data: insulins });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Something went wrong' });
        }
    }

    public async addUser(req: Request, res: Response): Promise<void> {
        try {
            const {
                nombre,
                email,
                password,
                fecha_nacimiento,
                fecha_diagnostico,
                edad,
                genero,
                peso,
                estatura,
                tipo_diabetes,
                tipo_terapia,
                hyper,
                estable,
                hipo,
                sensitivity,
                rate,
                basal,
                breakfast_start,
                breakfast_end,
                lunch_start,
                lunch_end,
                dinner_start,
                dinner_end,
                insulin,
                objective_carbs,
                physical_activity,
                info_adicional,
                tipo_usuario
            } = req.body;

            const UserData: Usuario = new Usuario(nombre, email, password, fecha_nacimiento, fecha_diagnostico, edad, genero, peso, estatura, tipo_diabetes, tipo_terapia, hyper, estable, hipo, sensitivity, rate, basal, breakfast_start, breakfast_end, lunch_start, lunch_end, dinner_start, dinner_end, insulin, objective_carbs, physical_activity, info_adicional, tipo_usuario);
            const resp = await this.userService.addUser(UserData);
            res.status(201).json({ "status": resp });
        } catch (err: any) {
            console.error(err);
            res.status(400).send(err.message);
        }
    }

    public async login(req: Request, res: Response): Promise<void> {
        morgan('dev')(req, res, () => { });
        try {
            const {
                email,
                password,
            } = req.body;
            const token = await Promise.race([
                this.userService.login(email, password),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
            ]);
            console.log("cambio");
            res.status(200).json({ "status": token })
        } catch (err: any) {
            res.status(400).send(err.message);

        }
    }

    public async getUser(req: Request, res: Response): Promise<void> {
        const token = req.params.token;
        const user = await this.userService.getToken(token);
        const id = await this.userService.getId(token);
        const insulinIds = await this.userService.getInsulinids(id);
        const ins = await this.userService.getInsulinUser(insulinIds);

        console.log(ins);
        if (user === null) {
            res.status(404).json({ message: 'Usuario no encontrado' });

        } else {
            const { password, ...usuario } = user;
            const resultado = { usuario, ins };

            res.status(200).json(resultado);
        }
    }


    public async updateUser(req: Request, res: Response): Promise<void> {
        const token = req.params.token;

        try {
            const {
                usuario,
                ins
            } = req.body;

            const insulinas: Insulin[] = ins.map((insulina: any) => {
                return new Insulin(
                    insulina.name,
                    insulina.type,
                    insulina.iprecision,
                    insulina.duration,
                    insulina.id
                );
            });
            

            const UserData: UsuarioUpd = new UsuarioUpd(
                usuario.nombre,
                usuario.email,
                usuario.fecha_nacimiento,
                usuario.fecha_diagnostico,
                usuario.edad,
                usuario.genero,
                usuario.peso,
                usuario.estatura,
                usuario.tipo_diabetes,
                usuario.tipo_terapia,
                usuario.hyper,
                usuario.estable,
                usuario.hipo,
                usuario.sensitivity,
                usuario.rate,
                usuario.basal,
                usuario.breakfast_start,
                usuario.breakfast_end,
                usuario.lunch_start,
                usuario.lunch_end,
                usuario.dinner_start,
                usuario.dinner_end,
                usuario.objective_carbs,
                usuario.physical_activity,
                usuario.info_adicional,
                usuario.tipo_usuario
            );
            const resp = await this.userService.updateUser(UserData, token, insulinas);
            res.status(201).json({ "status": resp, "message": "Usuario actualizado" });
        } catch (err: any) {
            console.error(err);
            res.status(400).send(err.message);
        }
    }

    public async testPredict(req: Request, res: Response): Promise<void> {
        try {
            const pre = await this.userService.tensorTest();
            res.status(200).json({ "predict": pre })
        } catch (err: any) {
            res.status(400).send(err.message);
        }
    }

    public async verifyEmail(req: Request, res: Response): Promise<void> {
        const email = req.params.email;
        try {
            const code = await this.userService.verify(email);
            res.status(200).json({ "codigo": code })
        } catch (err: any) {
            res.status(400).send(err.message);
        }
    }

    public async verifyPassword(req: Request, res: Response): Promise<void> {
        const email = req.params.email;
        try {
            const code = await this.userService.verifyPassword(email);
            res.status(200).json({ "codigo": code })
        } catch (err: any) {
            res.status(404).send("Email not Found");
        }
    }

    public async changePassword(req: Request, res: Response): Promise<void> {
        const token = req.params.token;
        const oldPass = req.params.old;
        const newPass = req.params.new;
        try {
            const code = await this.userService.changePassword(token, oldPass, newPass);
            res.status(200).json({ "status": code })
        } catch (err: any) {
            res.status(400).send(err.message);
        }
    }
    public async resetPassword(req: Request, res: Response): Promise<void> {
        const email = req.params.email;
        const newPass = req.params.new;

        try {
            const code = await this.userService.resetPassword(email, newPass);
            res.status(200).json({ "status": code })
        } catch (err: any) {
            res.status(400).send(err.message);
        }
    }
}