<?php declare(strict_types=1);
use PHPUnit\Framework\TestCase;

require_once __DIR__.'/../../vendor/autoload.php';

use SosVecinos\Entities\Message;
use SosVecinos\Util\OutputPrinter;

final class MessageTest extends TestCase
{
    public function testToArray_returnsArrayOfFields(): void
    {
        $theMessage = new Message();
        $theMessage->id     = $this->anyString();
        $theMessage->nick   = $this->anyString();
        $theMessage->text   = $this->anyString();
        $theMessage->tags   = $this->anyString();
        $theMessage->url    = $this->anyString();
        $theMessage->origin = $this->anyString();

        $this->assertEquals(
            [
                'id'      => $theMessage->id,
                'nick'    => $theMessage->nick,
                'message' => $theMessage->text,
                'tags'    => $theMessage->tags,
                'url'     => $theMessage->url,
                'origin'  => $theMessage->origin
            ],
            $theMessage->toArray()
        );
    }

    public function testConstruct_canBuildFromTweet(): void
    {
        $theId   = $this->anyString();
        $theNick = $this->anyString();
        $theText = $this->anyStringWithTags([ 'sampleTag', 'anotherTag', 'AyudaAlimentosCoronavirus' ]);

        $message = Message::fromTweet($theId, $theNick, $theText);

        $this->assertEquals($theId,   $message->id);
        $this->assertEquals($theNick, $message->nick);
        $this->assertEquals($theText, $message->text);
        $this->assertEquals(
            'sampleTag,anotherTag',
            $message->tags
        );
        $this->assertEquals(
            "https://twitter.com/${theNick}/status/${theId}",
            $message->url
        );
    }

    public function testToString(): void
    {
        $theId   = $this->anyString();
        $theNick = $this->anyString();
        $theText = $this->anyStringWithTags([ 'sampleTag', 'anotherTag', 'AyudaAlimentosCoronavirus' ]);
        $theTags = 'sampleTag,anotherTag,AyudaAlimentosCoronavirus';
        $theUrl  = $this->anyString();

        $theMessage = new Message();
        $theMessage->id   = $this->anyString();
        $theMessage->nick = $this->anyString();
        $theMessage->text = $this->anyString();
        $theMessage->tags = $this->anyString();
        $theMessage->url  = $this->anyString();

        $this->assertEquals(
            ' ' . OutputPrinter::WHITE[0] . '@' . $theMessage->nick . OutputPrinter::WHITE[1]
            . ' said: "' . OutputPrinter::GREEN[0] . $theMessage->text . OutputPrinter::GREEN[1]
            . '"' . "\n     (" . OutputPrinter::UNDERLINE[0] . $theMessage->url . OutputPrinter::UNDERLINE[1] . ")\n\n"
            ,
            $theMessage->__toString()
        );
    }

    public function testIsRetweet() : void
    {
        $this->assertFalse( $this->createMessageWithText('a sample text')           ->isRetweet() );
        $this->assertFalse( $this->createMessageWithText('a RT sample text')        ->isRetweet() );
        $this->assertTrue ( $this->createMessageWithText('RT @user RT sample text') ->isRetweet() );
        $this->assertTrue ( $this->createMessageWithText('RT @u RT sample text')    ->isRetweet() );
        $this->assertFalse( $this->createMessageWithText('RT u @RT sample text')    ->isRetweet() );
        $this->assertFalse( $this->createMessageWithText('x RT @RT sample text')    ->isRetweet() );
    }

    private function anyString() {
        $someRandomStrings = [
            'any string would work',
            'this is just another string',
            '1231894729834572',
            'another one',
            'other'
        ];
        return $someRandomStrings[rand(0, count($someRandomStrings) - 1)];
    }

    private function anyStringWithTags(array $tags) {
        $toReturn = array_map(
            function($tag) { return "#${tag}"; },
            $tags
        );
        array_unshift($toReturn, $this->anyString());
        return implode(' ', $toReturn);
    }

    private function createMessageWithText($text) : Message
    {
        $message = new Message();
        $message->text = $text;
        return $message;
    }

}
