<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use  App\Http\Resources\CategoryResource;
class CategoryController extends Controller
{

// GET /api/categries
    public function getCategories(){
  $categories = Category::all();
  return CategoryResource::collection($categories);
    }



// GET /api/categories/{id}
    public function getCategory($id){

  $category = Category::find($id);

  if(!$category){
      return response()->json(['message' => 'Category was not found'],404);
  }
  return new CategoryResource($category);
    }
}
