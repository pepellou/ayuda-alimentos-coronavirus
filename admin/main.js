var init_firebase = function() {
    var firebaseConfig = {
        apiKey: "AIzaSyCNCfCoMnJMx7ncX6An3zCQc4TWsK60300",
        authDomain: "ayuda-alimentos-coronavirus.firebaseapp.com",
        databaseURL: "https://ayuda-alimentos-coronavirus.firebaseio.com",
        projectId: "ayuda-alimentos-coronavirus",
        storageBucket: "ayuda-alimentos-coronavirus.appspot.com",
        messagingSenderId: "622677547690",
        appId: "1:622677547690:web:0a04757a7c6ab63dacced3"
    };

    firebase.initializeApp(firebaseConfig);
};

var get_link = function(tweet) {
    return 'https://twitter.com/' + tweet.nick + '/status/' + tweet.id;
};

$(function() {
    init_firebase();

    var database = firebase.database();

    database.ref('tweets').on('value', function(snapshot) {
        var tweets = snapshot.val();
        $('table#tweets tbody').html('');
        for (id in tweets) {
            var tweet = tweets[id];
            var link = get_link(tweet);
            var tags = tweet.tags != undefined && tweet.tags != '' ? tweet.tags.split(',') : [];
            var tags_cell = '';
            for (var i in tags) {
                var tag = tags[i];
                tags_cell += '#' + tag + '<br/>';
            }
            $('table#tweets tbody').prepend(
                '<tr><td>'
                    + tags_cell
                    + '</td><td>'
                    + tweet.message
                    + '</td><td><a href="'
                    + link
                    + '" target="_blank">Ver tweet</a></td>'
                    + '<td><button data-action="edit" data-id="'
                    + id
                    + '" data-id="'
                    + id
                    + '">Editar</button> <button data-action="delete" data-id="'
                    + id
                    + '" data-id="'
                    + id
                    + '">Borrar</button> '
                    + '</td></tr>'
            );
        }
        $('button').on('click', function() {
            var button = $(this);
            var action = button.data('action');
            if (action == 'edit') {
                var id = button.data('id');
                database.ref('tweets/' + id).on('value', function(snapshot) {
                    var tweet = snapshot.val();
                    $('#edit-modal-id').val(id);
                    $('#edit-modal-tweet-id').val(tweet.id);
                    $('#edit-modal span.nick').html(tweet.nick)
                    $('#edit-modal span.text').html(tweet.message)
                    $('#edit-modal-hashtags').val(tweet.tags)
                    $('#edit-modal-volunteer').prop('checked', tweet.type == 'volunteer');
                    $('#edit-modal-gps-lat').val(tweet.gps != undefined ? tweet.gps.lat : '')
                    $('#edit-modal-gps-lon').val(tweet.gps != undefined ? tweet.gps.lon : '')
                    $('#edit-modal').modal();
                });
            } else if (action == 'delete') {
                var id = button.data('id');
                if (confirm("Seguro de borrar?")) {
                    database.ref('tweets/' + id).remove();
                }
            } else if (action == 'new') {
                $('#new-modal').modal();
            }
        });
    });

    $('#edit-modal button.btn-primary').on('click', function() {
        var id = $('#edit-modal-id').val();
        var lat = $('#edit-modal-gps-lat').val();
        var lon = $('#edit-modal-gps-lon').val();
        var tweet = {
            id: $('#edit-modal-tweet-id').val(),
            nick: $('#edit-modal span.nick').html(),
            message: $('#edit-modal span.text').html(),
            tags: $('#edit-modal-hashtags').val(),
            type: $('#edit-modal-volunteer').is(':checked') ? 'volunteer' : 'need-help'
        };
        if (lat != '' && lon != '') {
            tweet.gps = { lat: lat, lon: lon };
        }
        database.ref('tweets/' + id).set(tweet);
        $('#edit-modal').modal('hide');
    });

    $('#new-modal button.btn-primary').on('click', function() {
        var id = $('#new-modal-id').val();
        var lat = $('#new-modal-gps-lat').val();
        var lon = $('#new-modal-gps-lon').val();
        var url = $('#new-modal-url').val();
        var tweet = {
            id: '',
            nick: $('#new-modal-nick').val(),
            message: $('#new-modal-message').val(),
            tags: $('#new-modal-hashtags').val(),
            type: $('#new-modal-volunteer').is(':checked') ? 'volunteer' : 'need-help',
            url: $('#new-modal-url').val()
        };
        if (lat != '' && lon != '') {
            tweet.gps = { lat: lat, lon: lon };
        }
        database.ref('tweets').push(tweet);
        $('#new-modal').modal('hide');
    });
});
