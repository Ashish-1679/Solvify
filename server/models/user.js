const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:true,
        required:true,
        trim:true,
    },
     email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    coins: {
      type: Number,
      default: 100,
      min: 0,
    },
    reputation: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,

});
const User = mongoose.model("User",userSchema);
module.exports = User;