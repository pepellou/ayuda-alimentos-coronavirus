<?php
namespace SosVecinos\Commands;

require_once __DIR__.'/../../vendor/autoload.php';


interface Command {

    public function run(array $params);

}
