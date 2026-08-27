<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;

class CategoryController extends Controller
{
    public function getCategories(){
  $categories = Category::all();
  return response() -> json($categories);
    }

    public function getCategory($id){
  $category = Category::find($id);

  if(!$category){
      return response()->json(['message' => 'Category was not found'],404);
  }
  return response() -> json($category);
    }
}
