"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportPDF = void 0;
class ReportPDF {
    constructor(glucosa, fecha, unidades_insulina, type, Carbohydrates) {
        this.glucosa = glucosa;
        this.fecha = fecha;
        this.unidades_insulina = unidades_insulina;
        this.type = type;
        this.Carbohydrates = Carbohydrates;
    }
}
exports.ReportPDF = ReportPDF;
