var http = require('http');
var url = require('url');

var router = require('./router');
var helpers = require('./helpers');

router.register('/device', function(req, res) {
    helpers.getDevices(function(device) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(device));
    });
});

router.register('/devices', function(req, res) {
    helpers.getDevices(function(devices) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(devices));
    });
});

router.register('/switch', function(req, res) {
    var params = url.parse(req.url, true).query;
    helpers.changeState(params, function() {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify('device ' + params.state));
    });
});

var server = http.createServer(function (req, res) {
    var handler = router.route(req);
    handler.process(req, res);
});

server.listen(8001);
console.log('Server running');