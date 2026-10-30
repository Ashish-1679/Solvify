const jwt = require("jsonwebtoken");
const authMiddleware =  (req,res,next) =>{
const token = req.headers.authorization?.split(' ')[1];
try{
if(!token){
    return res.status(401).json({
        success:false,
        message:'Authentication required'
    });
}
const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = {id : decoded.userId};
        next();
}
catch(err){
    return res.status(401).json({
        success:false,
        message:"Invalid or expirerd token"
    });
}
};
module.exports = authMiddleware;