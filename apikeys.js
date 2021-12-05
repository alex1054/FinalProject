const users = require('./data').users;
const MAX = process.env.API_MAX || 25;

const genKey = () => {
    return [...Array(30)]
        .map((e) => ((Math.random() * 36) | 0).toString(36))
        .join('');
};

const createUser = (_email, _username, req) => {
    let today = new Date().toISOString().split('T')[0];
    let user = {
        email: _email,
        username: _username,
        apikey: genKey(),
        host: req.headers.origin,
        usage: [{ date: today, count: 0}]
    };

    console.log('add user');
    users.push(user);
    return user;
};

const validateKey = (req, res, next) => {
    let host = req.headers.origin;
    let apikey = req.header('x-api-key');
    let account = users.find(
        (user) => user.host == host && user.apikey == apikey
    );

    if (account) {
        let today = new Date().toISOString().split('T')[0];
        let usageIndex = account.usage.findIndex((day) => day.date == today);
        if (usageIndex >= 0) {
            if (account.usage[usageIndex].count >= MAX) {
                res.status(429).send({
                    error: {
                        code: 429,
                        message: 'Max API calls exceeded.',
                    },
                });
            } else {
                account.usage[usageIndex].count++;
                console.log('Good API call', account.usage[usageIndex]);
                next();
            }
        } else {
            account.usage.push({ date: today, count: 1 });
            next();
        }
    } else {
        res.status(403).send({ error: { code: 403, message: "You're not allowed."} });
    }
};

module.exports = {createUser, validateKey};
