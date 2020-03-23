<?php declare(strict_types=1);
use PHPUnit\Framework\TestCase;

require_once __DIR__.'/../../vendor/autoload.php';

use SosVecinos\Services\Twitter;


final class TestableTwitter extends Twitter {

    public function __construct() {
        parent::__construct();
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
                 $this->identicalTo(Twitter::$ENDPOINT_SINGLE_TWEET),
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

    public function testGet_returnsListOfTweets(): void
    {
        $aSampleJson = '{"foo":"bar"}';
        $theQuery = 'a-sample-query';
        $expectedQuery =
            "?q=${theQuery}&count=100&tweet_mode=extended";

        $this->expectTheApiToHaveBeenCalledWith([
            'query' => "?q=${theQuery}&count=100&tweet_mode=extended",
            'endpoint' => Twitter::$ENDPOINT_TWEETS
        ])->andReturn($aSampleJson);

        $this->assertEquals(
            $aSampleJson,
            $this->theTwitter->get($theQuery)
        );
    }

    public function testGet_canFilterByFrom(): void
    {
        $aSampleJson = '{"foo":"bar"}';
        $theQuery = 'a-sample-query';
        $theFirstTweetId = 'a-tweet-id';

        $this->expectTheApiToHaveBeenCalledWith([
            'query' => "?q=${theQuery}&since_id=${theFirstTweetId}&count=100&tweet_mode=extended",
            'endpoint' => Twitter::$ENDPOINT_TWEETS
        ])->andReturn($aSampleJson);

        $this->assertEquals(
            $aSampleJson,
            $this->theTwitter->get(
                $theQuery,
                [ 'from' => $theFirstTweetId ]
            )
        );
    }

    public function testGet_canFilterByUpTo(): void
    {
        $aSampleJson = '{"foo":"bar"}';
        $theQuery = 'a-sample-query';
        $theLastTweetId = 'a-tweet-id';

        $this->expectTheApiToHaveBeenCalledWith([
            'query' => "?q=${theQuery}&max_id=${theLastTweetId}&count=100&tweet_mode=extended",
            'endpoint' => Twitter::$ENDPOINT_TWEETS
        ])->andReturn($aSampleJson);

        $this->assertEquals(
            $aSampleJson,
            $this->theTwitter->get(
                $theQuery,
                [ 'up-to' => $theLastTweetId ]
            )
        );
    }

    public function testGet_canFilterByBothFromAndUpTo(): void
    {
        $aSampleJson = '{"foo":"bar"}';
        $theQuery = 'a-sample-query';
        $theFirstTweetId = 'a-tweet-id';
        $theLastTweetId = 'another-tweet-id';

        $this->expectTheApiToHaveBeenCalledWith([
            'query' => "?q=${theQuery}&since_id=${theFirstTweetId}&max_id=${theLastTweetId}&count=100&tweet_mode=extended",
            'endpoint' => Twitter::$ENDPOINT_TWEETS
        ])->andReturn($aSampleJson);

        $this->assertEquals(
            $aSampleJson,
            $this->theTwitter->get(
                $theQuery,
                [ 'from' => $theFirstTweetId, 'up-to' => $theLastTweetId ]
            )
        );
    }

    public function setUp() : void
    {
        $this->theTwitter = new TestableTwitter();

        $this->theApi = $this->createMock(TwitterAPIExchange::class);

        $this->theTwitter->setApi($this->theApi);
    }

    private function expectTheApiToHaveBeenCalledWith($expectations)
    {
        $this->theApi
             ->expects($this->once())
             ->method('setGetfield')
             ->with($this->identicalTo($expectations['query']))
             ->willReturn($this->theApi);

        $this->theApi
             ->expects($this->once())
             ->method('buildOauth')
             ->with(
                 $this->identicalTo($expectations['endpoint']),
                 $this->identicalTo('GET')
             )
             ->willReturn($this->theApi);

        return $this;
    }

    private function andReturn($toReturn)
    {
        $this->theApi
             ->expects($this->once())
             ->method('performRequest')
             ->willReturn($toReturn);
    }

}
