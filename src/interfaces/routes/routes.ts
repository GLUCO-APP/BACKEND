import { Router } from "express";
import { PlateController } from "../controllers/PlateController";
import { FoodController } from "../controllers/FoodController";
import { UserController } from "../controllers/UserController";
import { UserService } from "../../application/services/UserService";
import { EmergencyContoller } from "../controllers/EmergencyController";
import { ReportController } from "../controllers/ReportController";

const router = Router();

const plateController = new PlateController();
const foodController = new FoodController();
const usercontroller = new UserController();
const emergencytcontroller = new EmergencyContoller();
const reportController = new ReportController();
router.post('/plate',plateController.addPlate.bind(plateController))
router.get('/allFoods',foodController.getAll.bind(foodController))
router.post('/codebar/:code',foodController.addFoodCode.bind(foodController))
router.post('/user',usercontroller.addUser.bind(usercontroller))
router.post('/login',usercontroller.login.bind(usercontroller))
router.get('/user/:token', usercontroller.getUser.bind(usercontroller))
router.get('/test',usercontroller.testPredict.bind(usercontroller))
router.put('/update/:token',usercontroller.updateUser.bind(usercontroller))
router.post('/emergency/:token/:ind', emergencytcontroller.getFood.bind(emergencytcontroller))
router.post('/report',reportController.addReport.bind(reportController))
router.get('/report/:token',reportController.dailyReports.bind(reportController))
router.get('/report/last/:token',reportController.lastReport.bind(reportController))
router.get('/report/lastI/:token',reportController.lastReportI.bind(reportController))
router.get('/recomendationTest/:token',plateController.trainTest.bind(plateController))
router.get('/report/pdf/:token',reportController.generatePdf.bind(reportController))

export default router;