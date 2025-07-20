const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");


// register user

exports.registerUser = catchAsyncErrors( async(req,res,next) =>{

    const {name, email, password, role} = req.body;   // name, email, password, role diye user create korte parbo, baki values default dhore nibe

    const user = await User.create({

        name,email,password, role,
        avatar:{

            public_id: "This is a sample id",
            url: "profilepicUrl",


        }
    });


    sendToken(user, 201, res);  // token pathay dilam sendToken func diye, jeta jwtToken e banano


});


//login user

exports.loginUser = catchAsyncErrors(async (req,res,next) => {




    const{email,password} = req.body;   // req.body theke mail, pass nilam

    // checking if user has given pass and mail both

    if(!email || !password){         // mail, pass duitai na dile errorHander e pathay dibo

        return next(new ErrorHander("please Enter Email and Password", 400))
    }


    const user = await User.findOne({email}).select("+password");   // ekhn database e mail, pass niye check korbo user ache kina, userSchema te password=false chilo, tai ekhane +password 

    if(!user){


        return next(new ErrorHander("Invalid Email or Password"), 401);  // databse e user khuje na pele, errorHander diye pathay dibo message: invalid usernmae or password
   
    }



    const isPasswordMatched = await user.comparePassword(password);  // user er pass er sthe database er compare. comparePassword() func userModels e banano hoyeche..Without await, isPasswordMatched is a Promise object, which is always truthy, so the if (!isPasswordMatched) check fails to catch bad passwords.

    if(! isPasswordMatched){             // pass matched na hole ErrorHander e pathay dibo

        return next(new ErrorHander("Invalid Email or password"), 401);   // status code 401 means unauthorized
    }

    

    sendToken(user, 200, res);  // // jodi password matched hoye jay tkhn token send korbo, ei func jwtToken.js e ache. (user, statusCode, options) pathacchi

});


// logout

exports.logout = catchAsyncErrors(async(req, res, next) => {

    res.cookie("token", null, {    // res.cookie("keyword", tar value(null), options= expires and httpOnly

        expires: new Date(Date.now()),  // ekhn  e expire kore dibo
        httpOnly: true,

    });

    res.status(200).json({

        success:true,
        message: "Logged Out",

    });

});


// Forgot Password

exports.forgotPassword = catchAsyncErrors(async (req, res, next) =>{

   const user = await User.findOne({email: req.body.email})  // EMAIL er through user khujbe

   if(!user){

        return next(new ErrorHander("User not found", 404));

   }

   // get resetpassword Token

   const resetToken = user.getResetPasswordToken();   // getResetPasswordToken() ache userModel e, ei func resetToken return korche, oita store korlam
   
   await user.save({validateBeforeSave: false});   //  user take save korlam

   const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`   //req.protocol = http/https. 

   const message = `Your Password Reset Token is:- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email
   then please ignore it`;  // ei msg pathabo, \n\n means newline, 2 line niche jabe

   try {

        await sendEmail({

            email: user.email,   // user er mail e email jabe
            subject: `Elastico Password recovery`,   // email er subject
            message,

        });

        res.status(200).json({

            success: true,
            message: `Email sent to ${user.email} successfully`,
        
        });



   } catch(error){  // jodi error chole ashe

     user.resetPasswordToken = undefined;   // database e eke save korechilam agei, error asche tai eke undefined kore dilam
     user.resetPasswordExpire = undefined;

     await user.save({validateBeforeSave: false});  // token undefined korar por o save kora lagbe

     return next(new ErrorHander(error.message, 500));  // then errrohander diye error msg show korbo

   }


});


// Reset password

exports.resetPassword = catchAsyncErrors(async (req, res, next) => {

    // creating token hash
    
    const resetPasswordToken = crypto    // user er database e ei token add hobe
      
    .createHash("sha256")                // Hash create korbo, sha256 ekta algorithm
    .update(req.params.token)      
    .digest("hex");                      // hex e rakhbe, buffer value hobe na
     
    
    const user = await User.findOne({

        resetPasswordToken,        // upor theke token pelam , jeta diye database e search korbo user 

        resetPasswordExpire: {$gt: Date.now()},     // expire time greater than(gt) now time, expire time baki thkte hbe

    });

    
   if(!user){            // user na pele

        return next(new ErrorHander("Reset Password Token is not valid or has been expired", 400));

   }

   // user pelam, token o thik ache, tkhn check korbe new password and confirm password same kina

   if(req.body.password !== req.body.confirmPassword){

        return next(new ErrorHander("Password Doesn't Match", 400));  

   }

   // new and confirm password match hole

   user.password = req.body.password;   // password change kore dilam

   user.resetPasswordToken = undefined;   // password changed, so eder ar lagbe na, unudefined kore dibo
   user.resetPasswordExpire = undefined;

   await user.save();  // user save korlam

   sendToken(user, 200, res);  // user ke new password e login korte dilam

}); 