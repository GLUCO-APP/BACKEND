export class Usuario {
    constructor(
      public nombre: string,
      public email: string,
      public password: string,
      public fechaNacimiento: Date,
      public fechaDiagnostico: Date,
      public telefono: string,
      public edad: number,
      public genero: string,
      public peso: number,
      public estatura: number,
      public tipoDiabetes: string,
      public tipoTerapia: string,
      public unidades: string,
      public rango: string,
      public sensitivity: number,
      public rate: number,
      public precis: number,
      public breakfast: string,
      public lunch: string,
      public dinner: string,
      public glucometer: string,
      public objective: number,
      public physicalctivity: number,
      public infoAdicional: string
    ) {}
  }
  