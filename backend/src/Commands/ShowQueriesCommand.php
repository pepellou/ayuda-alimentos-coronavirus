<?php
namespace SosVecinos\Commands;

require_once __DIR__.'/../../vendor/autoload.php';

use SosVecinos\Database\Database;
use SosVecinos\Entities\Message;


class ShowQueriesCommand implements Command {

    private $database;

    public function __construct()
    {
        $this->database = Database::getInstance();
    }

    public function run(array $params = [])
    {
        foreach ($this->database->getAll('queries') as $key => $query) {
            echo " $key:\n";
            echo "     query:       '" . $query['query'] . "'\n";
            echo "     collect old? " . (isset($query['collect_old']) ? ($query['collect_old'] ? 'true' : 'false' ) : 'false' ) . "\n";
            echo "     first:       " . (isset($query['first']) ? $query['first'] : 'null' ) . "\n";
            echo "     last:        " . (isset($query['last'] ) ? $query['last']  : 'null' ). "\n";
        }
    }

}
