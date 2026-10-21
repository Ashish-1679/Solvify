
const User = require('../models/user.js');
const Problem = require('../models/problem.js');
const requestToSolve = async(req,res) =>{
    try{
    const prob_id = req.params.id;
const problem  = await Problem.findById(prob_id);

if(!problem){
   return res.status(404).json({success:false,message:"Problem Not Found"});
}
if(problem.askerId.toString()===req.user.id){
    return res.status(403).json({success: false,message:"cannot request on a problem uploaded by User"})
}
if(problem.status!=="OPEN"){
    return res.status(400).json({success:false,message:"Problem is not OPEN to request"});
}
const currentUserId = req.user.id;
await Problem.findByIdAndUpdate(
  prob_id,
  {
    $addToSet: { pendingRequests: currentUserId }
  },
  { new: true }
);
return res.status(200).json({success:true,message:"Request sent successfully"});}
catch(err){
    return res.status(500).json({success:false,message:"Error occured while requesting"});
}

};
const getSentRequests = async (req,res)=>{
   try{
         const currentUserId = req.user.id;
      const Requests = await Problem.find({
    pendingRequests: currentUserId
});
               return  res.status(200).json({success:true,Requests});
   }
   catch(err){
              return res.status(500).json({success:false,message:"Error Occurred on showing sent req"});
   }
};
const getReceivedRequests = async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const problems = await Problem.find({
            askerId: currentUserId,
            status: "OPEN",
            pendingRequests: { $ne: [] }
        });
        const Requests = [];
        for (const problem of problems) {
            const users = await User.find({
                _id: { $in: problem.pendingRequests }
            }).select("-password");
            Requests.push({
                problem: problem,
                requestingUsers: users
            });
        }
        return res.status(200).json({
            success: true,
            Requests
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error occurred while showing received requests"
        });
    }
};
const acceptRequest = async (req,res) => {
   try{ const problemId = req.params.id;
    const solverId = req.body.solverId;
    if (!solverId) {
    return res.status(400).json({
        success: false,
        message: "Solver ID is required"
    });
}
    const problem = await Problem.findById(problemId);
    if(!problem){
        return res.status(404).json({success:false,message:"Problem Not Found"});
    }
   if (problem.askerId.toString() !== req.user.id) {
    return res.status(403).json({
        success: false,
        message: "Unauthorized to accept"
    });
}

if (problem.status !== "OPEN") {
    return res.status(400).json({
        success: false,
        message: "Problem is not open"
    });
}
     const isThere = problem.pendingRequests.find(
  (id )=> id.toString() === solverId.toString()
);
if(!isThere){
     return res.status(403).json({success:false,message:"Unauthorized to accept"});
     }

     const updatedProblem = await Problem.findByIdAndUpdate(
        problemId,
        {
            $set : {
                status:"IN_PROGRESS",
                helperId:solverId,
                pendingRequests:[]
            }
          
        },
        {new:true}
     );
     res.status(200).json({
  message: "Problem updated successfully",
  problem: updatedProblem
});}
catch(err){
    return res.status(500).json({success:false,message:"error Accepting the Request"});
}

};

const rejectRequest = async (req,res)=>{
  try{  const problemId = req.params.id;
    const solverId = req.body.solverId;
     if (!solverId) {
    return res.status(400).json({
        success: false,
        message: "Solver ID is required"
    });}

    const problem = await Problem.findById(problemId);
    if(!problem){
        return res.status(404).json({success:false,message:"Problem Not Found"});
    }
   if (problem.askerId.toString() !== req.user.id) {
    return res.status(403).json({
        success: false,
        message: "Unauthorized to reject"
    });
}


     const isThere = problem.pendingRequests.find(
  (id )=> id.toString() === solverId.toString()
);
if(!isThere){
     return res.status(403).json({success:false,message:"Unauthorized to reject"});
     }
      const updatedProblem = await Problem.findByIdAndUpdate(
        problemId,
        {
           
            $pull:{
                pendingRequests:solverId,
            }
          
        },
        {new:true}
     );
  res.status(200).json({
  message: "Request rejected successfully",
  problem: updatedProblem
});}
catch(err){
    return res.status(500).json({success:false,message:"error Rejecting the Request"});
}
};
module.exports = {requestToSolve,rejectRequest,acceptRequest,getReceivedRequests,getSentRequests};
