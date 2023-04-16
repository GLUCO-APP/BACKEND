export class Report{
    constructor(
        public id_plato:number,
        public token_usuario:string,
        public glucosa:number,
        public fecha: Date,
        public unidades_insulina: number
    ){}
}