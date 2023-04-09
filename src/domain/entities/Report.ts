export class Report{
    constructor(
        public id_plato:number,
        public id_usuario:number,
        public glucosa:number,
        public fecha: Date,
        public unidades_insulina: number
    ){}
}