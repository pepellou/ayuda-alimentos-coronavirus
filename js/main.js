$(function() {
    console.log('a');

  // Your web app's Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyCNCfCoMnJMx7ncX6An3zCQc4TWsK60300",
        authDomain: "ayuda-alimentos-coronavirus.firebaseapp.com",
        databaseURL: "https://ayuda-alimentos-coronavirus.firebaseio.com",
        projectId: "ayuda-alimentos-coronavirus",
        storageBucket: "ayuda-alimentos-coronavirus.appspot.com",
        messagingSenderId: "622677547690",
        appId: "1:622677547690:web:0a04757a7c6ab63dacced3"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    console.log('merda');

    var database = firebase.database();
    console.log(database);

    database.ref('tweets').on('value', function(snapshot) {
    console.log('fork yeah');
        var tweets = snapshot.val();
        var count = 0;
        for (id in tweets) {
            count++;
        }
        /*
        $('span#count').text(count);
        $('#graves').html('');
        */
        for (id in tweets) {
            var tweet = tweets[id];
            var link = 'https://twitter.com/' + tweet.nick + '/status/' + tweet.id;
            var nick = tweet.nick;
            var text = tweet.message;
        /*
            $('#graves').prepend(
                '<a class="grave" target="_blank" href="https://twitter.com/' + tweet.nick + '/status/' + tweet.id + '">' +
                    '<div class="nickname">@' + tweet.nick + '</div>' +
                '</a>'
            );
        */
            console.log('[@' + nick + '] ' + text);
            console.log('    ' + link);
            console.log('');
        }
    });
});

