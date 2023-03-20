import { Router } from "express";
import { PlateController } from "../controllers/PlateController";
import { FoodController } from "../controllers/FoodController";
const router = Router();

const plateController = new PlateController();
const foodController = new FoodController();
router.post('/plate',plateController.addPlate.bind(plateController))
router.get('/allFoods',foodController.getAll.bind(foodController))



export default router;