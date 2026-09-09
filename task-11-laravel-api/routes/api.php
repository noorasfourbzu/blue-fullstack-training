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
use App\Http\Controllers\PageController;
use App\Http\Controllers\ContentBlockController;


Route::get('/health', [HealthController::class, 'health']);


Route::get('/profile', [TrainingController::class, 'profile']);


Route::get('/skills', [TrainingController::class, 'skills']);



Route::get('/training/tasks', [TrainingController::class, 'tasks']);
Route::get('/training/tasks/{id}', [TrainingController::class, 'getTask']);

Route::post('/contact', [ContactController::class, 'fillContactForm']);



Route::get('/posts', [PostController::class, 'getPosts']);


Route::get('/categories', [CategoryController::class, 'getCategories']);
Route::get('/categories/{id}', [CategoryController::class, 'getCategory']);



Route::post('/register', [RegisterController::class, 'register']);
Route::post('/login', [LoginController::class, 'login']);


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [MeController::class, 'me']);
    Route::post('/logout', [LogoutController::class, 'logout']);
    Route::post('/posts', [PostController::class, 'createPost']);
    Route::get('/posts/my', [PostController::class, 'getMyPosts']);
    Route::put('/posts/{id}', [PostController::class, 'updatePost'])->whereNumber('id');
    Route::delete('/posts/{id}', [PostController::class, 'deletePost'])->whereNumber('id');

    Route::get('/pages', [PageController::class, 'index']);
    Route::post('/pages', [PageController::class, 'store']);
    Route::get('/pages/{page}', [PageController::class, 'show'])
        ->whereNumber('page');
    Route::put('/pages/{page}', [PageController::class, 'update'])
        ->whereNumber('page');
    Route::patch('/pages/{page}', [PageController::class, 'update'])
        ->whereNumber('page');
    Route::delete('/pages/{page}', [PageController::class, 'destroy'])
        ->whereNumber('page');

    // content block management for a page
    Route::post('/pages/{page}/blocks', [ContentBlockController::class, 'store'])
        ->whereNumber('page');
    Route::put('/pages/{page}/blocks/{block}', [ContentBlockController::class, 'update'])
        ->whereNumber('page')->whereNumber('block');
    Route::patch('/pages/{page}/blocks/{block}', [ContentBlockController::class, 'update'])
        ->whereNumber('page')->whereNumber('block');
    Route::delete('/pages/{page}/blocks/{block}', [ContentBlockController::class, 'destroy'])
        ->whereNumber('page')->whereNumber('block');
    Route::post('/pages/{page}/blocks/reorder', [ContentBlockController::class, 'reorder'])
        ->whereNumber('page');
});
Route::get('/posts/{id}', [PostController::class, 'getPost'])->whereNumber('id');

// public page slug 
Route::get('/pages/{slug}',[PageController::class, 'publicShow'])
-> where('slug','[A-Za-z0-9_-]+');
