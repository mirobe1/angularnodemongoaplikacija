import { Ingredient } from "./Ingredient";

export interface Recipe{
    _id:string,
    name: string,
    description: string,
    ingredienti:Ingredient[],
    sastojci: string
}