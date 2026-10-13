const express = require("express");

const {createProblem,getOpenProblems,getProblemsPostedByMe,
    getProblemById,deleteProblem,resolveProblem,reopenProblem
} = require("../controllers/problem.js");
const router = express.Router();
router.post("/",createProblem);
router.get("/open",getOpenProblems);
router.get("/my-posted",getProblemsPostedByMe);
router.get("/:id",getProblemById);
router.delete("/:id",deleteProblem);
router.patch("/:id/resolve",resolveProblem);
router.patch("/:id/reopen",reopenProblem);
module.exports = router;