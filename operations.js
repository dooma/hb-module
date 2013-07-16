model = require('./model.js');

exports.index = function (link) {
    if (link.data) {
        console.log(link.data);
        var response = model.getUsers(link.data, link.send);
        return;
    }

    link.send(200, 'No data sent to me');
};

exports.show = function (link) {
    if (link.data) {
        return;
    }

    link.send(200, 'No data sent to me');
};

exports.edit = function (link) {
    if (link.data) {
        return;
    }

    link.send(200, 'No data sent to me');
};

exports.transfer = function (link) {
    if (link.data) {
        return;
    }

    link.send(200, 'No data sent to me');
};
