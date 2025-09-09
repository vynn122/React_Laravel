<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\RoleController;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);
Route::middleware(['auth:api'])->group(function () {
    Route::apiResource('role', RoleController::class);
    Route::apiResource('brand', BrandController::class)->withoutMiddleware(['auth:api']);
    Route::apiResource('category', CategoryController::class)->withoutMiddleware(['auth:api']);
    Route::apiResource('product', ProductController::class)->withoutMiddleware(['auth:api']);
    // Route::delete('role/{id}', [RoleController::class, 'destroy']);
    //->withoutMiddleware(['auth:api'])
});
