import { Plate } from "../../domain/entities/Plate";


function preprocessPlateData(plate: Plate): { input: number[][]; output: number[][] } {
    return {
      input: [[plate.Carbohydrates, plate.Proteins, plate.Fats, plate.sugarEstimate]],
      output: [[plate.Carbohydrates, plate.Proteins, plate.Fats]],
    };
  }