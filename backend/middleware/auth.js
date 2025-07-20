// for authentiaction

const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.isAuthenticatedUser = catchAsyncErrors( async(req,res,next) =>{

    const {token} = req.cookies;  // login er time e cookie te store korehilam token

    if(!token){         // authenticated user na hole tar token pabo na tkhn Errorhander diye take login korte bolbo

        return next(new ErrorHander("please login to access this resource", 401));
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);  // jdi token peye jai tkhn ta verify korbe,JWT_SECRET ache config e 

    req.user = await User.findById(decodedData.id);   // token theke user er id pabo, then ta req.user te save korbo

    next();



});

exports.authorizeRoles = (...roles) =>{     // productRoutes e authorizeRoles func e admin pass korechi, so roles ekhane admin 

    return (req,res,next) => {

        if(!roles.includes(req.user.role)){  //productController e (req.user) e, user er puro data save korechilam, jodi roles != req.user.role hoy, means user ti admin noy 

            return next( new ErrorHander

                (`Role: ${req.user.role} is not allowed to access this resource`, 
                403)                                                                  // admin na hole ErrorHander diye ei msg show korbo
            
            );
        }                                                                            // status code 403 means server jane ki korte chacche user but refuse kore dibe oke
        
        next();   // user er role Admin hoye gele kichu korbo na

    };
}; 