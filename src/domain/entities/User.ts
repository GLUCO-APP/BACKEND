import { Insulin } from "./Insulin";

export class Usuario {
    constructor(
      public nombre: string,
      public email: string,
      public password: string,
      public fecha_nacimiento: Date,
      public fecha_diagnostico: Date,
      public edad: number,
      public genero: string,
      public peso: number,
      public estatura: number,
      public tipo_diabetes: string,
      public tipo_terapia: string,
      public hyper: number,
      public estable: number,
      public hipo: number,
      public sensitivity: number,
      public rate: number,
      public basal: Date,
      public breakfast_start: Date,
      public breakfast_end:Date,
      public lunch_start: Date,
      public lunch_end: Date,
      public dinner_start: Date,
      public dinner_end: Date,
      public insulin: Insulin[],
      public objective_carbs: number,
      public physical_activity: number,
      public info_adicional: string,
      public tipo_usuario:string
    ) {}
    

    
  }
  