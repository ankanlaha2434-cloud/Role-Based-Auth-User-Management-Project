const router=require('express').Router(), bcrypt=require('bcryptjs');
const {body,validationResult}=require('express-validator');
const User=require('../models/User'), LoginHistory=require('../models/LoginHistory');
router.get('/',(req,res)=>res.render('home'));
router.get('/register',(req,res)=>res.render('auth/register',{errors:[]}));
router.post('/register',[
 body('name').trim().notEmpty().withMessage('Name is required'),
 body('email').trim().isEmail().withMessage('Valid email required'),
 body('mobile').trim().notEmpty().withMessage('Mobile is required'),
 body('password').isLength({min:8}).withMessage('Password must be at least 8 characters')
],async(req,res)=>{const errors=validationResult(req); if(!errors.isEmpty())return res.render('auth/register',{errors:errors.array()});
 try{const {name,email,mobile,password}=req.body; if(await User.findOne({email:email.toLowerCase()}))return res.render('auth/register',{errors:[{msg:'Email already registered'}]});
 await User.create({name,email:email.toLowerCase(),mobile,password:await bcrypt.hash(password,12),role:'user'});
 req.session.message='Registration successful. Please login.';res.redirect('/login');
 }catch(e){res.render('auth/register',{errors:[{msg:'Could not register. Please try again.'}]});}});
router.get('/login',(req,res)=>res.render('auth/login',{errors:[]}));
router.post('/login',async(req,res)=>{try{const email=(req.body.email||'').toLowerCase().trim(),user=await User.findOne({email});
 if(!user||!await bcrypt.compare(req.body.password||'',user.password)||!user.isActive)return res.render('auth/login',{errors:[{msg:'Invalid credentials or inactive account.'}]});
 const previous=user.lastLoginAt; user.lastLoginAt=new Date();user.loginCount++;await user.save();
 const history=await LoginHistory.create({userId:user._id,ipAddress:req.ip,userAgent:req.get('user-agent')});
 req.session.regenerate(err=>{if(err)return res.status(500).render('errors/500');req.session.user={id:user._id,name:user.name,email:user.email,role:user.role,profilePicture:user.profilePicture};req.session.currentLogin=history._id;req.session.previousLogin=previous;req.session.save(()=>res.redirect('/dashboard'));});
 }catch(e){res.render('auth/login',{errors:[{msg:'Login failed. Try again.'}]});}});
router.post('/logout',async(req,res)=>{try{if(req.session.currentLogin)await LoginHistory.findByIdAndUpdate(req.session.currentLogin,{logoutAt:new Date(),status:'logged-out'});}catch(e){}
 req.session.destroy(()=>res.clearCookie('connect.sid').redirect('/login'));});
module.exports=router;
