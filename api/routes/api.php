<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Message;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/message', function (Request $request) {
    $messages = App\Message::all();

    $stats = new stdclass();
    $stats->count = count($messages);

    $result = new stdclass();
    $result->stats = $stats;
    $result->results = $messages;

    return json_encode($result);
});
