exports.requireAuth = (req,res,next)=>{ if(!req.session.user){ req.session.message='Please login first.'; return res.redirect('/login'); } next(); };
exports.allowRoles = (...roles)=>(req,res,next)=>{ if(!req.session.user || !roles.includes(req.session.user.role)) return res.status(403).render('errors/403'); next(); };
