const User = require('../models/user.js');
const Problem = require('../models/problem.js');
const createProblem = async(req,res)=>{
    try{    
    const user = await User.findById(req.user.id);
    const {bounty} = req.body;
         if(user.coins<bounty){
        return res.status(400).json({
                success: false,
                message: "Insufficient coins to create this problem"
            });
         }
        const problem = await Problem.create({
    title: req.body.title,
    description: req.body.description,
    tags: req.body.tags,
    bounty: bounty,
    askerId: req.user.id
});
await User.findByIdAndUpdate(
    req.user.id,
    { coins: user.coins - bounty }
);
return res.status(201).json({
    success: true,
    message: "Problem created successfully",
    problem
});


        }
         catch(err){
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