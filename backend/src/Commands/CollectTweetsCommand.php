<?php
namespace SosVecinos\Commands;

require_once __DIR__.'/../../vendor/autoload.php';

use SosVecinos\Database\Database;
use SosVecinos\Entities\Message;
use SosVecinos\Services\Twitter;


class CollectTweetsCommand implements Command {

    private $database;
    private $twitter;

    public function __construct()
    {
        $this->database = Database::getInstance();
        $this->twitter  = new Twitter();
    }

    public function run(array $params = [])
    {
        foreach ($this->database->getAll('queries') as $key => $query) {
            $query['id'] = $key;
            $this->collect_from_query($query);
        }
    }

    private function collect_from_query($query)
    {
        echo " Collecting tweets with query '" . $query['query'] . "'...\n";

        $collected_tweets = 0;

        $collected_tweets += $this->get_tweets(
            $query,
            [ "from" => $query["last"] ]
        );

        $collect_old_tweets = ( !isset($query['collect_old']) || $query['collect_old'] );
        if ($collect_old_tweets) {
            $collected_tweets += $this->get_tweets(
                $query,
                [ "up-to" => $query["first"] ]
            );
        }

        if ($collected_tweets == 0) {
            echo "\n   No new tweets collected\n";
        } else {
            echo "\n   Tweets collected: $collected_tweets\n";
        }
    }

    private function get_tweets($query, $filters) {
        $results = json_decode(
            $this->twitter->get($query['query'], $filters)
        );

        $tweets = $results->statuses;

        if (isset($filters['up-to'])) {
            if ($tweets[0]->id_str == $filters['up-to']) {
                array_shift($tweets);
            }
        }

        if (count($tweets) < 1) {
            return 0;
        }

        $stored = 0;

        foreach($tweets as $tweet) {
            $message = new Message(
                $tweet->id_str,
                $tweet->user->screen_name,
                $tweet->full_text
            );

            if (!$message->isRetweet()) {
                echo $message->__toString();
                $db->addOne('tweets', $message);
                $stored++;
            }
        }

        if (isset($filters['from'])) {
            $db->getOne("queries", $query['id'])
               ->getChild('last')
               ->set($tweets[0]->id_str);
        }

        if (isset($filters['up-to'])) {
            $db->getOne("queries", $query['id'])
               ->getChild('first')
               ->set($tweets[count($tweets) - 1]->id_str);
        }

        return $stored;
    }

}
