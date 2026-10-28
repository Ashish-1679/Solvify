const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const Problem = require("../models/problem.js");
const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*"
        }
    });
    io.use((socket,next)=>{
        const token = socket.handshake.auth.token;
        if(!token) return next(new Error("Authentication required"));
        try{
         const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.userId;
        next();
        }
        catch(err){
return next(new Error("Authentication Required"));
        }
    });

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);
socket.on("joinRoom", async (problemId) => {
 try {
    const problem = await Problem.findById(problemId);

    if (!problem) {
        socket.emit("errorMessage", "Problem not found");
        return;
    }
    if(problem.askerId.toString()!==socket.userId.toString()&&problem.helperId?.toString()!==socket.userId.toString()){
        socket.emit("errorMessage","You are not allowed to access this chat");
        return;
    }
    if ( problem.status !== "IN_PROGRESS" && problem.status !== "RESOLVED") {
    socket.emit("errorMessage", "This chat is not available");
    return;
}
socket.join(problemId);
socket.emit("RoomJoined" ,{
    success:true,
    message:"Joined Successfully",
    problemId : problemId
});
} catch (err) {
    socket.emit("errorMessage", "Unable to join room");
}});

  socket.on("sendMessage",async(data={})=>{
   try{
    if (!data || typeof data !== "object" || Array.isArray(data)) {
    socket.emit("errorMessage", "Invalid message data");
    return;
}
   const {problemId,content} = data;
     if (typeof problemId !== "string" ||  !/^[0-9a-fA-F]{24}$/.test(problemId)) {
            socket.emit("errorMessage", "Invalid problem ID");
            return;
        }
        if (typeof content !== "string" || !content.trim()) {
            socket.emit("errorMessage", "Message cannot be empty");
            return;
        }
         if (!socket.rooms.has(problemId)) {
            socket.emit("errorMessage", "Join the chat room first");
            return;
        }
        const problem = await Problem.findById(problemId);

        if (!problem) {
            socket.emit("errorMessage", "Problem not found");
            return;
        }
         if ( problem.askerId.toString() !== socket.userId.toString() && problem.helperId?.toString() !== socket.userId.toString()
        ) {
            socket.emit(
                "errorMessage",
                "You are not allowed to send messages in this chat" );
            return;
        }
        if (problem.status !== "IN_PROGRESS") {
            socket.emit(
                "errorMessage",
                "Cannot send messages to a resolved or inactive problem"
            );
            return;
        }
        const newMessage = await Message.create({
            problemId: problemId,
            senderId: socket.userId,
            content: content.trim(),
            isRead: false
        });
io.to(problemId).emit("newMessage", newMessage);
   }
   catch(err){
           console.error("Error sending message:", err.message);
        socket.emit("errorMessage", "Unable to send message");
   }

  });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });

    return io;
};

module.exports = initializeSocket;