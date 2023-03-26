"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySQLPlateRepository = void 0;
const dbconfig_1 = __importDefault(require("../database/dbconfig"));
class MySQLPlateRepository {
    add(plate) {
        return __awaiter(this, void 0, void 0, function* () {
            const cnx = yield dbconfig_1.default.getConnection();
            try {
                yield cnx.beginTransaction();
                // Insertar el nuevo plato en la tabla Plate
                const [result] = yield cnx.query('INSERT INTO Plate (sugarEstimate, latitude, longitude, address) VALUES (?,?,?,?);', [plate.sugarEstimate, plate.latitude, plate.longitude, plate.address]);
                const id = result.insertId;
                const newPlate = {
                    id: id,
                    sugarEstimate: plate.sugarEstimate,
                    latitude: plate.latitude,
                    longitude: plate.longitude,
                    address: plate.address,
                    foods: plate.foods,
                };
                // Insertar los registros correspondientes en la tabla Plate_x_Food
                for (const food of plate.foods) {
                    yield cnx.execute('INSERT INTO Plate_x_Food (plate_id, food_id) VALUES (?, ?);', [id, food.id]);
                }
                yield cnx.query('COMMIT');
                return newPlate;
            }
            catch (err) {
                yield cnx.query('ROLLBACK');
                throw err;
            }
            finally {
                cnx.release();
            }
        });
    }
}
exports.MySQLPlateRepository = MySQLPlateRepository;