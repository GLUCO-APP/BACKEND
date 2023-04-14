"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usuario = void 0;
class Usuario {
    constructor(nombre, email, password, fechaNacimiento, fechaDiagnostico, edad, genero, peso, estatura, tipoDiabetes, tipoTerapia, hyper, estable, hipo, sensitivity, rate, precis, breakfastStart, breakfastEnd, lunchStart, lunchEnd, dinnerStart, dinnerEnd, insulin, objectiveCarbs, physicalctivity, infoAdicional) {
        this.nombre = nombre;
        this.email = email;
        this.password = password;
        this.fechaNacimiento = fechaNacimiento;
        this.fechaDiagnostico = fechaDiagnostico;
        this.edad = edad;
        this.genero = genero;
        this.peso = peso;
        this.estatura = estatura;
        this.tipoDiabetes = tipoDiabetes;
        this.tipoTerapia = tipoTerapia;
        this.hyper = hyper;
        this.estable = estable;
        this.hipo = hipo;
        this.sensitivity = sensitivity;
        this.rate = rate;
        this.precis = precis;
        this.breakfastStart = breakfastStart;
        this.breakfastEnd = breakfastEnd;
        this.lunchStart = lunchStart;
        this.lunchEnd = lunchEnd;
        this.dinnerStart = dinnerStart;
        this.dinnerEnd = dinnerEnd;
        this.insulin = insulin;
        this.objectiveCarbs = objectiveCarbs;
        this.physicalctivity = physicalctivity;
        this.infoAdicional = infoAdicional;
    }
}
exports.Usuario = Usuario;
