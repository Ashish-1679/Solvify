
const express = require("express");
const router = express.Router();

const {
    getChatHistory,
   
    MessagesAsRead
} = require("../controllers/ChatController");

router.get("/:id/messages", getChatHistory);
router.patch("/:id/read", MessagesAsRead);

module.exports = router;
