const Product = require("../models/productModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");





// Create product-- Admin

exports.createProduct = catchAsyncErrors(async (req, res, next)=>{   //catchAsyncErrors func e pass korchi jeta ache middleware er catchAsyncErrors.js e
    
    req.body.user = req.user.id         // auth.js e login er smy user er sob store kore niyechilam ,sekhan theke user id pabo

    const product = await Product.create(req.body);

    res.status(201).json({
        success:true,
        product,
    });
});


// get all products

exports.getAllProducts = catchAsyncErrors(async (req, res)=>{

    const resultPerPage = 5;   //pagination...ek page e koyta product dekhabo

    const productCount = await Product.countDocuments();

    const apiFeature = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter()                    // search ar filter func call kore product find korche
        .pagination(resultPerPage);  
    
        const products = await apiFeature.query;

    res.status(200).json({
        success:true,
        products, 
    });
});


// Get product details

exports.getProductDetails = catchAsyncErrors(async(req,res,next)=>{

    const product = await Product.findByIdAndDelete(req.params.id);  

       if(!product){          // product na pele  errorhander e message and status code(404) pathay dibo, pore errorhander error show korbe

            return next(new ErrorHander("Product not found", 404));

      }

   

   res.status(200).json({

    success:true,
    product,
    productCount,

   });

});



// update products-- Admin

exports.updateProduct = catchAsyncErrors(async(req, res, next)=>{

   let product = await Product.findById(req.params.id);

    if(!product){          // product na pele  errorhander e message and status code(404) pathay dibo, pore errorhander error show korbe

            return next(new ErrorHander("Product not found", 404));

      }
   
   product = await Product.findByIdAndUpdate(req.params.id, req.body, {  // product pele update korbo
    
    new:true, 
    runValidators:true,
    useFindAndModify:false

});
   
res.status(200).json({
    success:true,
    product,               // update er por ei updated product pathay dilam

});

});

// Delete products-- Admin

exports.deleteProduct = catchAsyncErrors(async(req, res, next)=>{

   const product = await Product.findByIdAndDelete(req.params.id);   // product er id pelam

      if(!product){          // product na pele  errorhander e message and status code(404) pathay dibo, pore errorhander error show korbe

            return next(new ErrorHander("Product not found", 404));

      }

     // product pele delete kore dibo and message pathabo dlt er

   res.status(200).json({

    success:true,
    message: "Product deleted successfully",

   });



});


// review product or update product

exports.createProductReview = catchAsyncErrors(async(req, res, next)=>{

    
    const {rating, comment, productId} = req.body;   //rating, comment, productId req.body theke ashbe
    
    const review = {              // review object banalam, jekhane review rltd sob store korbo

        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),   // number e nibo rating
        comment,
    };

    const product = await Product.findById(productId);   // product khujlam

    const isReviewed = product.reviews.find(rev => rev.user.toString() == req.user._id.toString());  // product model e 'reviews' array ache, oikhaner user id jdi tmr login kora id r sthe match kre, means tmi product tar review ageo korecho 

    if(isReviewed){    // agei review kora thakle ekhn edit korbo review

        product.reviews.forEach(rev=> {     // product model er 'reviews' e giye sob reviews er jnno check krbe, then notun review bosay dibe

            if(rev.user.toString() == req.user._id.toString()) {

                rev.rating = rating;
                rev.comment = comment;
            }    
        });

    }

    else {        // product tar age theke review na thakle

        product.reviews.push(review);  // product model e review array ache, oikhne amra review push kore dibo
    
        product.numOfReviews = product.reviews.length;
    }
    
    let avg = 0;

    product.ratings = product.reviews.forEach(rev=>{

        avg += rev.rating;   // oi product er sob reviews er sob rating jug

    })  
    
    product.ratings = avg / product.reviews.length;  // total reviews diye divide korle avg pabo

    await product.save({ validateBeforeSave: false});

    res.status(200).json({
        success: true,
    });

});    

// Get all reviews of a single product

exports.getProductReviews = catchAsyncErrors(async(req, res, next)=>{

    const product = await Product.findById(req.query.id);   // postman er query(key) te id diye oi product er id dibo, then prodct find krbe

    if(!product){          // product na pele  

        return next(new ErrorHander("Product not found", 404));

    }

    res.status(200).json({

        success: true,
        reviews: product.reviews,  // prodct tar sob reviews pathay dilam

    });
    
});    


// Delete Review

exports.deleteReview = catchAsyncErrors(async(req, res, next)=>{


    const product = await Product.findById(req.query.productId);   // postman er query(key) te productId diye oi product er id dibo

    if(!product){          // product na pele  

        return next(new ErrorHander("Product not found", 404));

    }

    const reviews = product.reviews.filter( rev => rev._id.toString() !== req.query.id.toString());   // postman er query(key) te id diye oi review jeta dlt chai, tar id dibo. rev._id.toString() !== req.query.id.toString() means product er sob review and dlt chawa review equal na hole,  jesob review dlt krbo na ogula 'reviews' variable e niye nilam

    let avg = 0;  // review dlt krle rating eo changes ashbe

    reviews.forEach(rev=>{

        avg += rev.rating;  

    })  

    const ratings = avg / reviews.length; 

    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate( 
        
        req.query.productId, {     // product find kre update krbe

        reviews,      //database e reviws, rating, numof rev update hbe product er 
        ratings,
        numOfReviews,
        },
        
        {               // options
        new: true,
        runValidators: true,
        useFindAndModify: false,
        }

    );
    
    res.status(200).json({

        success: true,

    });




});    

