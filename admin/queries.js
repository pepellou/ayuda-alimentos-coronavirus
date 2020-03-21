$(function() {
    firebase.initializeApp(firebaseConfig);

    var database = firebase.database();
    var tableOfQueries = $('table#queries tbody');

    var some_count_we_dont_have_yet = 0;

    database.ref('queries').on('value', function(snapshot) {
        var queries = snapshot.val();
        tableOfQueries.html('');
        for (id in queries) {
            var query = queries[id];
            tableOfQueries.prepend(
                '<tr><td>'
                    + query.query
                    + '</td><td>'
                    + (query.collect_old ? 'Sí' : 'No')
                    + '</td><td>'
                    + some_count_we_dont_have_yet
                    + '</td>'
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
    });

});
