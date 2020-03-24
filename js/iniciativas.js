$(function() {

    firebase.initializeApp(firebaseConfig);

    var database = firebase.database();
    database.ref('queries').on('value', function(snapshot) {
        var queries = snapshot.val();
        for (var id in queries) {
            var query = queries[id];
            $('#origins tbody').append(
                '<tr> <td>Twitter</td> <td>' + query.query + '</td> <td>-</td> </tr>'
            );
        }
    });

});
