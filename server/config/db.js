const mongoose = require("mongoose");
const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);
const connectDB = async() =>{
    try{
         await mongoose.connect(process.env.MONGODB_URI);
         console.log("MONGODB connected successfully");
    }
    catch(err){
        console.error(err.message);
        throw err;
    }
}
module.exports = {connectDB};