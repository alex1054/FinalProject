const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.API_PORT || 3000;

const API = require('./apikeys');
const {users, quotes, weeks} = require('./data');

app.use(cors());

// configure body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//app.get('/', (req, res) => {
//    res.status(200).send({ data: { message: "Everything is fine."}});
//});

app.get('/', (req, res) => {
    res.send('hi');
});

app.post('/api/register', (req, res) => {
    //get form content
    let email = req.body.email;
    let username = req.body.username;
    let user = API.createUser(email, username, req);
    console.log('USER LIST');
    console.log(users);
    res.status(200).send({data: user});
});

//app.get('/api/qoddate', API.validateKey, (req, res) => {
    //res.send(index);
//});

app.post('/api/qoddate', API.validateKey, (req, res) => {
    let date = req.body;
    let m = date.month;
    let d = date.day;
    console.log('date: ', d + '/' + m);

    for (var i = 0; i < weeks.m; i++) {
        if (d in weeks.m.i) {
            res.send({data: quotes[i]});
            //res.send('<p>' + quotes[i] + '</p>');
        }
    }
    res.send('<p>Sorry, the input date was not valid</p><a href="http://localhost:3000/api/qoddate">Resubmit Date</a><a href="http://localhost:3000/">Logout</a>');
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