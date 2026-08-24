<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HealthController;
use App\Http\Controllers\TrainingController;

Route::get('/health', [HealthController::class, 'health']);


Route::get('/profile',[TrainingController::class,'profile']);


Route::get('/skills',[TrainingController::class,'skills']);



Route::get('/training/tasks', [TrainingController::class,'tasks']);

