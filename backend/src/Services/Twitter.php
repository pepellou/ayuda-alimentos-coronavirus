<?php

namespace SosVecinos\Services;

require_once __DIR__.'/../../vendor/autoload.php';

use \TwitterAPIExchange;


class Twitter {

    protected $api = null;

    public static $ENDPOINT_SINGLE_TWEET = 'https://api.twitter.com/1.1/statuses/show.json';
    public static $ENDPOINT_TWEETS       = 'https://api.twitter.com/1.1/search/tweets.json';

    public function __construct() {
    }

    public function getOne($id)
    {
        $url = 'https://api.twitter.com/1.1/statuses/show.json';
        $getfield = '?id=' . $id
            .'&include_my_retweet=false'
            .'&include_ext_alt_text=false'
            .'&include_card_uri=false'
            .'&tweet_mode=extended'
        ;
        return $this->getApi()
            ->setGetfield($getfield)
            ->buildOauth(self::$ENDPOINT_SINGLE_TWEET, 'GET')
            ->performRequest();
    }

    public function get($query, $filters = [])
    {
        if (isset($filters['from'])) {
            $query .= '&since_id=' . $filters['from'];
        }
        if (isset($filters['up-to'])) {
            $query .= '&max_id=' . $filters['up-to'];
        }
        $query .= '&result_type=recent&count=100&tweet_mode=extended';
        return $this->getApi()
            ->setGetfield('?q=' . $query )
            ->buildOauth(self::$ENDPOINT_TWEETS, 'GET')
            ->performRequest();
    }

    private function getApi() {
        if (is_null($this->api)) {
            $this->api = $this->createApi();
        }
        return $this->api;
    }

    private function createApi() {
        $config = require __DIR__ . '/../../config.php';
        return new TwitterAPIExchange([
            'oauth_access_token'        => $config['twitter']['oauth']['access_token'],
            'oauth_access_token_secret' => $config['twitter']['oauth']['access_token_secret'],
            'consumer_key'              => $config['twitter']['oauth']['consumer_key'],
            'consumer_secret'           => $config['twitter']['oauth']['consumer_secret']
        ]);
    }

}
