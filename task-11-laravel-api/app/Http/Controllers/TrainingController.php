<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TrainingController extends Controller
{

public function profile(){
     return response()->json([
      'id' => 1,
        'name' => 'Noor Asfour',
        'training_track' => 'Full Stack Development',
        'current_task' => 'Laravel API'
    ]);
}
   

public function skills(){
    return response()->json([

'Laravel',
'PHP',
'JavaScript',
'API',
'Git',
'MySql'

]);
}


public function tasks(){

 return response() ->json([
[
    'id' => 1,
    'status' => 'done',
    'title' => 'HTML and CSS basics',
    'estimated_hours' => 8
],
[
    'id' => 2,
    'status' => 'done',
    'title' => 'JavaScripts basics',
    'estimated_hours' => 8
],
[
    'id' => 3,
    'status' => 'done',
    'title' => 'vue.js application',
    'estimated_hours' => 10
],
[
    'id' => 4,
    'status' => 'done',
    'title' => 'Pinia Store',
    'estimated_hours' => 9
],
[
    'id' => 5,
    'status' => 'in progress',
    'title' => 'Laravel API',
    'estimated_hours' => 8
],
[
    'id' => 6,
    'status' => 'in progress',
    'title' => 'DataBase Fundementals',
    'estimated_hours' => 9
]



    ]);

}
}
