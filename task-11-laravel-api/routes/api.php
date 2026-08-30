<?php

use App\Http\Controllers\ContactController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HealthController;
use App\Http\Controllers\TrainingController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\LogoutController;
use App\Http\Controllers\MeController;
use Illuminate\Support\Facades\Request;



Route::get('/health', [HealthController::class, 'health']);


Route::get('/profile',[TrainingController::class,'profile']);


Route::get('/skills',[TrainingController::class,'skills']);



Route::get('/training/tasks', [TrainingController::class,'tasks']);
Route::get('/training/tasks/{id}', [TrainingController::class,'getTask']);

Route:: post('/contact', [ContactController::class,'fillContactForm'] );



Route::get('/posts',[PostController::class,'getPosts']);
Route::get('/posts/{id}',[PostController::class,'getPost']);
Route::post('/posts',[PostController::class,'createPost']);
Route::put('/posts/{id}',[PostController::class,'updatePost']);
Route::delete('/posts/{id}',[PostController::class,'deletePost']);


Route::get('/categories',[CategoryController::class,'getCategories']);
Route::get('/categories/{id}',[CategoryController::class,'getCategory']);

Route::middleware('auth:sanctum')->get(
    '/me',
    [MeController::class, 'me']
);
Route::post('/register',[RegisterController::class,'register']);
Route::middleware('auth:sanctum')->post(
    '/logout',
    [LogoutController::class, 'logout']
);
Route::post('/login',[LoginController::class, 'login']);