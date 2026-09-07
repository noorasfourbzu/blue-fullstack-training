<?php

namespace Tests\Feature\Posts;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Feature\Support\CreateTestData;
use Tests\TestCase;

class PostsListTest extends TestCase
{
    use RefreshDatabase;
    use CreateTestData;

    public function test_posts_list_endpoint_returns_a_successful_response(): void
    {
        $author = User::factory()->create();
        $this->createPost($author, ['title' => 'First published post']);
        $this->createPost($author, ['title' => 'Second published post']);
        $response = $this->getJson('/api/posts');
        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'title', 'body', 'status', 'category', 'user'],
                ],
                'meta' => ['current_page', 'last_page', 'per_page', 'total'],
            ])
            ->assertJsonCount(2, 'data');
    }
}