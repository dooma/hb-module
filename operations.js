var model = require('./model.js');

exports.index = function (link) {
    if (!link.data) {
        link.send(200, 'No data sent to me');
        return;
    }

    console.log(link.data);
    model.getUsers(link.data, function (error, data) {
        if (error) {
            link.send(400, error);
        } else {
            link.send(200, data);
        }
    });
};

exports.show = function (link) {
    if (!link.data) {
        link.send(200, 'No data sent to me');
        return;
    }

    console.log(link.data)
    model.getUser(link.data.id, function (error, data) {
        if (error) {
            link.send(400, error);
        } else {
            link.send(200, data);
        }
    });
};

exports.edit = function (link) {
    if (!link.data) {
        link.send(200, 'No data sent to me');
        return;
    }

    model.editUser(link.data.id, link.data.points, function (error, data) {
        if (error) {
            link.send(400, error);
        } else {
            link.send(200, data);
        }
    });
};

exports.transfer = function (link) {
    if (!link.data) {
        link.send(200, 'No data sent to me');
        return;
    }

    model.transfer(link.data.ids, link.data.points, function (error, data) {
        if (error) {
            link.send(400, error);
        } else {
            link.send(200, data);
        }
    });
};
