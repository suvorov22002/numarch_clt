import { ResponseBase } from "./response-base";

export class TypeDocuments extends ResponseBase{
    id:number;
    name:string;
    description;
    title:string;
    isAspect:boolean;
    isContainer:boolean;
    parent:string;
    propertie:string; //liste splitter des noms de type de propriete
    defaultAspects:string;
}
