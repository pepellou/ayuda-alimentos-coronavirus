<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Message;
use Faker\Generator as Faker;

$factory->define(Message::class, function (Faker $faker) {
    return [
        'message' => $faker->sentence(),
        'nick' => $faker->name,
        'url' => $faker->url,
        'gps_lat' => $faker->latitude(),
        'gps_lon' => $faker->longitude(),
        'type' => $faker->word,
    ];
});
