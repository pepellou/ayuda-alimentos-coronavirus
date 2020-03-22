<?php
require __DIR__.'/../vendor/autoload.php';

use Kreait\Firebase\Factory;
use Kreait\Firebase\ServiceAccount;

class Database {

    public static function get_db() {
        $serviceAccount = ServiceAccount::fromJsonFile(__DIR__.'/../firebase-credentials.json');

        $firebase = (new Factory)
            ->withServiceAccount($serviceAccount)
            ->withDatabaseUri('https://ayuda-alimentos-coronavirus.firebaseio.com')
            ->create();

        return $firebase->getDatabase();
    }

}
