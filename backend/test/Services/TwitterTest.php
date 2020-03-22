<?php declare(strict_types=1);
use PHPUnit\Framework\TestCase;

require_once __DIR__.'/../../vendor/autoload.php';

use SosVecinos\Services\Twitter;


final class TestableTwitter extends Twitter {

    public function __construct() {
        parent::__construct('credentials-of-the-twitter-api-but-not-important-since-its-mocked');
    }

    public function setApi($api) {
        $this->api = $api;
    }

}

final class TwitterTest extends TestCase
{

    public function testGetOne_returnsSingleTweet(): void
    {
        $theId = 'any-id';
        $aSampleJson = '{"foo":"bar"}';
        $expectedQuery =
            "?id=${theId}&include_my_retweet=false&include_ext_alt_text=false&include_card_uri=false&tweet_mode=extended";

        $this->theApi
             ->expects($this->once())
             ->method('setGetfield')
             ->with($this->identicalTo($expectedQuery))
             ->willReturn($this->theApi);

        $this->theApi
             ->expects($this->once())
             ->method('buildOauth')
             ->with(
                 $this->identicalTo('https://api.twitter.com/1.1/statuses/show.json'),
                 $this->identicalTo('GET')
             )
             ->willReturn($this->theApi);

        $this->theApi
             ->expects($this->once())
             ->method('performRequest')
             ->willReturn($aSampleJson);

        $this->assertEquals(
            $aSampleJson,
            $this->theTwitter->getOne($theId)
        );
    }

    public function setUp() : void
    {
        $this->theTwitter = new TestableTwitter();

        $this->theApi = $this->createMock(TwitterAPIExchange::class);

        $this->theTwitter->setApi($this->theApi);
    }

}
