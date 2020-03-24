<?php declare(strict_types=1);
use PHPUnit\Framework\TestCase;

require_once __DIR__.'/../../vendor/autoload.php';

use SosVecinos\Util\OutputPrinter;

final class OutputPrinterTest extends TestCase
{
    public function testPrintWords_printsListOfWordsWithTheGivenColor(): void
    {
        $theText = "a sample text with some words and with some of them repeated";
        $theListOfWords = [ 'with', 'some' ];
        $theColor = OutputPrinter::RED;

        $expectedOutput =
            "a sample text "
            . $theColor[0] . "with" . $theColor[1]
            . " "
            . $theColor[0] . "some" . $theColor[1]
            . " words and "
            . $theColor[0] . "with" . $theColor[1]
            . " "
            . $theColor[0] . "some" . $theColor[1]
            . " of them repeated";

        $this->assertEquals(
            $expectedOutput,
            OutputPrinter::printWords(
                $theText,
                $theListOfWords,
                $theColor
            )
        );
    }

    public function testPrint_printsListOfItems(): void
    {
        $this->assertEquals(
            'alistofwords',
            OutputPrinter::print([ 'a', 'list', 'of', 'words' ])
        );
    }

    public function testPrint_printsItemsWithColor(): void
    {
        $theColor = OutputPrinter::RED;

        $this->assertEquals(
            'a' . $theColor[0] . 'colored' . $theColor[1] .  'word',
            OutputPrinter::print([
                'a',
                [ $theColor, 'colored'],
                'word'
            ])
        );
    }

    public function testPrint_printsBreaklines(): void
    {
        $theColor = OutputPrinter::RED;

        $this->assertEquals(
            'a' . $theColor[0] . 'colored' . $theColor[1] .  'word' . "\n",
            OutputPrinter::print([
                'a',
                [ $theColor, 'colored'],
                'word',
                OutputPrinter::BREAKLINE
            ])
        );
    }

}
