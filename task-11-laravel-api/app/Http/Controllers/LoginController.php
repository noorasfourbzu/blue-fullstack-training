<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
class LoginController extends Controller
{
    public function login(Request $request){



    
   $validated = $request -> validate([
    'email' => 'required|email',
    'password' => 'required|min:8| max:33',
   ]);

   if(!Auth::attempt([

   'email' => $validated['email'],
'password' => $validated['password'],

   ])){

   return response()->json([
                'message' => 'Invalid credentials',
            ], 401);
        }

        $user = Auth::user();
        $token = $user->createToken('myUser-tokens')->plainTextToken;

   


         return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
        ], 200);
    }
}
