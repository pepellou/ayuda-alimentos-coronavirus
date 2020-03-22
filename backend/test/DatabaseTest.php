<?php declare(strict_types=1);
use PHPUnit\Framework\TestCase;

require __DIR__.'/../src/Database.php';

use Kreait\Firebase;

final class TestableDatabase extends Database {

    public function __construct() {
        parent::__construct(__DIR__.'/../firebase-credentials.json');
    }

    public function setFirebase($firebase) {
        $this->firebase = $firebase;
    }


}

final class DatabaseTest extends TestCase
{
    public function testGetReturnsFirebaseDatabase(): void
    {
        $this->theFirebase
             ->expects($this->once())
             ->method('getDatabase');

        $this->theDatabase->get();
    }

    private $theFirebase;

    public function setUp() : void {
        $this->theDatabase = new TestableDatabase();
        $this->theFirebase = $this->createMock(Firebase::class);
        $this->theDatabase->setFirebase($this->theFirebase);
    }

}



