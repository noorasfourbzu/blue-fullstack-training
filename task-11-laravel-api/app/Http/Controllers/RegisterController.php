<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RegisterController extends Controller
{
    public function register(Request $request){


   $validated = $request -> validate([
    'name' => 'required|string|unique:users,name|max:50',
    'email' => 'required|email|unique:users,email',
    'password' => 'required| confirmed |min:8| max:33',
   ]);


   if($validated){
    $user = User::create([
        'name' => $validated['name'],
        'email'=> $validated['email'],
        'password'=> Hash::make($validated['password']),
    ]);


   }

   return response()->json([
            'message' => 'User registered successfully',
        ], 201);
    }
}


