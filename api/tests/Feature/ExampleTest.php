<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

use App\Message;

class ExampleTest extends TestCase
{
    use RefreshDatabase;

    /**
     * A basic test example.
     *
     * @return void
     */
    public function test_ApiMessage_shouldReturnAllMessages()
    {
        $messages = factory(Message::class, 3)->create();

        $response = $this->getJson('/api/message');

        $results = $response['results'];

        $response
            ->assertStatus(200)
            ->assertJsonPath('stats.count', 3);

        $this->assertEquals($results[0]['message'], $messages[0]->message);
        $this->assertEquals($results[0]['nick'], $messages[0]->nick);
        $this->assertEquals($results[0]['url'], $messages[0]->url);
        $this->assertEquals($results[0]['gps_lat'], $messages[0]->gps_lat);
        $this->assertEquals($results[0]['gps_lon'], $messages[0]->gps_lon);
        $this->assertEquals($results[0]['type'], $messages[0]->type);
    }
}
