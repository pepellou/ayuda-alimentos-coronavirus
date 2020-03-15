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

$(function() {
    init_firebase();

    var database = firebase.database();

    database.ref('tweets').on('value', function(snapshot) {
        var tweets = snapshot.val();
        $('table#tweets tbody').html('');
        for (id in tweets) {
            var tweet = tweets[id];
            var link = 'https://twitter.com/' + tweet.nick + '/status/' + tweet.id;
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
                    + '<td><button data-action="edit-tags" data-id="'
                    + id
                    + '" data-tags="'
                    + tweet.tags
                    + '">Editar tags</button> '
                    + '</td></tr>'
            );
        }
        $('button').on('click', function() {
            var button = $(this);
            var action = button.data('action');
            if (action == 'edit-tags') {
                //var id = button.data('id');
                //database.ref('tweets/' + id).remove();
            }
        });
    });
});
