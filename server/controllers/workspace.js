
const User = require('../models/user.js');
const Problem = require('../models/problem.js');
const getSolverDashboard = async(req,res)=>{
    try{
         
         const user_id = req.user.id;
    if(!user_id){
        return res.status(403).json({success:false,message:"Require the User id"});
    }
    
    const pending_requests = await Problem.find({
    pendingRequests: user_id
});  
   
    const user = await User.findById(user_id);
    if(!user) return res.status(404).json({success:false,message:"User not Found"});
    const active_problems = await Problem.find({
        helperId :  user_id,
        status:"IN_PROGRESS"
    });
    return res.status(200).json({success:true,message:"Fetched Successfully",pending_requests,active_problems});
    }
    catch(err){
                return res.status(500).json({success:false,message:"Error while getting the sent requests"});

    }
}
const getAskerDashboard = async (req,res) =>{
    try{
         
         const user_id = req.user.id;
     if(!user_id){
        return res.status(403).json({success:false,message:"Require the User id"});
    }
    
    const open_problems = await Problem.find({
    askerId: user_id,
    status:"OPEN"
});  
   
    const user = await User.findById(user_id);
    if(!user) return res.status(404).json({success:false,message:"User not Found"});
    const active_problems = await Problem.find({
       askerId :  user_id,
        status:"IN_PROGRESS"
    });
    const resolved_problems = await  Problem.find({
       askerId :  user_id,
        status:"RESOLVED"
    });
       
        return res.status(200).json({success:true,message:"Fetched Successfully",open_problems,active_problems,resolved_problems});
    }
    catch(err){
                return res.status(500).json({success:false,message:"Error while fetching the askerDashboard"});

    }
}
const getSolverHistory = async(req,res) =>{
     try{
         const user_id = req.user.id;
     if(!user_id){
        return res.status(403).json({success:false,message:"Require the User id"});
    }
    const user = await User.findById(user_id);
    if(!user) return res.status(404).json({success:false,message:"User not Found"});
      const resolved_problems = await  Problem.find({
       helperId :  user_id,
        status:"RESOLVED"
    });
       const totalEarnings = resolved_problems.reduce(
    (total, problem) => total + problem.bounty,
    0
);
        return res.status(200).json({success:true,message:"Fetched Successfully",totalEarnings,resolved_problems});
}
catch(err){
     return res.status(500).json({success:false,message:"Error while fetching the History"});

}
}
module.exports = {getSolverHistory,getSolverDashboard,getAskerDashboard};