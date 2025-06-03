import { IEmpleados } from "./iempleados.interfaces";

export interface IResponse {
    data:IEmpleados[];
    page:number;
    limit:number;
    total:number;
   
}