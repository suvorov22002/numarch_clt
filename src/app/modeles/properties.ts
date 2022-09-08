import { DataType } from "../enumeration/data-type.enum";
import { ResponseBase } from "./response-base";

export class Properties extends ResponseBase{

    id:number;
    name:string;
    title:string;
    description:string;
    dataType:DataType;
    defaultValue:boolean;
    multiValued:boolean;
    mandatory:boolean;
    enforced:boolean;
    protect:boolean;
    indexed:boolean;
}
