const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = express.Router();
const app = express();
const port = process.env.API_PORT || 3000;

const API = require('./middleware/apikeys');
const {users, quotes, weeks} = require('./data');

app.use(cors());

// configure body parser middleware
app.use("/", router);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//app.get('/', (req, res) => {
//    res.status(200).send({ data: { message: "Everything is fine."}});
//});
router.get('/', (req, res) => {
    res.sendFile('index2.html', { root: '.' });
});

//app.get('/', (req, res) => {
//    res.redirect('/api/register');
//});

app.post('/register', (req, res) => {
    //get form content
    let u_name = req.body.username;
    let e_mail = req.body.email;
    let user = API.createUser(e_mail, u_name, req);
    console.log('USER LIST');
    console.log(users);
    //res.send('<a href="http://localhost:3000/qod">Get Quote of The Day</a>');
    //users.push(user);
    res.send({ data: user });
    //res.status(201).send('<a href="http://localhost:3000/qod">Get Quote of The Day</a>');
    //res.redirect('/qod');
    //res.redirect('/qod');
});

app.get('/qod', API.validateKey, (req, res) => {
    res.sendFile('qod.html', { root: '.' });
});

app.post('/qoddate', API.validateKey, (req, res) => {
    let date = req.body;
    let m = date.month;
    let d = date.day;
    console.log('date: ', d + '/' + m);

    for (var i = 0; i < weeks.m; i++) {
        if (d in weeks.m.i) {
            //res.send();
            res.send('<p>' + quotes[i] + '</p>');
        }
    }
    res.send('<p>Sorry, the input date was not valid</p><a href="http://localhost:3000/qoddate">Resubmit Date</a><a href="http://localhost:3000/">Logout</a>');
});
//app.post('/api/viewqod', API.validateKey, (req, res) => {
    //get form content
//    const date = req.body;
//    var m = date.month;
//    var d = date.day;

//    for (var i = 0; i < weeks.m; i++) {
//        if (d in weeks.m.i) {
//            document.getElementById('quoteDisplay').innerHTML = API.quotes[i];
//        }
//    }
//});

app.listen(port, function (err) {
    if (err) {
        console.error('Failure to launch server');
        return;
    }
    console.log(`listening on port ${port}`)
});