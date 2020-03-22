<?php
require_once __DIR__.'/vendor/autoload.php';

use SosVecinos\Database\Database;
use SosVecinos\Entities\Message;
use SosVecinos\Services\Twitter;

function show_db($db, $config) {
    foreach($db->getAll('tweets') as $some_id => $tweet) {
        $nick = $tweet['nick'];
        $status = $tweet['message'];

        preg_match_all("/#(\\w+)/", $status, $matches);
        $hashtags = [];
        foreach ($matches[0] as $match) {
            if (!in_array($match, $hashtags)) {
                $hashtags []= $match;
            }
        }

        $coloured_status = preg_replace(
            "/(#AyudaAlimentosCoronavirus)/i",
            "\033[01;31m".'${1}'."\033[0m",
            $status
        );
        foreach ($hashtags as $hashtag) {
            $coloured_status = preg_replace(
                "/(".$hashtag.")/i",
                "\033[01;31m".'${1}'."\033[0m",
                $coloured_status
            );
        }

        $tid = $tweet['id'];
        echo " \033[01;37m@${nick}\033[0m said: \033[01;32m\"${coloured_status}\033[0m\"\n     (\033[38;5;14m\033[4mhttps://twitter.com/${nick}/status/${tid}\033[0m)\n\n";
    }
}

function show_last_tweets($config) {
    $url = 'https://api.twitter.com/1.1/search/tweets.json';
    $getfield = '?q=%23ayudaalimentoscoronavirus&count=100&tweet_mode=extended';
    $requestMethod = 'GET';

    $twitter = new TwitterAPIExchange(array(
        'oauth_access_token' => $config['oauth']['access_token'],
        'oauth_access_token_secret' => $config['oauth']['access_token_secret'],
        'consumer_key' => $config['oauth']['consumer_key'],
        'consumer_secret' => $config['oauth']['consumer_secret']
    ));
    $results = json_decode($twitter->setGetfield($getfield)
        ->buildOauth($url, $requestMethod)
        ->performRequest());

    foreach($results->statuses as $tweet) {
        $nick = $tweet->user->screen_name;
        $status = $tweet->full_text;
        if (isInterestingTweet($status)) {
            $coloured_status = preg_replace(
                "/(AyudaAlimentosCoronavirus)/i",
                "\033[01;31m".'${1}'."\033[0m",
                $status
            );
            $tid = $tweet->id_str;
            echo " \033[01;37m@${nick}\033[0m said: \033[01;32m\"${coloured_status}\033[0m\"\n     (\033[38;5;14m\033[4mhttps://twitter.com/${nick}/status/${tid}\033[0m)\n\n";
        }
    }
}

function collect_from_query($db, $config, $query) {
    echo " Collecting tweets with query '" . $query['query'] . "'...\n";

    $collected_tweets = 0;

    $collected_tweets += get_tweets(
        $db,
        $config,
        $query,
        [ "since" => $query["last"] ]
    );

    $collect_old_tweets = ( !isset($query['collect_old']) || $query['collect_old'] );
    if ($collect_old_tweets) {
        $collected_tweets += get_tweets(
            $db,
            $config,
            $query,
            [ "until" => $query["first"] ]
        );
    }

    if ($collected_tweets == 0) {
        echo "\n   No new tweets collected\n";
    } else {
        echo "\n   Tweets collected: $collected_tweets\n";
    }
}

function collect_tweets($db, $config) {
    $queries = $db->getAll('queries');
    foreach ($queries as $key => $query) {
        $query['id'] = $key;
        collect_from_query($db, $config, $query);
    }
}

function add_tweet($db, $config, $tweet_url) {
    $tweet_id = get_id_from_tweet_url($tweet_url);

    $twitter = new Twitter($config);

    $tweet = json_decode($twitter->getOne($tweet_id));

    $db->addOne(
        'tweets',
        new Message(
            $tweet_id,
            $tweet->user->screen_name,
            $tweet->full_text
        )
    );

    echo "Tweet added\n";
}

function get_id_from_tweet_url($url) {
    $parts = explode('/', $url);
    return array_pop($parts);
}

function get_tags_from_text($text) {
    preg_match_all("/#(\\w+)/", $text, $matches);
    $hashtags = [];
    $locations = [];
    foreach ($matches[0] as $match) {
        if (!in_array($match, $hashtags)) {
            $hashtags []= $match;
            if (strcasecmp($match, "#AyudaAlimentosCoronavirus") != 0) {
                $locations []= substr($match, 1);
            }
        }
    }
    return $locations;
}

