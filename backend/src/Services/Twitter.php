<?php

namespace SosVecinos\Services;

require_once __DIR__.'/../../vendor/autoload.php';

use \TwitterAPIExchange;


class Twitter {

    protected $api = null;
    private $credentials;

    public function __construct($credentials) {
        $this->credentials = $credentials;
    }

    public function getOne($id)
    {
        $url = 'https://api.twitter.com/1.1/statuses/show.json';
        $requestMethod = 'GET';
        $getfield = '?id=' . $id
            .'&include_my_retweet=false'
            .'&include_ext_alt_text=false'
            .'&include_card_uri=false'
            .'&tweet_mode=extended'
        ;
        return $this->getApi()
            ->setGetfield($getfield)
            ->buildOauth($url, $requestMethod)
            ->performRequest();
    }

    private function getApi() {
        if (is_null($this->api)) {
            $this->api = $this->createApi();
        }
        return $this->api;
    }

    private function createApi() {
        return new TwitterAPIExchange([
            'oauth_access_token'        => $this->credentials['oauth']['access_token'],
            'oauth_access_token_secret' => $this->credentials['oauth']['access_token_secret'],
            'consumer_key'              => $this->credentials['oauth']['consumer_key'],
            'consumer_secret'           => $this->credentials['oauth']['consumer_secret']
        ]);
    }

}
