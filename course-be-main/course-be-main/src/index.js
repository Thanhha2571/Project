const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const path = require('path');
require('dotenv').config();
const cors = require('cors');

const port = 8081;
// EXPRESS CONFIG
app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
// app.use(fileUpload());
app.use(cors());
app.use(cors({ origin: ['http://localhost:3001','http://localhost:3000'], credentials: true }));
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization');
    next();
});
app.use(express.urlencoded({
    extended: true
}));
app.use(cookieParser('ddn'));
app.use(express.static(path.join(__dirname, 'public')));


// DATABASE
const database = require('./config/database');
const Account = require('./controller/AccountController');
database.connect();
// CONTROLLER
const AccountController = require('./controller/AccountController');
const TeacherController = require('./controller/TeacherController');
const AdminController = require('./controller/AdminController');
// ROUTER
const AccountRouter = require('./router/AccountRouter');
const StudentRouter = require('./router/StudentRouter');
const TeacherRouter = require('./router/TeacherRouter');
const AdminRouter = require('./router/AdminRouter');



app.use('/api/account', AccountRouter);
app.use('/api/student', StudentRouter);
app.use('/api/teacher', TeacherRouter);
app.use('/api/admin', AdminRouter);

app.listen(port, () => {
    console.log(`server is running in port ${port}`)
})