<?php

namespace SosVecinos\Database;

require_once __DIR__.'/../../vendor/autoload.php';

use SosVecinos\Entities\Message;

use Kreait\Firebase\Factory;
use Kreait\Firebase\ServiceAccount;

class Database {

    protected $firebase = null;
    private $credentials;

    protected static $_instance = null;

    public static function getInstance()
    {
        if (is_null(self::$_instance)) {
            self::$_instance = new Database(__DIR__.'/../../firebase-credentials.json');
        }
        return self::$_instance;
    }

    public function __construct($credentials) {
        $this->credentials = $credentials;
    }

    public function get() {
        if (is_null($this->firebase)) {
            $this->firebase = $this->createFirebase();
        }
        return $this->firebase->getDatabase();
    }

    public function getAll($reference) {
        return $this->get()->getReference($reference)->getValue();
    }

    public function getOne($reference, $id) {
        return $this->get()->getReference("${reference}/${id}");
    }

    public function addOne($reference, Message $element) {
        return $this->get()->getReference($reference)->push($element->toArray());
    }

    private function createFirebase()
    {
        return (new Factory)
            ->withServiceAccount(ServiceAccount::fromJsonFile($this->credentials))
            ->withDatabaseUri('https://ayuda-alimentos-coronavirus.firebaseio.com')
            ->create();
    }

}
