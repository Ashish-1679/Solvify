
const express = require("express");
const router = express.Router();

const {
    requestToSolve,
    getSentRequests,
    getReceivedRequests,
    acceptRequest,
    rejectRequest
} = require("../controllers/request.js");



router.post("/send/:id", requestToSolve);
router.get("/sent", getSentRequests);
router.get("/received", getReceivedRequests);
router.post("/accept/:id", acceptRequest);
router.post("/reject/:id", rejectRequest);

module.exports = router;
