<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class HealthController extends Controller
{
    public function health(){
         return response()->json([
        'status' => 'ok',
        'application' => 'Training API',
        'message' => 'API is running successfully'
    ]);
    }
}
