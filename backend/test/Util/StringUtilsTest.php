<?php declare(strict_types=1);
use PHPUnit\Framework\TestCase;

require_once __DIR__.'/../../vendor/autoload.php';

use SosVecinos\Util\StringUtils;

final class StringUtilsTest extends TestCase
{
    public function testExtractHashtags_returnsCommaListOfTags(): void
    {
        $this->assertEquals(
            [ 'text', 'couple' ],
            StringUtils::extractHashtags('a sample #text with a #couple of hashtags')
        );
    }

    public function testExtractHashtags_returnsNoDuplicates(): void
    {
        $this->assertEquals(
            [ 'text', 'couple' ],
            StringUtils::extractHashtags('a sample #text with a #couple of hashtags plus a repeated #text one')
        );
    }

    public function testExtractHashtags_returnsNoneInBlacklistIgnoringCase(): void
    {
        $blacklist = [ 'WITH', 'Hashtags' ];

        $this->assertEquals(
            [ 'text', 'with', 'couple', 'hashtags' ],
            StringUtils::extractHashtags(
                'a sample #text #with a #couple of #hashtags plus a repeated #text one'
            )
        );

        $this->assertEquals(
            [ 'text', 'couple' ],
            StringUtils::extractHashtags(
                'a sample #text #with a #couple of #hashtags plus a repeated #text one',
                $blacklist
            )
        );
    }

}
