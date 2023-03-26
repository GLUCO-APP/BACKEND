import { Router } from "express";
import { PlateController } from "../controllers/PlateController";
import { FoodController } from "../controllers/FoodController";
import { UserController } from "../controllers/UserController";
const router = Router();

const plateController = new PlateController();
const foodController = new FoodController();
const usercontroller = new UserController();
router.post('/plate',plateController.addPlate.bind(plateController))
router.get('/allFoods',foodController.getAll.bind(foodController))
router.post('/user',usercontroller.addUser.bind(usercontroller))



export default router;