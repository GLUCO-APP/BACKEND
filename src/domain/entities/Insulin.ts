export class Insulin{
    constructor(
        public name: string,
        public type: string,
        public precision: number,
        public duration: number,
        public id?: number
    ){}
}