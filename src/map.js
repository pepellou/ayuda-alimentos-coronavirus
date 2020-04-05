const DEFAULT_TYPE = 'needHelp'

const icons = {
  needHelp: L.icon({
    iconUrl: "img/icons/icon_sos.svg",
    iconSize: [25, 25],
    shadowUrl: 'img/icons/icon_shadow.png',
    shadowSize: [100, 35],
    shadowAnchor: [53, 6],
    className: 'needHelp'

  }),
  volunteer: L.icon({
    iconUrl: "img/icons/icon_volunteer.svg",
    iconSize: [35, 35],
    shadowUrl: 'img/icons/icon_shadow.png',
    shadowSize: [100, 35],
    shadowAnchor: [50, 5],
    className: 'volunteer'

  })
};

var get_link = function(tweet) {
    return tweet.url != undefined ? tweet.url : 'https://twitter.com/' + tweet.nick + '/status/' + tweet.id;
};

var fill_map_with_all_tweets = function(map, tweets) {
    map.clearTweets();
    for (id in tweets) {
        map.addTweet(tweets[id]);
    }
};

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

function TweetsMap() {
    var self = this;

    self.init = function() {
        self._map = L.map('mapid', {
            minZoom: 3,
            maxZoom: 13
        }).setView([39.62,-4.25], 7);

        self._circles = L.featureGroup();

        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'pk.eyJ1IjoicGVwZWxsb3UiLCJhIjoiY2s3cXV4c3llMDdidzNmcGxybDNwczJmcCJ9.ygIiC_xyqMwtvghc_8qIhA'
        }).addTo(self._map);

        self._map.addLayer(self._circles);

        return self;
    };

    self.clearTweets = function() {
        self._map.removeLayer(self._circles);
        self._circles = L.featureGroup();
        self._map.addLayer(self._circles);
    };

    self.addTweet = function(tweet) {
        var link = get_link(tweet);
        var popupText = "<p>" + tweet.message + "</p><p><a target='_blank' href='" + link + "'>Ver mensaje original</a></p>";
        if (tweet.gps != undefined) {
            self.addMarker(
                [tweet.gps.lat, tweet.gps.lon],
                popupText,
                tweet.type
            );
        }
        if (tweet.gps2 != undefined) {
            self.addMarker(
                [tweet.gps2.lat, tweet.gps2.lon],
                popupText,
                tweet.type
            );
        }
    };

    self.addMarker = function(gps, text, type = DEFAULT_TYPE) {
      const icon = icons[type];

      var marker = L.marker(gps, { icon }).addTo(self._map);
      marker.bindPopup(text);
    };

    return self.init();
}


$(function() {
    init_firebase();

    var map = new TweetsMap();

    firebase.database().ref('tweets').on('value', function(snapshot) {
        fill_map_with_all_tweets(map, snapshot.val());
    });

});

$(function () {
    $('#filtro-oferta').on("click", function () {

        var checked =$('#filtro-oferta').data( "checked" );
    
        if ($('#filtro-oferta').is(':checked')) {

            $('#filtro-oferta').data( "checked", true );
            checked = true;
            $('#filtro-oferta').prop('checked', true);
            $(".volunteer").show();

        } else {
            $('#filtro-oferta').data( "checked", false );
            checked = false;
            $('#filtro-oferta').prop('checked', false);
            $(".volunteer").hide();

        }

    });
    $('#filtro-demanda').on("click", function () {
        var checked =$('#filtro-demanda').data( "checked");
    
        if ($('#filtro-demanda').is(':checked')) {

            $('#filtro-demanda').data( "checked", true );
            checked = true;
            $('#filtro-demanda').prop('checked', true);
            $(".needHelp").show();


        } else {
            $('#filtro-demanda').data( "checked", false );
            checked = false;
            $('#filtro-demanda').prop('checked', false);
            $(".needHelp").hide();

        }


    });
});

