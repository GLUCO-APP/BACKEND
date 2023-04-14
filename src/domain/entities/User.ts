import { Insulin } from "./Insulin";

export class Usuario {
    constructor(
      public nombre: string,
      public email: string,
      public password: string,
      public fechaNacimiento: Date,
      public fechaDiagnostico: Date,
      public edad: number,
      public genero: string,
      public peso: number,
      public estatura: number,
      public tipoDiabetes: string,
      public tipoTerapia: string,
      public hyper: number,
      public estable: number,
      public hipo: number,
      public sensitivity: number,
      public rate: number,
      public precis: number,
      public breakfastStart: Date,
      public breakfastEnd:Date,
      public lunchStart: Date,
      public lunchEnd: Date,
      public dinnerStart: Date,
      public dinnerEnd: Date,
      public insulin: Insulin[],
      public objectiveCarbs: number,
      public physicalctivity: number,
      public infoAdicional: string,
    ) {}
  }
  