<?php
namespace SosVecinos\Commands;

require_once __DIR__.'/../../vendor/autoload.php';


final class CommandLoader {

    private static $commands = [];

    public static function get(string $keyword) : Command
    {
        if (!array_key_exists($keyword, self::$commands)) {
            throw new \Exception('Command not found');
        }
        return self::$commands[$keyword];
    }

    public static function registerCommands()
    {
        self::$commands [ 'db'      ]= new ShowDbCommand();
        self::$commands [ 'add'     ]= new AddTweetCommand();
        self::$commands [ 'collect' ]= new CollectTweetsCommand();
        self::$commands [ 'help'    ]= new HelpCommand();
        self::$commands [ 'last'    ]= new LastTweetsCommand();
        self::$commands [ 'queries' ]= new ShowQueriesCommand();
    }

}

CommandLoader::registerCommands();
