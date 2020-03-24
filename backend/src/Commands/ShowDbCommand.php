<?php
namespace SosVecinos\Commands;

require_once __DIR__.'/../../vendor/autoload.php';

use SosVecinos\Database\Database;
use SosVecinos\Entities\Message;


class ShowDbCommand implements Command {

    private $database;

    public function __construct()
    {
        $this->database = Database::getInstance();
    }

    public function run(array $params = [])
    {
        foreach($this->database->getAll('tweets') as $some_id => $tweet) {
            $message = Message::fromTweet($tweet['id'], $tweet['nick'], $tweet['message']);
            echo $message->__toString();
        }
    }

}
