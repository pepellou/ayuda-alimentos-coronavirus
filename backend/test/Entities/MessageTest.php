<?php declare(strict_types=1);
use PHPUnit\Framework\TestCase;

require_once __DIR__.'/../../src/Entities/Message.php';


final class MessageTest extends TestCase
{
    public function testToArray_returnsArrayOfFields(): void
    {
        $theMessage = new Message();
        $theMessage->id   = $this->anyString();
        $theMessage->nick = $this->anyString();
        $theMessage->text = $this->anyString();
        $theMessage->tags = $this->anyString();
        $theMessage->url  = $this->anyString();

        $this->assertEquals(
            [
                'id'      => $theMessage->id,
                'nick'    => $theMessage->nick,
                'message' => $theMessage->text,
                'tags'    => $theMessage->tags,
                'url'     => $theMessage->url
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

}
