var Orvibo = require("node-orvibo");
var o = new Orvibo();

var devices = {};

o.listen(function () {
    setInterval(function () {
        o.discover();
    }, 10000);
});

o.on("deviceadded", function (device) {
    if (typeof devices[device.macAddress] === 'undefined') {
        devices[device.macAddress] = device;
        o.subscribe(device);
    } else {
        devices[device.macAddress].state = device.state;
    }
});

o.on('subscribed', function(data) {
    console.log(data);
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