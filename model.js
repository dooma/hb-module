var dbClient = require('mongodb').Db;
var dbServer = require('mongodb').Server;
var ObjectID = require('mongodb').ObjectID;
var projection = {fields: {'happybonus': 1, 'person': 1}};
var database = new dbClient('sag-shops', new dbServer('localhost', 27017), {safe: false});
var db;

var getDb = function (callback) {
    if (db) { return callback(null, db); }

    database.open(function (error, newDb) {
        if (error) { return callback(error) }

        db = newDb;
        callback(null, db);
    });
};

exports.getUsers = function (pattern, callback) {
    pattern = pattern.toLowerCase().replace(/\s+/, '|');
    pattern = new RegExp(pattern);
    var query = {'person': {$exists: 1}, 'happybonus': {$exists: 1}, 'meta': pattern};
    getDb(function (error, db) {
        if (error) { throw error; }

        db.collection.find(query, projection).toArray(callback);
    });
};
exports.getUser = function (id, callback) {
    database.open (function (error, db) {
        if (error) { throw error; }
        db.collection('users_happy', function (error, coll) {
            var query = {'person': {$exists: 1}, 'happybonus': {$exists: 1}, '_id': ObjectID(id)};
            coll.findOne(query, projection, callback);
            db.close();
        });
    });
};
exports.editUser = function (id, points, callback) {
    database.open (function (error, db) {
        if (error) { throw error; }
        db.collection('users_happy', function (error, coll) {
            var query = {'_id': ObjectID(id)};
            coll.update(query, {$set: {'happybonus.points': parseInt(points)}}, callback);
            db.close();
        });
    });
};
exports.transfer = function (ids, points, callback) {
    database.open (function (error, db) {
        if (error) { throw error; }
        db.collection('users_happy', function (error, coll) {
            var convertPoints = function (points) {
                if (isNaN(parseInt(points))) { return 0 };
                return parseInt(points);
            };

            points = convertPoints(points);

            var query = {'_id': ObjectID(ids[0])};
            coll.findOne(query, projection, function (error, doc) {
                var diff = convertPoints(doc['happybonus']['points']) - points;

                if (diff < 0) { callback('User has not enough points', 'done'); }
                else {
                    coll.update(query, {$set: {'happybonus.points': diff}}, function (error, result) {
                        query = {'_id': ObjectID(ids[1])};

                        coll.findOne(query, projection, function(error, doc) {
                            var sum = convertPoints(doc['happybonus']['points']) + points;
                            coll.update(query, {$set: {'happybonus.points': sum}}, callback);
                        });
                    });
                }
            });
            db.close();
        });
    });
};
