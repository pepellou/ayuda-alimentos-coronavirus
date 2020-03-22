<?php

final class StringUtils {

    public static function extractHashtags(string $text, array $blacklist = []) : string
    {
        preg_match_all("/#(\\w+)/", $text, $matches);
        $locations = [];
        $hashtags = [];
        foreach ($matches[0] as $match) {
            if (!in_array($match, $hashtags)) {
                $hashtags []= $match;
                $onBlacklist = false;
                foreach ($blacklist as $elementToIgnore) {
                    if (!$onBlacklist && strcasecmp($match, "#" . $elementToIgnore) == 0) {
                        $onBlacklist = true;
                    }
                }
                if (!$onBlacklist) {
                    $locations []= substr($match, 1);
                }
            }
        }
        return implode(',', $locations);
    }

}
