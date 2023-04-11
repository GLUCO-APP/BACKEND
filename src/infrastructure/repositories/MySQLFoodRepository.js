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
exports.MySqlFoodRepository = void 0;
const dbconfig_1 = __importDefault(require("../database/dbconfig"));
class MySqlFoodRepository {
    getall() {
        return __awaiter(this, void 0, void 0, function* () {
            const cnx = yield dbconfig_1.default.getConnection();
            try {
                yield cnx.beginTransaction();
                const [rows] = yield cnx.query('SELECT * FROM Food');
                return rows;
            }
            finally {
                cnx.release();
            }
        });
    }
    add(food) {
        return __awaiter(this, void 0, void 0, function* () {
            const cnx = yield dbconfig_1.default.getConnection();
            try {
                yield cnx.beginTransaction();
                const [rows] = yield cnx.query('SELECT * FROM Food WHERE name = ?;', [food.name]);
                if (rows.length > 0) {
                    // Si el alimento ya existe, se devuelve el objeto Food sin guardar en la base de datos
                    const existingFood = {
                        name: rows[0].name,
                        carbs: rows[0].carbs,
                        protein: rows[0].protein,
                        fats: rows[0].fats,
                        image: rows[0].image,
                        id: rows[0].id,
                        getData() {
                            return {
                                name: this.name,
                                carbs: this.carbs,
                                protein: this.protein,
                                fats: this.fats,
                                image: this.image,
                                id: this.id,
                            };
                        },
                    };
                    yield cnx.query('COMMIT');
                    return existingFood;
                }
                const [result] = yield cnx.query('INSERT INTO Food (name, carbs, protein, fats, image) VALUES (?, ?, ?, ?, ?);', [food.name, food.carbs, food.protein, food.fats, food.image]);
                const id = result.insertId;
                const newFood = {
                    name: food.name,
                    carbs: food.carbs,
                    protein: food.protein,
                    fats: food.fats,
                    image: food.image,
                    id: id,
                    getData() {
                        return {
                            name: this.name,
                            carbs: this.carbs,
                            protein: this.protein,
                            fats: this.fats,
                            image: this.image,
                            id: this.id,
                        };
                    },
                };
                yield cnx.query('COMMIT');
                return newFood;
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
exports.MySqlFoodRepository = MySqlFoodRepository;
