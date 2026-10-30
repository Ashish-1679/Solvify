const User = require('../models/user.js');
const Problem = require('../models/problem.js');

const createProblem = async (req, res) => {
    const session = await Problem.startSession();
    try {
        session.startTransaction();
        const user = await User.findById(req.user.id).session(session);
        const { title, description, tags, bounty } = req.body;
        if (!user) {
            await session.abortTransaction();
            return res.status(404).json({
                success: false,
                message: "Invalid User"
            });
        }
        if (
            bounty === undefined ||
            bounty === null ||
            bounty === "" ||
            !Number.isSafeInteger(Number(bounty)) ||
            Number(bounty) <= 0
        ) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: "Bounty must be a valid positive whole number"
            });
        }

        const bountyAmount = Number(bounty);
        const updatedUser = await User.findOneAndUpdate(
            {
                _id: req.user.id,
                coins: { $gte: bountyAmount }
            },
            {
                $inc: { coins: -bountyAmount }
            },
            {
                new: true,
                session
            }
        );
        if (!updatedUser) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: "Insufficient coins to create this problem"
            });
        }

        // Create the problem in the same transaction.
        const [problem] = await Problem.create(
            [{
                title,
                description,
                tags,
                bounty: bountyAmount,
                askerId: req.user.id
            }],
            { session }
        );

        await session.commitTransaction();

        return res.status(201).json({
            success: true,
            message: "Problem created successfully",
            problem
        });
    } catch (err) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }

        console.error("Error creating problem:", err.message);

        return res.status(500).json({
            success: false,
            message: "Unable to create problem"
        });
    } finally {
        await session.endSession();
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

const deleteProblem = async (req, res) => {
    const session = await Problem.startSession();

    try {
        session.startTransaction();

        const problem = await Problem.findById(req.params.id).session(session);

        if (!problem) {
            await session.abortTransaction();
            return res.status(404).json({
                success: false,
                message: "Problem not found"
            });
        }

        if (problem.askerId.toString() !== req.user.id) {
            await session.abortTransaction();
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this problem"
            });
        }

        if (problem.status !== "OPEN") {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: "Only open problems can be deleted"
            });
        }

        // Delete only if the problem is still OPEN.
        const deletedProblem = await Problem.findOneAndDelete({
            _id: problem._id,
            askerId: req.user.id,
            status: "OPEN"
        }).session(session);

        if (!deletedProblem) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: "Problem has already been changed or deleted"
            });
        }

        // Refund the bounty in the same transaction.
        await User.updateOne(
            { _id: problem.askerId },
            { $inc: { coins: problem.bounty } },
            { session }
        );

        await session.commitTransaction();

        return res.status(200).json({
            success: true,
            message: "Problem deleted and bounty refunded successfully"
        });
    } catch (err) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }

        console.error("Error deleting problem:", err.message);

        return res.status(500).json({
            success: false,
            message: "Unable to delete problem"
        });
    } finally {
        await session.endSession();
    }
};

    
const resolveProblem = async (req, res) => {
    const session = await Problem.startSession();
    try {
        session.startTransaction();
        const problem = await Problem.findById(req.params.id).session(session);
        if (!problem) {
            await session.abortTransaction();
            return res.status(404).json({
                success: false,
                message: "Problem not found"
            });
        }
        if (problem.askerId.toString() !== req.user.id) {
            await session.abortTransaction();
            return res.status(403).json({
                success: false,
                message: "Only the asker can resolve this problem"
            });
        }
        if (problem.status !== "IN_PROGRESS") {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: "Problem is not currently in progress"
            });
        }

        if (!problem.helperId) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: "No helper is assigned to this problem"
            });
        }

        const helper = await User.findById(problem.helperId).session(session);

        if (!helper) {
            await session.abortTransaction();
            return res.status(404).json({
                success: false,
                message: "Helper not found"
            });
        }
        // Atomically claim the resolution.
        const updatedProblem = await Problem.findOneAndUpdate(
            {
                _id: problem._id,
                askerId: req.user.id,
                status: "IN_PROGRESS",
                helperId: problem.helperId
            },
            {
                $set: { status: "RESOLVED" }
            },
            {
                new: true,
                session
            }
        );

        if (!updatedProblem) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: "Problem has already been resolved or changed"
            });
        }

        await User.updateOne(
            { _id: problem.helperId },
            { $inc: { coins: problem.bounty } },
            { session }
        );

        await session.commitTransaction();

try {
    const io = req.app.get("io");
    const room = problem._id.toString();

    const sockets = await io.in(room).fetchSockets();

    for (const socket of sockets) {
        await socket.leave(room);
    }
} catch (socketError) {
    console.error(
        "Unable to clean up resolved problem room:",
        socketError.message
    );
}
        return res.status(200).json({
            success: true,
            message: "Problem resolved and bounty transferred successfully"
        });
    } catch (err) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }

        console.error("Error resolving problem:", err.message);

        return res.status(500).json({
            success: false,
            message: "Unable to resolve problem"
        });
    } finally {
        await session.endSession();
    }
};


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
        const previousHelperId = problem.helperId?.toString();


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
if(previousHelperId){
    const io = req.app.get("io");
    const room = req.params.id;
    const sockets = await io.in(room).fetchSockets();
    for(const socket of sockets){
        if (socket.userId?.toString() === previousHelperId) {
                    await socket.leave(room);
                }
    }
}
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