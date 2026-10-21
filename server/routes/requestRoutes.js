
const express = require("express");
const router = express.Router();

const {
    requestToSolve,
    getSentRequests,
    getReceivedRequests,
    acceptRequest,
    rejectRequest
} = require("../controllers/request.js");

const authMiddleware = require("../middlewares/authMiddleware.js");

router.post("/send/:id", authMiddleware, requestToSolve);
router.get("/sent", authMiddleware, getSentRequests);
router.get("/received", authMiddleware, getReceivedRequests);
router.post("/accept/:id", authMiddleware, acceptRequest);
router.post("/reject/:id", authMiddleware, rejectRequest);

module.exports = router;
