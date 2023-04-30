import { Request, Response } from "express";

import { EmergencyService } from "../../application/services/EmergencyService"



export class EmergencyContoller {

    private emergencyService: EmergencyService;
    constructor() {
        this.emergencyService = new EmergencyService();
    }
    public async getFood(req: Request, res: Response): Promise<void> {
        const token = req.params.token;
        const ind = parseInt(req.params.ind);
        try {
            const response = await this.emergencyService.getAll(token, ind);
            res.status(response.status).json(response.body);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Something went wrong' });
        }
    }

}