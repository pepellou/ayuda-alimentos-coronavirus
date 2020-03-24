var get_link = function(tweet) {
    return tweet.url != undefined ? tweet.url : 'https://twitter.com/' + tweet.nick + '/status/' + tweet.id;
};

var fill_table_with_all_tweets = function(tweets) {
    $('#tweets').html('');
    for (id in tweets) {
        var tweet = tweets[id];
        if (no_gps_info(tweet)) { continue; }

        var link = get_link(tweet);
        var tags = tweet.tags != undefined && tweet.tags != '' ? tweet.tags.split(',') : [];
        var tags_filter_class = 'filter-by-tag-' + id;
        var tags_cell = '';
        for (var i in tags) {
            var tag = tags[i];
            tags_cell += '<a href="#" class="' + tags_filter_class + '" data-tag="' + tag + '">#' + tag + '</a><br/>';
        }
        $('#tweets').prepend(
            '<tr> <th scope="row">'
                + tags_cell
                + '</th> <td>'
                + tweet.message
                + '<br><br> <a target="_blank" href="'
                + link
                + '"> Ver mensaje original </a> </td> </tr>'
        );
        $('a.' + tags_filter_class).on("click", function(e) {
            e.preventDefault();
            var value = $(this).data('tag');
            $('#filterTags').val(value);
            filter_table_by_tag(value);
        });
    }
};

var no_gps_info = function(tweet) {
  return tweet.gps == undefined && tweet.gps2 == undefined;
};

var filter_table_by_tag = function(tag) {
    $("#tweetsTable tr").filter(function() {
        $(this).toggle($(this).find('th').text().toLowerCase().indexOf(tag.toLowerCase()) > -1)
    });
};

var init_table_filter = function() {
    $("#filterTags").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        filter_table_by_tag(value);
    });
};


$(function() {
    firebase.initializeApp(firebaseConfig);

    firebase.database().ref('tweets').on('value', function(snapshot) {
        fill_table_with_all_tweets(snapshot.val());
    });

    init_table_filter();
});

