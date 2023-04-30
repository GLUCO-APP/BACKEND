export class ReportPDF{
    constructor(
        public glucosa:number,
        public fecha: Date,
        public unidades_insulina: number,
        public type: String,
        public Carbohydrates: number
    ){}
}