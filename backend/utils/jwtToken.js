// creating token and saving in cookie


const sendToken = (user, statusCode, res) => {

    const token = user.getJWTToken();

    //options for cookie

    const options = {     

        expires:new Date(    // cookie koto smy por expire hbe

            Date.now() + Number(process.env.COOKIE_EXPIRE) *24* 60* 60* 1000  // date.now()--cookie generate er time er por  (cookie_expire-- je time dibo etay, eta config e difine kora) * 24 ghonta(etake ms e convert kora hoyeche)..process.env.COOKIE_EXPIRE by default string tai eke Number kora hoyeche
        ),

        httpOnly:true,
    };

    res.status(statusCode).cookie('token', token, options).json({   // cookie('keyword', token pathalam, options variable pathalam)

        success:true,
        user,
        token,  // user, token pathay dilam
    });

};

module.exports = sendToken;   //export korlam

