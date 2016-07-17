/**
 * Created by Sohail on 7/17/16.
 */

const
    http = require('http'),
    querystring = require('querystring');

var
    express = require('express'),
    nunjucks = require('nunjucks');

var app = express();

app.use('/static', express.static('public'));

nunjucks.configure('./templates', {
    autoescape: true,
    express: app,
    noCache: true
});

var users = [
    {
        "userId": 1,
        "username": "jane",
        "role": "producer",
        "password": "password",
        "email": "jane@email.com",
        "street_address": "1217 48th st",
        "city": "sacramento",
        "state": "california",
        "zip": "94203",
        "lon": -121.44,
        "lat": 38.56,
        "packages": [
            {
                "uid": 1,
                "trackingId": "1234",
                "weight": 5,
                "deliveryDate": "07/15/16",
                "readyDate": "07/14/16",
                "compostTypes": [1]
            },
            {
                "uid": 2,
                "trackingId": "1235",
                "weight": 6,
                "deliveryDate": null,
                "readyDate": null,
                "compostTypes": [1,2,3]
            }
        ]
    },
    {
        "userId": 2,
        "username": "dryver",
        "password": "password",
        "email": "dryver@email.com",
        "role": "transit",
        "packages": [
            {
                "uid": 1,
                "trackingId": "1234",
                "weight": 5,
                "deliveryDate": "07/15/16",
                "readyDate": "07/14/16",
                "compostTypes": [1]
            }
        ],
    }
];


app.get('/', function(req, res) {
    req.on('error', function(err) {
        res.end("error" + err.stack);
    });
    
    var resp = nunjucks.render('index.njk');
    res.set('Content-Type', 'text/html');
    res.end(resp);
});

app.get('/update-check', function(req, res) {
    console.log('checked for update');
   req.on('error', function(err) {
      res.end('error' + err.stack);
   });

    var updated = false;
    if (users[0].packages[1].readyDate !== null) {
        updated = true;
    }
    
    res.end(JSON.stringify({'updated': updated}));
});

app.get('/howto', function(req,res) {
    req.on('error', function(err) {
        res.end("error" + err.stack);
    });

    var resp = nunjucks.render('howto.njk');
    res.set('Content-Type', 'text/html');
    res.end(resp);

});

app.post('/iot/buzz', function(req, res) {
    if (users[0].packages[1].readyDate === null) {
        users[0].packages[1].readyDate = 'something';
    } else {
        users[0].packages[1].readyDate = null;
    }
    res.end(JSON.stringify(users[0].packages[1]));
});

app.listen(3000, function(){});