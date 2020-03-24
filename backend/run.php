<?php
require_once __DIR__.'/vendor/autoload.php';

use SosVecinos\Commands\CommandLoader;

$command = (count($argv) < 2)  ? 'help' : $argv[1];
CommandLoader::get($command)->run($argv);
