import { Recepti } from "./Recepti";

export interface PovratniObjektRecepata{
    recepies:Recepti[],
    currentPage:number,
    numberOfPages:number
}