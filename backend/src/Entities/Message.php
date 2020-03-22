<?php


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
        $theMessage->tags = StringUtils::extractHashtags($text, ['AyudaAlimentosCoronavirus']);
        $theMessage->url = "https://twitter.com/$nick/status/$tid";
        return $theMessage;
    }

}
