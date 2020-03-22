<?php declare(strict_types=1);
use PHPUnit\Framework\TestCase;

require __DIR__.'/../../src/Database/Database.php';

use Kreait\Firebase;
use Kreait\Firebase\Database as FirebaseDB;
use Kreait\Firebase\Database\Reference;

final class TestableDatabase extends Database {

    public function __construct() {
        parent::__construct('any/path/really/because/this/is/a/mock.json');
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

    public function testGetOneReturnsReferenceToSpecificNode(): void
    {
        $aReference = 'anyValue';
        $anId = 'anyString';

        $this->expectFirebaseToAccessTheReference($aReference . '/' . $anId);

        $this->assertEquals(
            $this->theDatabase->getOne($aReference, $anId),
            $this->theReference
        );
    }

    public function testGetAllTweetsReturnsAllTweetsFromFirebase() : void
    {
        $aReference = 'anyValue';
        $expectedResult = "it's really an array, but any value works for the test";

        $this->expectFirebaseToAccessTheReference($aReference);

        $this->theReference
             ->expects($this->once())
             ->method('getValue')
             ->willReturn($expectedResult);

        $this->assertEquals(
            $this->theDatabase->getAll($aReference),
            $expectedResult
        );
    }

    private $theFirebase;
    private $theFirebaseDb;
    private $theDatabase;

    public function setUp() : void
    {
        $this->theDatabase = new TestableDatabase();

        $this->theFirebase = $this->createMock(Firebase::class);
        $this->theFirebaseDb = $this->createMock(FirebaseDB::class);
        $this->theReference = $this->createMock(Reference::class);

        $this->theDatabase->setFirebase($this->theFirebase);
    }

    private function expectFirebaseToAccessTheReference($reference)
    {
        $this->theFirebase
             ->expects($this->once())
             ->method('getDatabase')
             ->willReturn($this->theFirebaseDb);

        $this->theFirebaseDb
             ->expects($this->once())
             ->method('getReference')
             ->with($this->identicalTo($reference))
             ->willReturn($this->theReference);
    }

}



