export class ValidationResponseObject<T>{
    isError:boolean
    message:string
    error:any[]

    constructor( isError:boolean, message:string, error:any[]){
        this.isError=isError
        this.message=message
        this.error=error
    }
}