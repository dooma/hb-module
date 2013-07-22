module.exports = function (config) {
    var self = this;

//    var hideContainers = function () {
//        $('#changeForm, #transferForm').hide();
//        $('.commit').hide();
//        ids = [];
//    };
//
//    hideContainers();
//
//    $('#init #change').click(function () {
//        hideContainers();
//        $('#changeForm').show();
//    });
//
//    $('#init #transfer').click(function () {
//        hideContainers();
//        $('#transferForm').show();
//    });

    var showChange = function (id) {
        self.link('show', {data: {id: id}}, function (error, data) {
            if (error) { throw error; }

            ids = [data['_id']];
            $('#changeForm label').val(data['person']['fname'] + ' ' + data['person']['lname']);
            $('#changeForm .commit input').val(data['happybonus']['points'] || 0);
            $('#changeForm .commit').show();
        });
    };

    $('#changeTypeahead').typeahead({
        source: function (query, process) {
            self.link('index', {data: query}, function (error, data) {
                if (error) { throw error; }

                ids = [];
                users = []
                for (var i = 0; i < data.length; ++i) {
                    users.push(data[i]['person']['fname'] + ' ' + data[i]['person']['lname'] + ' ' + (data[i]['happybonus']['points'] || 0));
                    ids.push(data[i]['_id']);
                }
                return process(users);
            });
        },
        updater: function (selection) {
            showChange(ids[users.indexOf(selection)]);
            ids = [];
        }
    });

    $('#changeForm .commit button').click(function () {
        self.link('edit', {points: $('#changeForm .commit input').val(), data: { id: ids[0] }}, function (error, data) {
            if (error) { throw error; }
        });
    });

/*    var setToFirstField = function (id) {
        self.link('/user', {id: id}, function (error, data) {
            if (error) { throw error; }

            ids[0] = data['_id'];
            $('#transferForm #firstTypeahead').val(data['person']['fname'] + ' ' + data['person']['lname']);
            $('#transferForm .commit input').val(data['happybonus']['points'] || 0);
        });
    };

    $('#firstTypeahead').typeahead({
        source: function (query, process) {
            self.link('/users', {query: query}, function (error, data) {
                if (error) { throw error; }

                ids = [];
                users = []
                for (var i = 0; i < data.length; ++i) {
                    users.push(data[i]['person']['fname'] + ' ' + data[i]['person']['lname'] + ' ' + (data[i]['happybonus']['points'] || 0));
                    ids.push(data[i]['_id']);
                }
                return process(users);
            });
        },
        updater: function(selection){
            setToFirstField(ids[users.indexOf(selection)]);
        }
    });

    $('#secondTypeahead').typeahead({
        source: function(query, process){
            self.link('/users', {query: query}, function (error, data) {
                if (error) { throw error; }

                ids = [];
                users = []
                for (var i = 0; i < data.length; ++i) {
                    users.push(data[i]['person']['fname'] + ' ' + data[i]['person']['lname'] + ' ' + (data[i]['happybonus']['points'] || 0));
                    ids.push(data[i]['_id']);
                }
                return process(users);
            });
        },
        updater: function(selection){
            setToSecondField(ids[users.indexOf(selection)]);
        }
    });

    var setToSecondField = function (id) {
        self.link('/user', {id: id}, function (error, data) {
            if (error) { throw error; }

            ids[1] = data['_id'];
            $('#transferForm #secondTypeahead').val(data['person']['fname'] + ' ' + data['person']['lname']);
            $('#transferForm .commit').show();
        });
    };

    $('#transferForm .commit button').click(function () {
        self.link('/transfer', {points: $('#transferForm .commit input').val(), firstId: ids[0], secondId: ids[1]}, function (error, data) {
            if (error) { throw error; }
        });
    });
*/
}
