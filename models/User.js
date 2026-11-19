const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name:{type:String,required:true,trim:true},
  email:{type:String,required:true,unique:true,lowercase:true,trim:true},
  mobile:{type:String,required:true,trim:true},
  password:{type:String,required:true},
  profilePicture:{type:String,default:'/images/avatar.svg'},
  role:{type:String,enum:['admin','manager','user'],default:'user'},
  isActive:{type:Boolean,default:true},
  lastLoginAt:{type:Date,default:null},
  loginCount:{type:Number,default:0}
},{timestamps:true});
module.exports = mongoose.model('User',userSchema);