function get_tweets($db, $config, $query, $options) {
    $url = 'https://api.twitter.com/1.1/search/tweets.json';

    $getfield = '?q=' . $query['query']
        . '&count=100'
        . '&tweet_mode=extended';

    if (isset($options['since'])) {
        $getfield .= '&since_id=' . $options['since'];
    }

    if (isset($options['until'])) {
        $getfield .= '&max_id=' . $options['until'];
    }

    $requestMethod = 'GET';

    $twitter = new TwitterAPIExchange(array(
        'oauth_access_token' => $config['oauth']['access_token'],
        'oauth_access_token_secret' => $config['oauth']['access_token_secret'],
        'consumer_key' => $config['oauth']['consumer_key'],
        'consumer_secret' => $config['oauth']['consumer_secret']
    ));
    $results = json_decode($twitter->setGetfield($getfield)
        ->buildOauth($url, $requestMethod)
        ->performRequest());

    $tweets = $results->statuses;

    if (isset($options['until'])) {
        if ($tweets[0]->id_str == $options['until']) {
            array_shift($tweets);
        }
    }

    if (count($tweets) < 1) {
        return;
    }

    $stored = 0;

    foreach($tweets as $tweet) {
        $nick = $tweet->user->screen_name;
        $status = $tweet->full_text;

        if (isInterestingTweet($status)) {
            $coloured_status = preg_replace(
                "/(AyudaAlimentosCoronavirus)/i",
                "\033[01;31m".'${1}'."\033[0m",
                $status
            );
            $tid = $tweet->id_str;
            echo " \033[01;37m@${nick}\033[0m said: \033[01;32m\"${coloured_status}\033[0m\"\n     (\033[38;5;14m\033[4mhttps://twitter.com/${nick}/status/${tid}\033[0m)\n\n";
            $db->addOne('tweets', new Message($tid, $nick, $status));
            $stored++;
        }
    }

    if (isset($options['since'])) {
        $db->getOne("queries", $query['id'])
           ->getChild('last')
           ->set($tweets[0]->id_str);
    }

    if (isset($options['until'])) {
        $db->getOne("queries", $query['id'])
           ->getChild('first')
           ->set($tweets[count($tweets) - 1]->id_str);
    }

    return $stored;
}

function show_queries($db, $config) {
    foreach ($db->getAll('queries') as $key => $query) {
        echo " $key:\n";
        echo "     query:       '" . $query['query'] . "'\n";
        echo "     collect old? " . (isset($query['collect_old']) ? ($query['collect_old'] ? 'true' : 'false' ) : 'false' ) . "\n";
        echo "     first:       " . (isset($query['first']) ? $query['first'] : 'null' ) . "\n";
        echo "     last:        " . (isset($query['last'] ) ? $query['last']  : 'null' ). "\n";
    }
}

function isInterestingTweet($text) {
    return substr($text, 0, 4) != "RT @";
}

function show_commands($script) {
    echo "    php ".$script." db                 \033[01;33m  - shows database contents\033[0m\n";
    echo "    php ".$script." last               \033[01;33m  - shows last tweets\033[0m\n";
    echo "    php ".$script." collect            \033[01;33m  - collects tweets\033[0m\n";
    echo "    php ".$script." add <url>          \033[01;33m  - adds a single tweet\033[0m\n";
    echo "    php ".$script." queries            \033[01;33m  - shows the configured queries to collect tweets\033[0m\n";
}

if (isset($_GET) && count($_GET) > 0 && isset($_GET['params'])) {
    $argv = $_GET['params'];
    array_unshift($argv, __FILE__);
}

$script = $argv[0];
$config = require __DIR__ . '/config.php';
$db = new Database(__DIR__.'/firebase-credentials.json');

if (count($argv) <= 1) {
    echo "\033[01;31mMissing command, try one of the following:\033[0m\n";
    show_commands($script);
    exit;
}

$command = $argv[1];
switch($command) {
    case "db":
        show_db($db, $config);
        break;
    case "last":
        show_last_tweets($config);
        break;
    case "collect":
        collect_tweets($db, $config);
        break;
    case "add":
        if (count($argv) <= 2) {
            echo "\033[01;31mMissing parameter url\033[0m\n";
            exit;
        }
        add_tweet($db, $config, $argv[2]);
        break;
    case "queries":
        show_queries($db, $config);
        break;
    default:
        echo "\033[01;31mCommand '${command}' not known, try one of the following:\033[0m\n";
        show_commands($script);
        exit;
}
