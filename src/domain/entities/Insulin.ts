export class Insulin{
    constructor(
        public name: string,
        public type: string,
        public iprecision: number,
        public duration: number,
        public id?: number
    ){}
}