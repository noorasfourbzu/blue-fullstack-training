<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\post;

class PostController extends Controller
{
    // Get /api/posts
  public function getPosts(){

  $posts = post::all();
  return response()->json($posts, 200);
  }

  // GET /api/posts/{id}
  public function getPost($id){

  $post = post::find($id);

  if(!$post ){
    return response()->json(['message' => 'Post was not found'],404);
  }


   return response() -> json($post,200);
  }




  // POST /api/posts
  public function createPost(Request $request){


$validated = $request->validate([
    'title' => 'required|string|max:200',
    'body' => 'required|string|max:500',
    'status'=> 'required|in:draft,published',
]);


$post = post::create($validated);

return response()->json($post,201);
  }


  // PUT /api/posts/{id}
 public function updatePost(Request $request, $id){

    $wantedPost = post::find($id);



    if(!$wantedPost){
        return response()->json([
                'message' => 'Post not found'
            ], 404);
    }

    $validated = $request ->validate([
  'title' => 'sometimes|required|string|max:200',
    'body' => 'sometimes|required|string|max:500',
    'status'=> 'sometimes|required|in:draft,published',

    ]);

    $wantedPost -> update($validated);

    return response() -> json($wantedPost,200);



 }
// Delete /api/posts/{id}
  public function deletePost($id){

  $wantedPost = post::find($id);

  if(!$wantedPost){
    return response() ->json([
        'message'=>'Post was not found'
    ],404);
  }

  $result = $wantedPost -> delete();

  if($result){
return response()->json([
                'message' => 'Post deleted successfully'
            ], 200);}

            
return response()->json([
            'message' => 'Failed to delete post'
        ], 500);

            


  }

}
