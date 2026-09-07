<?php

namespace Tests\Feature\Support;

use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Str;

trait CreateTestData
{
    
protected function createCategory(string $name = 'Technology'): Category
    {
        $category = new Category();
        $category->name = $name;
        $category->slug = Str::slug($name) . '-' . uniqid();
        $category->save();
        return $category;
    }

    protected function createPost(User $owner, array $overrides = []): Post
    {
        $category = $overrides['category'] ?? $this->createCategory();

        $post = new Post([
            'title' => $overrides['title'] ?? 'Sample Post Title',
            'body' => $overrides['body'] ?? 'Sample post body content for testing.',
            'status' => $overrides['status'] ?? 'published',
        ]);
        $post->category_id = $category->id;
        $post->user_id = $owner->id;
        $post->save();

        return $post;
    }
}