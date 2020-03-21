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
        $('button').on('click', function() {
            var button = $(this);
            var action = button.data('action');
            if (action == 'edit') {
                var id = button.data('id');
                database.ref('queries/' + id).on('value', function(snapshot) {
                    var query = snapshot.val();
                    $('#edit-modal-id').val(id);
                    $('#edit-modal-query').val(query.query);
                    $('#edit-modal-collect-old').prop('checked', query.collect_old);
                    $('#edit-modal').modal();
                });
            } else if (action == 'delete') {
                var id = button.data('id');
                if (confirm("Seguro de borrar?")) {
                    database.ref('queries/' + id).remove();
                }
            } else if (action == 'new') {
                $('#new-modal').modal();
            }
        });
    });

    $('#new-modal button.btn-primary').on('click', function() {
        var query = {
            query: $('#new-modal-query').val(),
            collect_old: $('#new-modal-collect-old').is(':checked')
        };
        database.ref('queries').push(query);
        $('#new-modal').modal('hide');
    });

    $('#edit-modal button.btn-primary').on('click', function() {
        var id = $('#edit-modal-id').val();
        var query = {
            query: $('#edit-modal-query').val(),
            collect_old: $('#edit-modal-collect-old').is(':checked')
        };
        database.ref('queries/' + id).set(query);
        $('#edit-modal').modal('hide');
    });

});
