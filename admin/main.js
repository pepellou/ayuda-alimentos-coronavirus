var get_link = function(tweet) {
    return tweet.url != undefined ? tweet.url : 'https://twitter.com/' + tweet.nick + '/status/' + tweet.id;
};

$(function() {
    firebase.initializeApp(firebaseConfig);

    var database = firebase.database();
    var tableOfProcessedMessages = $('table#messages tbody');
    var tableOfMessagesToProcess = $('table#messagesToProcess tbody');

    database.ref('tweets').on('value', function(snapshot) {
        var tweets = snapshot.val();
        tableOfProcessedMessages.html('');
        tableOfMessagesToProcess.html('');
        for (id in tweets) {
            var tweet = tweets[id];
            var link = get_link(tweet);
            var tags = tweet.tags != undefined && tweet.tags != '' ? tweet.tags.split(',') : [];
            var origin = tweet.origin != undefined ? tweet.origin : '';
            var tags_cell = '';
            for (var i in tags) {
                var tag = tags[i];
                tags_cell += '#' + tag + '<br/>';
            }
            var table = (tweet.gps != undefined) ? tableOfProcessedMessages : tableOfMessagesToProcess;
            table.prepend(
                '<tr class="filter-by-origin origin-all origin-' + origin + '"><td>'
                    + tags_cell
                    + '</td><td>'
                    + tweet.message
                    + '</td><td><a href="'
                    + link
                    + '" target="_blank">Ver mensaje original</a></td>'
                    + '<td><button data-action="edit" data-id="'
                    + id
                    + '">Editar</button> <button data-action="delete" data-id="'
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
            type: $('#edit-modal-volunteer').is(':checked') ? 'volunteer' : 'needHelp'
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
            type: $('#new-modal-volunteer').is(':checked') ? 'volunteer' : 'needHelp',
            url: $('#new-modal-url').val(),
            origin: 'manual'
        };
        if (lat != '' && lon != '') {
            tweet.gps = { lat: lat, lon: lon };
        }
        database.ref('tweets').push(tweet);
        $('#new-modal').modal('hide');
    });

    database.ref('queries').on('value', function(snapshot) {
        var queries = snapshot.val();
        for (var id in queries) {
            var query = queries[id];
            $('#filterByOrigin > div.dropdown-menu').append(
                '<a data-query="' + id + '" class="dropdown-item" href="#">' + query.query + '</a>'
            );
        }
        $('#filterByOrigin > div.dropdown-menu a.dropdown-item').on('click', function() {
            $('#filterByOrigin button').html('Origen: ' + $(this).html());
            $('.filter-by-origin').hide();
            $('.origin-' + $(this).data('query')).show();
        });
    });

});
