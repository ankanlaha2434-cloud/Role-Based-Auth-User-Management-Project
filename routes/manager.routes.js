const router=require('express').Router(),{requireAuth,allowRoles}=require('../middlewares/auth'),User=require('../models/User');
router.get('/dashboard',requireAuth,allowRoles('admin','manager'),async(req,res)=>{const users=await User.find().select('name email role isActive createdAt').sort({createdAt:-1}).limit(100);res.render('dashboards/manager',{users});});
module.exports=router;
