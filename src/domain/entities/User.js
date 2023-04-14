"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usuario = void 0;
class Usuario {
    constructor(nombre, email, password, fecha_nacimiento, fecha_diagnostico, edad, genero, peso, estatura, tipo_diabetes, tipo_terapia, hyper, estable, hipo, sensitivity, rate, precis, breakfast_start, breakfast_end, lunch_start, lunch_end, dinner_start, dinner_end, insulin, objective_carbs, physical_activity, info_adicional) {
        this.nombre = nombre;
        this.email = email;
        this.password = password;
        this.fecha_nacimiento = fecha_nacimiento;
        this.fecha_diagnostico = fecha_diagnostico;
        this.edad = edad;
        this.genero = genero;
        this.peso = peso;
        this.estatura = estatura;
        this.tipo_diabetes = tipo_diabetes;
        this.tipo_terapia = tipo_terapia;
        this.hyper = hyper;
        this.estable = estable;
        this.hipo = hipo;
        this.sensitivity = sensitivity;
        this.rate = rate;
        this.precis = precis;
        this.breakfast_start = breakfast_start;
        this.breakfast_end = breakfast_end;
        this.lunch_start = lunch_start;
        this.lunch_end = lunch_end;
        this.dinner_start = dinner_start;
        this.dinner_end = dinner_end;
        this.insulin = insulin;
        this.objective_carbs = objective_carbs;
        this.physical_activity = physical_activity;
        this.info_adicional = info_adicional;
    }
}
exports.Usuario = Usuario;
