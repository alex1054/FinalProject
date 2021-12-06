const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = express.Router();
const app = express();
const port = process.env.API_PORT || 3000;

const API = require('./middleware/apikeys');
const {users, quotes, quotes2} = require('./data');

app.use(cors());

// configure body parser middleware
app.use("/", router);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile('index.html', {root: '.'});
});

app.post('/', (req, res) => {
    let u_name = req.body.username;
    let e_mail = req.body.email;
    let user = API.createUser(e_mail, u_name, req);
    console.log('USER LIST');
    console.log(users);
    res.redirect('/qod');
    //res.status(201).send({ data: user });
    //res.status(201).send('<a href="http://localhost:3000/qod">Get Quote of The Day</a>');
    //res.send('API Key created!');
});

app.get('/qod', (req, res) => {
    res.sendFile('qod.html', { root: '.' });
});

app.post('/qod', (req, res) => {
    console.log('post qod');
    let d = Number(req.body.day);
    let m = String(req.body.month);
    
    let date = quotes2.find(
        (date) => date.month === m && date.max >= d
    );

    if (date) {
        var doy = date.doy;
        console.log('doy: %d', doy);
        console.log('d: %d', d);
        var week = Math.ceil((doy + d)/7);
        console.log('date: ', d + '/' + m);
        console.log('week: %d', week);

        res.send('<h1>' + quotes[week-1] + '</h1>');
    } else {
        res.send('<h1> No quote found for the given date.</h1>');
    }

});

app.listen(port, function (err) {
    if (err) {
        console.error('Failure to launch server');
        return;
    }
    console.log(`listening on port ${port}`)
});