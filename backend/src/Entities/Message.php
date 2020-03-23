<?php

namespace SosVecinos\Entities;

require_once __DIR__.'/../../vendor/autoload.php';

use SosVecinos\Util\StringUtils;

class Message {

    public $id;
    public $nick;
    public $text;
    public $tags;
    public $url;

    public function __construct() {
    }

    public function toArray() {
        return [
            'id'      => $this->id,
            'nick'    => $this->nick,
            'message' => $this->text,
            'tags'    => $this->tags,
            'url'     => $this->url
        ];
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
