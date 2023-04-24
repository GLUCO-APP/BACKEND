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
    updateFood(food) {
        return __awaiter(this, void 0, void 0, function* () {
            const cnx = yield dbconfig_1.default.getConnection();
            try {
                yield cnx.beginTransaction();
                const value = (food.cant_servicio / 100);
                food.carbs = value * food.carbs;
                food.protein = (value * food.protein);
                food.fats = (value * food.fats);
                const [result] = yield cnx.query('UPDATE Food SET carbs=?, protein=?, fats=?, image=?, cant_servicio=? WHERE name=?;', [food.carbs, food.protein, food.fats, food.image, food.cant_servicio, food.name]);
                const affectedRows = result.affectedRows;
                if (affectedRows === 0) {
                    // Si no se actualizó ningún alimento, lanzamos un error
                    throw new Error(`No se pudo encontrar el alimento ${food.name}`);
                }
                const updatedFood = {
                    name: food.name,
                    carbs: food.carbs,
                    protein: food.protein,
                    fats: food.fats,
                    image: food.image,
                    id: food.id,
                    cant_servicio: food.cant_servicio,
                    getData() {
                        return {
                            name: this.name,
                            carbs: this.carbs,
                            protein: this.protein,
                            fats: this.fats,
                            image: this.image,
                            id: this.id,
                            cant_servicio: this.cant_servicio,
                        };
                    },
                };
                yield cnx.query('COMMIT');
                return updatedFood;
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
    add(food) {
        return __awaiter(this, void 0, void 0, function* () {
            const cnx = yield dbconfig_1.default.getConnection();
            try {
                yield cnx.beginTransaction();
                const [rows] = yield cnx.query('SELECT * FROM Food WHERE name = ?;', [food.name]);
                if (rows.length > 0) {
                    // Si el alimento ya existe, se devuelve el objeto Food sin guardar en la base de datos
                    let existingFood = {
                        name: rows[0].name,
                        carbs: rows[0].carbs,
                        protein: rows[0].protein,
                        fats: rows[0].fats,
                        image: rows[0].image,
                        id: rows[0].id,
                        cant_servicio: rows[0].cant_servicio,
                        getData() {
                            return {
                                name: this.name,
                                carbs: this.carbs,
                                protein: this.protein,
                                fats: this.fats,
                                image: this.image,
                                id: this.id,
                                cant_servicio: this.cant_servicio,
                            };
                        },
                    };
                    yield cnx.query('COMMIT');
                    if (existingFood.cant_servicio != 100 && food.carbs == existingFood.carbs) {
                        console.log("entre");
                        try {
                            existingFood = yield this.updateFood(existingFood);
                            return existingFood;
                        }
                        catch (error) {
                            console.log(`No se encontró ningún alimento con el nombre ${food.name}`);
                        }
                    }
                    return existingFood;
                }
                const [result] = yield cnx.query('INSERT INTO Food (name, carbs, protein, fats, image , tag , cant_servicio) VALUES (?, ?, ?, ?, ? , "snack" , ?);', [food.name, food.carbs, food.protein, food.fats, food.image, food.cant_servicio]);
                const id = result.insertId;
                const newFood = {
                    name: food.name,
                    carbs: food.carbs,
                    protein: food.protein,
                    fats: food.fats,
                    image: food.image,
                    id: id,
                    cant_servicio: food.cant_servicio,
                    getData() {
                        return {
                            name: this.name,
                            carbs: this.carbs,
                            protein: this.protein,
                            fats: this.fats,
                            image: this.image,
                            id: this.id,
                            cant_servicio: this.cant_servicio,
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
