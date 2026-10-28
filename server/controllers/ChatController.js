const Problem = require("../models/problem");
const Messages = require("../models/message");
const User = require("../models/user");


const getChatHistory = async(req,res) =>{
    try{
    const prob_id = req.params.id;
    const user_id = req.user.id;
    const problem = await Problem.findById(prob_id);
    if(!problem){
        return res.status(500).json({success:false,message:"Problem doesn't exist"});
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
    return res.status(500).json({success:false,message:"Error occured while sending the history"});
}}


const sendMessage = async(req,res)=>{
try{
          const prob_id = req.params.id;
    const user_id = req.user.id;
    const problem = await Problem.findById(prob_id);
    if(!problem){
        return res.status(404).json({success:false,message:"Problem doesn't exist"});
    }
    if (problem.status !== "IN_PROGRESS") {
    return res.status(400).json({
        success: false,
        message: "Cannot send messages for this problem"
    });
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
const Content = req.body.message;
if (!Content || !Content.trim()) {
    return res.status(400).json({
        success: false,
        message: "Message cannot be empty"
    });
}
const messageContent = Content.trim();
       const Newmessage = new Messages({
          problemId: prob_id,
    senderId: user_id,
    content: Content,
    isRead: false
       });
       await Newmessage.save();
       return res.status(201).json({success:true,message:"Message sent succesfully",  data: Newmessage});
}
catch(err){
       return res.status(500).json({success:false,message:"Error occured while sending the message"});

}
}

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