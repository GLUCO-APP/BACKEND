"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Report = void 0;
class Report {
    constructor(id_plato, token_usuario, glucosa, fecha, unidades_insulina) {
        this.id_plato = id_plato;
        this.token_usuario = token_usuario;
        this.glucosa = glucosa;
        this.fecha = fecha;
        this.unidades_insulina = unidades_insulina;
    }
}
exports.Report = Report;
