<?php

namespace SosVecinos\Util;

require_once __DIR__.'/../../vendor/autoload.php';


final class OutputPrinter {

    public const RED       = [ "\033[01;31m", "\033[0m" ];
    public const WHITE     = [ "\033[01;37m", "\033[0m" ];
    public const GREEN     = [ "\033[01;32m", "\033[0m" ];
    public const UNDERLINE = [ "\033[38;5;14m\033[4m", "\033[0m" ];
    public const BREAKLINE = "\n";

    public static function printWords(string $text, array $words, array $color) : string
    {
        foreach ($words as $word) {
            $text = preg_replace(
                "/(" . $word . ")/i",
                $color[0] .'${1}' . $color[1],
                $text
            );
        }
        return $text;
    }

    public static function print($items) {
        $output = '';
        foreach($items as $item) {
            if (is_array($item)) {
                $color = $item[0];
                $text = $item[1];
                $output .= $color[0] . $text . $color[1];
            } else {
                $output .= $item;
            }
        }
        return $output;
    }

}
