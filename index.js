const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Mongo_url = 'mongodb://127.0.0.1:27017/WandersHub';
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js');
const expresserror = require('./utils/expresserror.js');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// models
const User = require('./models/users.js');

// routes
const routerlistings = require('./routes/listings.js');
const routerreviews = require('./routes/reviews.js');
const routerusers = require('./routes/user.js');

const Port = 2004;

app.set("view engine", 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

const sessionoptions = {
  secret: 'michaeljoksonn',
  resave: false,
  saveUninitialized: true,
  cookie : {
    expires : Date.now() + 24*60*60*1000,
    maxage :   24*60*60*1000,
    httponly : true
  }
}

app.use(session(sessionoptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(
    { usernameField: 'username' },
    async (username, password, done) => {
        try {
            // Find by username OR email
            const user = await User.findOne({
                $or: [
                    { username: username },
                    { email: username }
                ]
            });

            if (!user) {
                return done(null, false, { message: 'Invalid username/email or password' });
            }
            console.log("Found user:", user);        // is user being found?
            console.log("Username field:", user?.username); // what's stored?

            // passport-local-mongoose's authenticate method
            User.authenticate()(user.username, password, (err, authenticatedUser, errorMsg) => {
                if (err) return done(err);
                if (!authenticatedUser) return done(null, false, errorMsg);
                return done(null, authenticatedUser);
            });
        } catch (err) {
            return done(err);
        }
    }
));
// authenticate() Generates a function that is used in Passport's LocalStrategy

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// serializeUser() Generates a function that is used by Passport to serialize users into the session
// deserializeUser() Generates a function that is used by Passport to deserialize users into the session

async function main() {
    await mongoose.connect(Mongo_url);
}

main().then(res => {console.log("Connected to DB")})
.catch(err => console.log(err));

app.get('/', (req, res)=>{
    res.send("Working");
})

// app.get('/getuser', async (req, res)=>{
//     const fakeuser = new User({
//         email : "student@gmsil.com",
//         username : "student-nitkkr"
//     })
//     let registered_user = await User.register(fakeuser, "powerhouse");
//     res.send(registered_user);
// });

app.use((req, res, next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.curruser = req.user;
    next();
})

app.use('/listings', routerlistings);
app.use('/listings/:id/reviews', routerreviews);
app.use('/user', routerusers);

app.all('/{*path}', (req, res, next)=>{
    next(new expresserror(404, "Page not found!"));
})

app.use((err, req, res, next)=>{
    let {statuscode=500, message="Something went wrong!"} = err;
    res.status(statuscode).render('listings/error.ejs', {message});
})

app.listen(Port, ()=>{
    console.log("App is listening");
})
