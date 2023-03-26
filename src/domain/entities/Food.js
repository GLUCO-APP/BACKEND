"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Food = void 0;
class Food {
    constructor(name, carbs, protein, fats, image, id) {
        this.name = name;
        this.carbs = carbs;
        this.protein = protein;
        this.fats = fats;
        this.image = image;
        this.id = id;
    }
    getData() {
        return {
            name: this.name,
            carbs: this.carbs,
            protein: this.protein,
            fats: this.fats,
            image: this.image,
            id: this.id,
        };
    }
}
exports.Food = Food;