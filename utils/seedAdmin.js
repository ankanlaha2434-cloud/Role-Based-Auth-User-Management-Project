require('dotenv').config();
const mongoose=require('mongoose'), bcrypt=require('bcryptjs'), User=require('../models/User');
(async()=>{await mongoose.connect(process.env.MONGO_URI); const email=(process.argv[2]||'admin@example.com').toLowerCase(); const password=process.argv[3]||'Admin@123'; if(await User.findOne({email})){console.log('Admin already exists');process.exit();} await User.create({name:'Administrator',email,mobile:'0000000000',password:await bcrypt.hash(password,12),role:'admin'}); console.log(`Admin created: ${email} | password: ${password}`); process.exit();})();
