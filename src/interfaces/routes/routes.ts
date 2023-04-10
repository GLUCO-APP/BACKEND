import { Router } from "express";
import { PlateController } from "../controllers/PlateController";
import { FoodController } from "../controllers/FoodController";
import { UserController } from "../controllers/UserController";
import {EmergencyController} from "../controllers/EmergencyController";
import { UserService } from "../../application/services/UserService";
const router = Router();

const plateController = new PlateController();
const foodController = new FoodController();
const usercontroller = new UserController();
const emergencycontroller = new EmergencyController();
router.post('/plate',plateController.addPlate.bind(plateController))
router.get('/allFoods',foodController.getAll.bind(foodController))
router.post('/user',usercontroller.addUser.bind(usercontroller))
router.post('/login',usercontroller.login.bind(usercontroller))
router.get('/user/:id', usercontroller.getUser.bind(usercontroller))
router.get('/test',usercontroller.testPredict.bind(usercontroller))
router.put('/update/:id',usercontroller.updateUser.bind(usercontroller))
router.get('/emergency/:code',emergencycontroller.getBarCode.bind(emergencycontroller))


export default router;