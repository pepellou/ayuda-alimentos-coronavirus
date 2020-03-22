<?php
require __DIR__.'/../vendor/autoload.php';

use Kreait\Firebase\Factory;
use Kreait\Firebase\ServiceAccount;

class Database {

    protected $firebase;

    public function __construct($credentials) {
        $this->firebase = (new Factory)
            ->withServiceAccount(ServiceAccount::fromJsonFile($credentials))
            ->withDatabaseUri('https://ayuda-alimentos-coronavirus.firebaseio.com')
            ->create();
    }

    public function get() {
        return $this->firebase->getDatabase();
    }

    public function getAll($reference) {
        return $this->get()->getReference($reference)->getValue();
    }

}