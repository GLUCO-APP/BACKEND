import { Food } from "./Food";

export class Plate{
        constructor(
            public foods: Food[],
            public sugarEstimate: number,
            public latitude: number,
            public longitude: number,
            public address: string,
            public Carbohydrates: number,
            public Proteins: number,
            public Fats: number,
            public Description: string,
            public Title: string,
            public date: Date,
            public type: string,
            public id?: number
        ) {}
}