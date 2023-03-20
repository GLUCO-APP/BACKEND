"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plate = void 0;
class Plate {
    constructor(foods, sugarEstimate, latitude, longitude, address, id) {
        this.foods = foods;
        this.sugarEstimate = sugarEstimate;
        this.latitude = latitude;
        this.longitude = longitude;
        this.address = address;
        this.id = id;
    }
}
exports.Plate = Plate;
