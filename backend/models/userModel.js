
const mongoose = require("mongoose");
const validator = require("validator");

const bcrypt = require("bcryptjs");  // password hashing er jnno

const jwt = require("jsonwebtoken");  // jwt token import korlam

const crypto = require("crypto");   // for password reset

const userSchema = new mongoose.Schema({

    name:{
        type: String,

        required: [true, "Please Enter your Name"],
        maxLength: [30, "Name cannot exceed 30 characters"],
        minLength:[4, "Name must have more than 4 characters"],

    },

    email:{


        type: String,
        required: [true, "Please Enter your email"],
        
        unique: true,                                  // mail unique howa lagbe

        validate: [validator.isEmail, "please Enter a valid Email"],  // valid email na hole bolbe "please enter valid email"
    },

    password:{


        type: String,
        required: [true, "Please Enter your password"],
        minLength:[4, "password should have min 4 characters"],
        select: false,    // find diye jkhn query call hbe, tkhn password jabe na, kw pabe na password
    },

    avatar:{

      public_id: {         // image host krr jnno use korbo cloudnight jekhane public id pabo
        type: String,
        required: true,
      },

      url: {
        type: String,
        required: true,
      }

    },

    role:{


        type: String,
        default: "user",
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,

});   

userSchema.pre("save", async function(next){   // userSchema save hobar agei password hash korbe

   if(!this.isModified("password")){     // password modify/ profile update jdi na hoy taile ar hash krbe na, pass change na hole take abar hash krr drkr nai
        next();
   }

    this.password = await bcrypt.hash(this.password,10);

})

//jwt token-- eta diye token generate kore cookie te store korbo jate user eke identify kora jay

userSchema.methods.getJWTToken = function (){       // jwt token er method banabo

  return jwt.sign({id:this._id}, process.env.JWT_SECRET,{     // token banacchi id diye, ekhane this = userSchema

    expiresIn: process.env.JWT_EXPIRE,  // process.env.JWT_SECRET kw peye gele se amdr web er access peye jabe, sejjno JWT_EXPIRE, ekta time er por logout hoye jbe auto
  
  });    


};

// compare password

userSchema.methods.comparePassword = async function (enteredPassword) {   // compare password method banabo

  return await bcrypt.compare(enteredPassword, this.password);  //  bcrypt.compare func diye compare krbo entered pass o user er database er pass er mddhe, this.password means oi particular user er password, eta true/false returnn kre
  
};

// generating password reset token-- for password reset

userSchema.methods.getResetPasswordToken = function () {

  //generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");  // kichhu random bytes generate korbe hex valu te

  // Hashing and adding to user Schema

  this.resetPasswordToken = crypto    // user er database e ei token add hobe
  
  .createHash("sha256")   // Hash create korbo, sha256 ekta algorithm
  .update(resetToken)     // reset token jeta upore chilo oita update korbe, new value banabe 
  .digest("hex");          // hex e rakhbe, buffer value hobe na

  this.resetPasswordExpire = Date.now() + 15* 60* 1000;  // 15 min active thakbe code, miliseconds e convert kora hoise

  return resetToken;   // reset token mail e pahabo, mail theke click kore password reset korte parbe


};


module.exports = mongoose.model("user", userSchema);
    
