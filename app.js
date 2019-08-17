const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');  mongoose.set('useCreateIndex', true);
const keys = require('./config/keys');
const passport = require('passport');
const cors = require('cors');

const port = 3000;

app.use(function(req, res, next) { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", true);
    next();
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(require('morgan')('dev'));
app.use(cors());

mongoose.connect(keys.mongoURL)
    .then(() => console.log('MongoDB connected'))
    .catch(error => console.log(error));

app.use(passport.initialize());
require('./middleware/passport')(passport);

const authRoutes =  require('./routes/auth');
const watchRoutes = require('./routes/categories');

app.use('/user', authRoutes);
app.use('/watch', watchRoutes);

app.listen(port, () => {
    console.log(console.log(`Server is running ${port} ...`))
});

// module.exports = app;

