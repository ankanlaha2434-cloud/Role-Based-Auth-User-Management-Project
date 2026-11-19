const router=require('express').Router(),{requireAuth,allowRoles}=require('../middlewares/auth'),User=require('../models/User'),LoginHistory=require('../models/LoginHistory');
router.get('/dashboard',requireAuth,(req,res)=>{if(req.session.user.role==='admin')return res.redirect('/admin/dashboard');if(req.session.user.role==='manager')return res.redirect('/manager/dashboard');res.redirect('/user/dashboard');});
router.get('/user/dashboard',requireAuth,allowRoles('user','manager','admin'),async(req,res)=>{const user=await User.findById(req.session.user.id);res.render('dashboards/user',{user,previousLogin:req.session.previousLogin});});
module.exports=router;
