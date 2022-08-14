const express = require('express');
const path = require('path');
const indexRouter = require('./routes/index');
const messageRouter = require('./routes/messages');
const userRouter = require('./routes/users');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongooseClient = require('./config/database');
const passport = require('passport');
const flash = require('connect-flash');
const compression = require('compression');
const helmet = require('helmet');

// ---- GENERAL SETUP

const app = express();
require('dotenv').config();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

// ---- SESSION SETUP

app.use(
  session({
    secret: process.env.MONGO_SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      client: mongooseClient,
      collectionName: 'sessions',
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

//---- PASSPORT AUTHENTICATION

require('./config/passport');

app.use(passport.initialize());
app.use(passport.session());

//Logs
app.use((req, res, next) => {
  console.log(req.session);
  console.log(req.user);
  next();
});

//---- ROUTES

app.use('/', indexRouter);
app.use('/messages', messageRouter);
app.use('/users', userRouter);

app.listen(process.env.PORT, () => console.log('Listening on port '));
