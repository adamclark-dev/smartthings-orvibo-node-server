var Orvibo = require("node-orvibo");
var o = new Orvibo();

var devices = {};

var discoveryTimer = [];
var subscribeTimer = [];

o.listen(function () {
    discoveryTimer = setInterval(function () {
        o.discover();
    }, 1000);
});

o.on("deviceadded", function (device) {
    clearInterval(discoveryTimer);
    o.discover();
    if (typeof devices[device.macAddress] === 'undefined') {
        subscribeTimer[device.macAddress] = setInterval(function() {
            o.subscribe(device)
        }, 1000);
    } else {
        devices[device.macAddress].state = device.state;
    }
});

o.on('subscribed', function(device) {
    clearInterval(subscribeTimer[device.macAddress]);
    console.log(device);
    devices[device.macAddress] = device;
});

exports.getDevices = function(callback) {
  callback(devices);
};

exports.changeState = function(params, callback) {
    var state = (params.state == 'on');
    o.setState({device: devices[params.mac], state: state});
    devices[params.mac].state = state;
    callback();
};