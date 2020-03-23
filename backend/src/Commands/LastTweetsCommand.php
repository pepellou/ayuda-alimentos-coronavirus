<?php
namespace SosVecinos\Commands;

require_once __DIR__.'/../../vendor/autoload.php';

use SosVecinos\Database\Database;
use SosVecinos\Entities\Message;
use SosVecinos\Services\Twitter;


class LastTweetsCommand implements Command {

    private $database;

    public function __construct()
    {
        $this->database = Database::getInstance();
        $this->twitter = new Twitter();
    }

    public function run(array $params = [])
    {
        $results = json_decode( $this->twitter->get("%23ayudaalimentoscoronavirus") );

        foreach($results->statuses as $tweet) {
            $message = Message::fromTweet(
                $tweet->id_str,
                $tweet->user->screen_name,
                $tweet->full_text
            );
            if (!$message->isRetweet()) {
                echo $message->__toString();
            }
        }
    }

}
