<?php
namespace SosVecinos\Commands;

require_once __DIR__.'/../../vendor/autoload.php';

use SosVecinos\Database\Database;
use SosVecinos\Entities\Message;


class HelpCommand implements Command {

    private $database;

    public function __construct()
    {
        $this->database = Database::getInstance();
    }

    public function run(array $params = [])
    {
        $script = $params[0];
        echo "    php ".$script." db                 \033[01;33m  - shows database contents\033[0m\n";
        echo "    php ".$script." last               \033[01;33m  - shows last tweets\033[0m\n";
        echo "    php ".$script." collect            \033[01;33m  - collects tweets\033[0m\n";
        echo "    php ".$script." add <url>          \033[01;33m  - adds a single tweet\033[0m\n";
        echo "    php ".$script." queries            \033[01;33m  - shows the configured queries to collect tweets\033[0m\n";
    }

}
