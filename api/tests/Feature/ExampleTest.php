<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * A basic test example.
     *
     * @return void
     */
    public function test_()
    {
        $messages = factory(Message::class, 3)->create();

        $response = $this->getJson('/api/message');

        $response
            ->assertStatus(200)
            ->assertJsonPath('team.owner.name', 'foo');
    }
}
