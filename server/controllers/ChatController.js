const Problem = require("../models/problem");
const Messages = require("../models/message");
const User = require("../models/user");


const getChatHistory = async(req,res) =>{
    try{
        console.log("Route params:", req.params);
console.log("Authenticated user:", req.user);
    const prob_id = req.params.id;
    const user_id = req.user.id;
    const problem = await Problem.findById(prob_id);
    if(!problem){
        return res.status(404).json({success:false,message:"Problem doesn't exist"});
    }
  if (
    problem.askerId.toString() !== user_id.toString() &&
    (!problem.helperId ||
        problem.helperId.toString() !== user_id.toString())
) {
    return res.status(403).json({
        success: false,
        message: "Unauthorized request"
    });
}
   const messages = await Messages.find({
       problemId : prob_id
   }).sort({createdAt:1});
   return res.status(200).json({success:true,message:"History sent successfully",messages});

}
catch(err){
    console.error("Chat history error:", err);
    return res.status(500).json({success:false,message:"Error occured while sending the history"});
}}




const MessagesAsRead = async (req,res)=>{
     try{
    const prob_id = req.params.id;
    const user_id = req.user.id;
    const problem = await Problem.findById(prob_id);
    if(!problem){
        return res.status(404).json({success:false,message:"Problem doesn't exist"});
    }
   
  if (
    problem.askerId.toString() !== user_id.toString() &&
    (!problem.helperId ||
        problem.helperId.toString() !== user_id.toString())
) {
    return res.status(403).json({
        success: false,
        message: "Unauthorized request"
    });
}
           await Messages.updateMany(
    {
        problemId: prob_id,
        senderId: { $ne: user_id },
        isRead: false
    },
    {
        $set: { isRead: true }
    }
);
          return res.status(200).json({success:true,message:"Messages Updated Successfully"});

}
catch(err){
            return res.status(500).json({success:false,message:"Error occured while sending the message"});

}
};
module.exports = {getChatHistory,MessagesAsRead};