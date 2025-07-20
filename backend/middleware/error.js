const ErrorHander = require("../utils/errorhander");   // errorhander class take import krlam

module.exports = (err, req, res, next)=>{

    err.statusCode = err.statusCode || 500;

    err.message = err.message || "Internal server error";

    // wrong mongodb id error-- product id vul likhe product detail search dile

    if(err.name == "CastError"){      // ei error ke bole cast error

        const message = `Resource not found. Invalid: ${err.path}`
        err = new ErrorHander(message, 400);
    }


    res.status(err.statusCode).json({

        success: false,
        message: err.message
        

    });


};