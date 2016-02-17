var Orvibo = require("node-orvibo");
var o = new Orvibo();

var devices = {};

o.listen(function () {
    o.discover();
    setInterval(function () {
        o.discover();
    }, 20000);
});

o.on("deviceadded", function (device) {
    devices[device.macAddress] = device;
    o.subscribe(device);
});

exports.getDevices = function(callback) {
  callback(devices);
};

exports.changeState = function(params, callback) {
    o.setState({device: devices[params.mac], state: (params.state == 'on')});
    devices[params.mac].state = (params.state == 'on');
    callback();
};