<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;
use App\Models\Category;
use App\Http\Resources\PostResource;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;


class PostController extends Controller
{

use AuthorizesRequests;

    // Get /api/posts
  public function getPosts(Request $request){


  //$posts = Post::with('category')->get();
  $query = Post::with(['category', 'user']);  
  


  $request -> validate([
  'per_page' => 'sometimes|integer|min:1|max:50',
]);

  $allowedSortFields = ['created_at', 'title'];
  $allowedSortDirections = ['asc', 'desc'];
  $sortBy = $request->query('sort_by', 'created_at');
$sortDirection = $request->query('sort_direction', 'desc');


if (in_array($sortBy, $allowedSortFields) && in_array($sortDirection, $allowedSortDirections)) {
    $query->orderBy($sortBy, $sortDirection);
}

 if($request ->filled('search')){
  $query ->where('title','like','%' . $request ->search .'%');  // allows to do this GET /api/posts?search=  and search inside the title 
 }

 if ($request->filled('status')) {
    $query->where('status', $request->status); // GET /api/posts?status=published
}
if ($request->filled('category_id')) {
     $query->where('category_id', $request-> category_id);
}




$perPage = $request -> query('per_page',7);
$posts = $query -> paginate($perPage);
 return PostResource::collection($posts);

  }

  // GET /api/posts/{id}
  public function getPost($id){

  $post = Post::with(['category','user'])->find($id);

  if(!$post ){
    return response()->json(['message' => 'Post was not found'],404);
  }


   return new PostResource($post);
  }




  // POST /api/posts
  public function createPost(Request $request){


$validated = $request->validate([
    'title' => 'required|string|max:200',
    'body' => 'required|string|max:500',
    'status'=> 'required|in:draft,published',
    'category_id' => 'required|exists:categories,id',
]);


//1
$post = new Post($validated);
$post->user_id = $request->user()->id; 
$post -> save();
$post->load(['user', 'category']);
// 
// $user_id ["user_id"] = request()-> user() -> id;
// foreach($validated as $key => $value){
// echo $key ."=>" .$value . "\n";

// }
// $post = Post::create($validated );

return new PostResource($post);

  }


  // PUT /api/posts/{id}
 public function updatePost(Request $request, $id){

    $wantedPost = Post::find($id);



    if(!$wantedPost){
        return response()->json([
                'message' => 'Post not found'
            ], 404);
    }

   
// return response()->json([
//     'authenticated_user_id' => auth()->id(),
//     'post_owner_id' => $wantedPost->user_id,
// ]);
  $this -> authorize('update', $wantedPost);


    $validated = $request ->validate([
  'title' => 'sometimes|required|string|max:200',
    'body' => 'sometimes|required|string|max:500',
    'status'=> 'sometimes|required|in:draft,published',
    'category_id' => 'sometimes|required|exists:categories,id',

    ]);

    $wantedPost -> update($validated);
      $wantedPost->load(['user', 'category']);


    return new PostResource( $wantedPost );



 }
// Delete /api/posts/{id}
  public function deletePost($id){

  $wantedPost = Post::find($id);

  if(!$wantedPost){
    return response() ->json([
        'message'=>'Post was not found'
    ],404);
  }

// return response()->json([
//     'authenticated_user_id' => auth()->id(),
//     'post_owner_id' => $wantedPost->user_id,
//     'delete_policy_result' => auth()->user()->can('delete', $wantedPost),
// ]);

      $this -> authorize('delete', $wantedPost);
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
