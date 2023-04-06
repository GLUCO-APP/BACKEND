"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plate = void 0;
class Plate {
    constructor(foods, sugarEstimate, latitude, longitude, address, Carbohydrates, Proteins, Fats, Description, Title, date, type, id) {
        this.foods = foods;
        this.sugarEstimate = sugarEstimate;
        this.latitude = latitude;
        this.longitude = longitude;
        this.address = address;
        this.Carbohydrates = Carbohydrates;
        this.Proteins = Proteins;
        this.Fats = Fats;
        this.Description = Description;
        this.Title = Title;
        this.date = date;
        this.type = type;
        this.id = id;
    }
}
exports.Plate = Plate;
