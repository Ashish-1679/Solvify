const User = require('../models/user.js');
const Problem = require('../models/problem.js');
const createProblem = async(req,res)=>{
    try{    
        const user = await User.findById(req.user.id);
        const { title, description, tags, bounty } = req.body;
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Invalid User"
            });
        }
        if(
            bounty === undefined ||
            bounty === null ||
            bounty === "" ||
            !Number.isSafeInteger(Number(bounty)) ||
            Number(bounty) <= 0
        ){  return res.status(400).json({
                success: false,
                message: "Bounty must be a valid positive whole number"
            });
        }

        const bountyAmount = Number(bounty);

        // Deduct coins only if the balance is sufficient
        const updatedUser = await User.findOneAndUpdate(
            {   _id: req.user.id,
                coins: { $gte: bountyAmount }
            },
            {
                $inc: { coins: -bountyAmount }
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(400).json({
                success: false,
                message: "Insufficient coins to create this problem"
            });
        }

        const problem = await Problem.create({
            title,
            description,
            tags,
            bounty: bountyAmount,
            askerId: req.user.id
        });

        return res.status(201).json({
            success: true,
            message: "Problem created successfully",
            problem
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


const getOpenProblems = async(req,res)=>{
   try{
      const problems = await Problem.find({
        askerId : {$ne:req.user.id},
        status : "OPEN",
      });
      return res.status(200).json({
    success: true,
    problems
});

   }
   catch(err){
     return res.status(500).json({
            success: false,
            message: err.message
        });
   }
}
const getProblemsPostedByMe = async(req,res)=>{
    try{
     const problems = await Problem.find({
        askerId : req.user.id,
        status : "OPEN",
     });
     return res.status(200).json({
        success: true,
        problems
     });
    }
    catch(err){
          return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}
const getProblemById = async(req,res) =>{
   try{
          const problem  = await Problem.findById(req.params.id);
          if (!problem) {
    return res.status(404).json({
        success: false,
        message: "Problem not found"
    });
}
          return res.status(200).json({success:true,problem});
   }
   catch(err){
     return res.status(500).json({
        success:false,
         message : err.message
     });
   }
}
const deleteProblem = async(req,res) =>{
     try{
        const problem = await Problem.findById(req.params.id);
              if (!problem) {
    return res.status(404).json({
        success: false,
        message: "Problem not found"
    });}
     if (problem.askerId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this problem"
            });
        }

        if (problem.status !== "OPEN") {
            return res.status(400).json({
                success: false,
                message: "Only open problems can be deleted"
            });
        }

        await User.findByIdAndUpdate(problem.askerId, {
            $inc: { coins: problem.bounty }
        });

        await Problem.findByIdAndDelete(problem._id);
     
return res.status(200).json({success:true});
}
catch(err){
    return res.status(500).json({
        success:false,
         message : err.message
     });
}
};
const resolveProblem = async(req,res) =>{
    try {
        const problem = await Problem.findById(req.params.id);

        if (!problem) {
            return res.status(404).json({
                success: false,
                message: "Problem not found"
            });
        }

        if (problem.askerId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Only the asker can resolve this problem"
            });
        }

        if (problem.status !== "IN_PROGRESS") {
            return res.status(400).json({
                success: false,
                message: "Problem is not currently in progress"
            });
        }

        if (!problem.helperId) {
            return res.status(400).json({
                success: false,
                message: "No helper is assigned to this problem"
            });
        }

        const helper = await User.findById(problem.helperId);

        if (!helper) {
            return res.status(404).json({
                success: false,
                message: "Helper not found"
            });
        }
        problem.status = "RESOLVED";
        await problem.save();
        helper.coins += problem.bounty;
        await helper.save();
        return res.status(200).json({
            success: true,
            message: "Problem resolved and bounty transferred successfully"
        });
    }
catch(err){
     return res.status(500).json({
        success:false,
         message : err.message
     });
}
}
const reopenProblem = async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);

        if(!problem){
            return res.status(404).json({
                success: false,
                message: "Problem not found"
            });
        }

        if(problem.askerId.toString() !== req.user.id){
            return res.status(403).json({
                success: false,
                message: "Only the asker can reopen this problem"
            });
        }

        if(problem.status !== "IN_PROGRESS"){
            return res.status(400).json({
                success: false,
                message: "Only problems in progress can be reopened"
            });
        }

      if (problem.helperId) {
    const alreadyRejected = problem.rejectedHelpers.some(
        id => id.toString() === problem.helperId.toString()
    );

    if (!alreadyRejected) {
        problem.rejectedHelpers.push(problem.helperId);
    }
}

        problem.status = "OPEN";
        problem.helperId = null;

        await problem.save();

        return res.status(200).json({
            success: true,
            message: "Problem reopened successfully"
        });
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
module.exports = {createProblem,getOpenProblems,getProblemsPostedByMe,
    getProblemById,deleteProblem,resolveProblem,reopenProblem
}