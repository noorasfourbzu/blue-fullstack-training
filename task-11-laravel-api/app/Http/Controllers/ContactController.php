<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ContactController extends Controller
{
 public function fillContactForm(Request $request){


 $validated = $request -> validate([
'name'=>'required',
'email'=> 'required|email',
 'subject' => 'nullable',
 'message' =>'required|min:10|max:100',


 ]);
 return response() -> json([
    'success' => true,
    'message' => 'done sending contact message successfully',
    'data' => $validated,
 ]);
 }
}
