"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function preprocessPlateData(plate) {
    return {
        input: [[plate.Carbohydrates, plate.Proteins, plate.Fats, plate.sugarEstimate]],
        output: [[plate.Carbohydrates, plate.Proteins, plate.Fats]],
    };
}
