<?php
namespace SosVecinos\Commands;

require_once __DIR__.'/../../vendor/autoload.php';

use SosVecinos\Database\Database;
use SosVecinos\Entities\Message;
use SosVecinos\Services\Twitter;


class AddTweetCommand implements Command {

    private $database;
    private $twitter;

    public function __construct()
    {
        $this->database = Database::getInstance();
        $this->twitter  = new Twitter();
    }

    public function run(array $params = [])
    {
        if (count($params) <= 2) {
            throw new \Exception("\033[01;31mMissing parameter url\033[0m\n");
        }

        $tweet_url = $params[2];

        $tweet_id = $this->get_id_from_tweet_url($tweet_url);

        $tweet = json_decode($this->twitter->getOne($tweet_id));

        $this->database->addOne(
            'tweets',
            Message::fromTweet(
                $tweet_id,
                $tweet->user->screen_name,
                $tweet->full_text
            )
        );

        echo "Tweet added\n";
    }

    private function get_id_from_tweet_url($url)
    {
        $parts = explode('/', $url);
        return array_pop($parts);
    }

}
