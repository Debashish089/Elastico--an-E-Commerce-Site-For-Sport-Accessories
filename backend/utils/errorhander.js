class ErrorHander extends Error{       // onek if else condition ache ekhane, sejjno error hander. extends means ei class ta Error inherit korbe

    constructor(message, statusCode){

        super(message);               // super ei class er constructor
        this.statusCode = statusCode
        
        Error.captureStackTrace(this,this.constructor);   

    }

}

module.exports = ErrorHander

