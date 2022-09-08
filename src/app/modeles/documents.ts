import { ResponseBase } from "./response-base";
import { TypeDocuments } from "./type-documents";

export class Documents extends ResponseBase{
    id:number;
    reference:string;
    olname:string;
    traiter:boolean;
    name:string;
    dateEnvoi:Date;
    typeDocument:TypeDocuments;
    proprietes:string; //splitter all proprietes (name_value)
    url:string;
    uti:string;
    base64Str:string;
    categ:string;
}
