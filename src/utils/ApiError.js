class ApiError extends Error {
    constructor(
        statusCode,
        message=  "An unexpected error occurred in the hospital management system.",
        errors = [],
        stack = ""
        
    ){super(message)
        this.statusCode = statusCode
        this.Date = null
        this.message = message
        this.success = false;
        this.errors = errors

        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {ApiError}