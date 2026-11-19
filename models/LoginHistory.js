const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  userId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
  loginAt:{type:Date,default:Date.now},
  logoutAt:{type:Date,default:null},
  ipAddress:String,userAgent:String,
  status:{type:String,enum:['success','logged-out','failed'],default:'success'}
},{timestamps:true});
module.exports = mongoose.model('LoginHistory',schema);
