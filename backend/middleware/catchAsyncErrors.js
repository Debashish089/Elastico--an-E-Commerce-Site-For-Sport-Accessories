module.exports = theFunc => (req,res,next)=>{

    Promise.resolve(theFunc(req,res,next)).catch(next);  //promise javascript er builtin func

};