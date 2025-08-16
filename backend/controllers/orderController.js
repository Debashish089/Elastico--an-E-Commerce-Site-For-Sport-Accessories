

const Order = require("../models/orderModel");

const Product = require("../models/productModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");







// Create new Order

exports.newOrder = catchAsyncErrors(async (req, res, next)=>{

    const {shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice,} = req.body;

    const order = await Order.create({

        shippingInfo, 
        orderItems, 
        paymentInfo, 
        itemsPrice, 
        taxPrice, 
        shippingPrice, 
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,    // userid, login thaklei order krte parbe
    });

    res.status(201).json({

        success: true,
        order,             // order pathay dilam
    });

});


// get single order

exports.getSingleOrder = catchAsyncErrors(async (req, res, next)=>{

    const order = await Order.findById(req.params.id).populate(    // order khujbe order id diye, populate- order database theke "user" er id niye, user database theke oi user er "name", "eamil" niye ashbe
        
        "user",
        "name email"
    );

    if(!order){    // order na pele

        return next( new ErrorHander("Order not found for this id", 404));
    }

    res.status(200).json({   // order pele

        success: true,
        order,              // order pathay dilm
    }); 
});


// get logged in my orders

exports.myOrders = catchAsyncErrors(async (req, res, next)=>{

    const orders = await Order.find( {user: req.user._id} );   // Order database er 'user' field er id jdi logged in user er id(req.user._id) same hoy, to oi user er order khujbe

    res.status(200).json({   // order pele

        success: true,
        orders,              // order pathay dilm
    }); 
});


// get all orders-- Admin

exports.getAllOrders = catchAsyncErrors(async (req, res, next)=>{

    const orders = await Order.find();   // sob orders peye jabo

    let totalAmount = 0;

    orders.forEach(order=>{

        totalAmount += order.totalPrice;    // website er sob order er total amount
    
    });

    res.status(200).json({   // order pele

        success: true,
        totalAmount,
        orders,              // order pathay dilm
    }); 
});


// update order Status-- Admin

exports.updateOrder = catchAsyncErrors(async (req, res, next)=>{

    const order = await Order.findById(req.params.id);  

    if(!order){    // order na pele
    
        return next( new ErrorHander("Order not found for this id", 404));
    }

    if(order.orderStatus === "Delivered"){

        return next(new ErrorHander("You Have delivered this order", 404));
    }

    order.orderItems.forEach( async (order) =>{   // order delivered na hole for every order order database e giye product id niye quantity update krbe

        await updateStock(order.product, order.quantity);    // updateStoke function niche banano ache
    });

    order.orderStatus = req.body.status;

    if(req.body.status === "Delivered"){
        
        order.deliveredAt = Date.now();
    }

    await order.save( {validateBeforeSave: false});

    res.status(200).json({   // order pele

        success: true,
    }); 
});

async function updateStock(id, quantity){

    const product = await Product.findById(id);

    product.Stock = product.Stock - quantity;   // jekoyta order jabe product er, ogula stock theke minus

    await product.save({validateBeforeSave: false});
}


// Delete order-- Admin

exports.deleteOrder = catchAsyncErrors(async (req, res, next)=>{

    const order = await Order.findById(req.params.id);   

    if(!order){    // order na pele

        return next( new ErrorHander("Order not found for this id", 404));
    }

    await order.deleteOne();;


    res.status(200).json({   // order pele

        success: true,
    }); 
});
