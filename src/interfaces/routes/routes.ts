import { Router } from "express";
import { PlateController } from "../controllers/PlateController";

const router = Router();

const plateController = new PlateController();
router.post('/plate',plateController.addPlate.bind(plateController))



export default router;