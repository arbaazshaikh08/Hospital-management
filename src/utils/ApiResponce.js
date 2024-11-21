class ApiResponce {
    constructor(statusCode, data, message = "Operation successful"){
        this.statusCode = statusCode
        this.data =data
        this.message =  message
        this.success = statusCode < 400 
        this.timestamp = new Date().toISOString();
    }
}
export {ApiResponce}