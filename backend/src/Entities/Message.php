<?php

namespace SosVecinos\Entities;

require_once __DIR__.'/../../vendor/autoload.php';

use SosVecinos\Util\StringUtils;
use SosVecinos\Util\OutputPrinter;

class Message {

    public $id;
    public $nick;
    public $text;
    public $tags;
    public $url;
    public $origin;

    public function __construct() {
    }

    public function isRetweet() : bool
    {
        return substr($this->text, 0, 4) == "RT @";
    }

    public function toArray() : array
    {
        return [
            'id'      => $this->id,
            'nick'    => $this->nick,
            'message' => $this->text,
            'tags'    => $this->tags,
            'url'     => $this->url,
            'origin'  => $this->origin
        ];
    }

    public function __toString() : string
    {
        $hashtags = StringUtils::extractHashtags($this->text);
        $hashtags []= '#';

        return OutputPrinter::print([
            ' ',
            [ OutputPrinter::WHITE, '@' . $this->nick ],
            ' said: "',
            [
                OutputPrinter::GREEN,
                OutputPrinter::printWords($this->text, $hashtags, OutputPrinter::RED)
            ],
            '"',
            OutputPrinter::BREAKLINE,
            '     (', [ OutputPrinter::UNDERLINE, $this->url ], ')',
            OutputPrinter::BREAKLINE,
            OutputPrinter::BREAKLINE
        ]);
    }

    public static function fromTweet($tid, $nick, $text) : Message
    {
        $theMessage = new Message();
        $theMessage->id = $tid;
        $theMessage->nick = $nick;
        $theMessage->text = $text;
        // TODO maybe store the array and only implode when converting tweet to array ??
        $theMessage->tags = implode(',', StringUtils::extractHashtags($text, ['AyudaAlimentosCoronavirus']));
        $theMessage->url = "https://twitter.com/$nick/status/$tid";
        return $theMessage;
    }

}
