var dbClient = require('mongodb').Db;
var dbServer = require('mongodb').Server;
var ObjectID = require('mongodb').ObjectID;
var projection = {fields: {'happybonus': 1, 'person': 1}};
var database = new dbClient('sag-shops', new dbServer('localhost', 27017), {safe: false});
var db;

var getColl = function (callback) {
    if (db !== undefined) { return callback(null, db.collection('users_happy')); }

    database.open(function (error, newDb) {
        if (error) { return callback(error) }

        db = newDb;
        callback(null, newDb.collection('users_happy'));
    });
};

exports.getUsers = function (pattern, callback) {
    pattern = pattern.toLowerCase().replace(/\s+/, '|');
    pattern = new RegExp(pattern);
    var query = {'person': {$exists: 1}, 'happybonus': {$exists: 1}, 'meta': pattern};
    getColl(function (error, coll) {
        if (error) { throw error; }

        coll.find(query, projection).toArray(callback);
    });
};
exports.getUser = function (id, callback) {
    var query = {'person': {$exists: 1}, 'happybonus': {$exists: 1}, '_id': ObjectID(id)};

    getColl(function (error, coll) {
        if (error) { throw error; }

        coll.findOne(query, projection, callback);
    });
};
exports.editUser = function (id, points, callback) {
    var query = {'_id': ObjectID(id)};

    getColl(function (error, coll) {
        if (error) { throw error; }

        coll.update(query, {$set: {'happybonus.points': parseInt(points)}}, callback);
    });
};
exports.transfer = function (ids, points, callback) {
    var convertPoints = function (points) {
        points = points.toString().replace(/[\D]+/g, '');

        if (isNaN(parseInt(points))) { return 0 };
        return parseInt(points);
    };

    points = convertPoints(points);

    var query = {'_id': ObjectID(ids[0])};

    getColl(function (error, coll) {
        if (error) { throw error; }

        coll.findOne(query, projection, function (error, doc) {
            if (error) { throw error; }

            var diff = convertPoints(doc['happybonus']['points']) - points;

            if (diff < 0) { callback('User has not enough points', 'done'); }
            else {
                coll.update(query, {$set: {'happybonus.points': diff}}, function (error, result) {
                    if (error) { throw error; }

                    query = {'_id': ObjectID(ids[1])};

                    coll.findOne(query, projection, function(error, doc) {
                        if (error) { throw error; }

                        var sum = convertPoints(doc['happybonus']['points']) + points;
                        coll.update(query, {$set: {'happybonus.points': sum}}, callback);
                    });
                });
            }
        });
    });
};
