require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const helmet = require('helmet');
const methodOverride = require('method-override');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => { console.error('MongoDB connection error:', err.message); process.exit(1); });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET || 'development-secret-change-me',
  resave: false, saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 1000*60*60*8 }
}));
app.use((req,res,next)=>{ res.locals.currentUser = req.session.user || null; res.locals.message = req.session.message || null; delete req.session.message; next(); });
app.use('/auth', rateLimit({ windowMs: 15*60*1000, limit: 100, standardHeaders: true, legacyHeaders: false }));
app.use('/', require('./routes/auth.routes'));
app.use('/', require('./routes/profile.routes'));
app.use('/', require('./routes/dashboard.routes'));
app.use('/admin', require('./routes/admin.routes'));
app.use('/manager', require('./routes/manager.routes'));
app.use((req,res)=>res.status(404).render('errors/404'));
app.use((err,req,res,next)=>{ console.error(err); res.status(500).render('errors/500'); });
app.listen(PORT,()=>console.log(`Server running: http://localhost:${PORT}`));
