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

