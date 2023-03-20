import { Food } from "./Food";

export class Plate{
        constructor(
            public foods: Food[],
            public sugarEstimate: number,
            public latitude: number,
            public longitude: number,
            public address: string,
            public id?: number
        ) {}
}